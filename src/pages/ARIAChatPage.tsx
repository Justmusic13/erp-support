import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ERPConfig } from '../config/erpConfig';
import {
  SendIcon,
  BotIcon,
  UserIcon,
  AlertCircleIcon,
  ServerIcon,
  WifiOffIcon
} from 'lucide-react';

// ─── Default Direct Line Config (from CoPilot Studio) ────────────────────────
// Matches the working agent in the HTML reference file.
// Each ERP can override via copilotEndpoint in the admin panel.
const DEFAULT_TOKEN_URL =
  'https://defaultf20e09a3a5b549d2bc3e54a56af886.75.environment.api.powerplatform.com/powervirtualagents/botsbyschema/copilots_header_a6902/directline/token?api-version=2022-03-01-preview';
const DL_BASE = 'https://europe.directline.botframework.com/v3/directline';
// ─────────────────────────────────────────────────────────────────────────────

interface ARIAChatPageProps {
  erpConfig: ERPConfig;
  embedded?: boolean;
  initialPrompt?: string | null;
  onPromptUsed?: () => void;
}

type MessageRole = 'agent' | 'user' | 'error';
type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
};

type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

export function ARIAChatPage({
  erpConfig,
  embedded = false,
  initialPrompt = null,
  onPromptUsed
}: ARIAChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: erpConfig.agent.welcomeMessage,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasUsedInitialPrompt = useRef(false);

  // Direct Line state in refs to avoid stale-closure / re-render issues
  const tokenRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingResolveRef = useRef<((msgs: any[]) => void) | null>(null);
  const pendingUserTextRef = useRef('');
  const collectedBotMsgsRef = useRef<any[]>([]);
  const isMounted = useRef(true);
  const sendingRef = useRef(false);

  // copilotEndpoint stores the Direct Line token URL (configurable per ERP)
  const tokenUrl: string =
    erpConfig.agent.copilotEndpoint?.trim() || DEFAULT_TOKEN_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const addMessage = useCallback((role: MessageRole, content: string) => {
    const msg: Message = {
      id: `${Date.now()}-${Math.random()}`,
      role,
      content,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, msg]);
  }, []);

  // ── WebSocket ──────────────────────────────────────────────────────────────
  const connectWebSocket = useCallback((streamUrl: string) => {
    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      let data: any;
      try { data = JSON.parse(event.data); } catch { return; }
      const activities: any[] = data.activities || [];
      const userTextLower = pendingUserTextRef.current.toLowerCase().trim();

      for (const a of activities) {
        if (a.type !== 'message' || !a.from || a.from.id === 'user') continue;
        const txt = (a.text || '').toLowerCase().trim();
        if (txt === userTextLower) continue;
        collectedBotMsgsRef.current.push(a);
      }

      if (collectedBotMsgsRef.current.length > 0 && pendingResolveRef.current) {
        clearTimeout((ws as any)._flushTimer);
        (ws as any)._flushTimer = setTimeout(() => {
          if (pendingResolveRef.current) {
            pendingResolveRef.current(collectedBotMsgsRef.current.slice());
            collectedBotMsgsRef.current = [];
            pendingResolveRef.current = null;
          }
        }, 150);
      }
    };

    ws.onclose = () => {
      if (pendingResolveRef.current) {
        pendingResolveRef.current([]);
        pendingResolveRef.current = null;
      }
      wsRef.current = null;
      if (isMounted.current) setConnectionStatus('idle');
    };

    ws.onerror = () => {
      if (isMounted.current) setConnectionStatus('error');
    };

    return ws;
  }, []);

  // ── Conversation lifecycle ─────────────────────────────────────────────────
  const ensureConversation = useCallback(async () => {
    if (
      tokenRef.current &&
      conversationIdRef.current &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) return;

    if (isMounted.current) setConnectionStatus('connecting');

    // 1. Get Direct Line token
    const tokenRes = await fetch(tokenUrl);
    if (!tokenRes.ok) throw new Error(`Failed to get token (${tokenRes.status})`);
    const tokenData = await tokenRes.json();
    tokenRef.current = tokenData.token;

    // 2. Start conversation
    const startRes = await fetch(`${DL_BASE}/conversations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenRef.current}`,
        'Content-Type': 'application/json'
      }
    });
    if (!startRes.ok) throw new Error(`Failed to start conversation (${startRes.status})`);
    const startData = await startRes.json();
    conversationIdRef.current = startData.conversationId;

    if (!startData.streamUrl) throw new Error('No WebSocket URL returned');
    const ws = connectWebSocket(startData.streamUrl);

    // 3. Wait for WS to open
    await new Promise<void>((resolve, reject) => {
      if (ws.readyState === WebSocket.OPEN) return resolve();
      ws.addEventListener('open', () => resolve(), { once: true });
      ws.addEventListener('error', () => reject(new Error('WebSocket failed to open')), { once: true });
    });

    if (isMounted.current) setConnectionStatus('connected');
  }, [tokenUrl, connectWebSocket]);

  const sendActivity = useCallback(async (text: string) => {
    await ensureConversation();
    const res = await fetch(
      `${DL_BASE}/conversations/${conversationIdRef.current}/activities`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenRef.current}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'message', from: { id: 'user' }, text })
      }
    );
    if (!res.ok) throw new Error(`Failed to send (${res.status})`);
    return res.json();
  }, [ensureConversation]);

  const waitForBotResponse = useCallback(
    (userText: string, timeoutMs = 120000): Promise<any[]> => {
      pendingUserTextRef.current = userText;
      collectedBotMsgsRef.current = [];
      return new Promise((resolve) => {
        pendingResolveRef.current = resolve;
        setTimeout(() => {
          if (pendingResolveRef.current) {
            pendingResolveRef.current(collectedBotMsgsRef.current.slice());
            collectedBotMsgsRef.current = [];
            pendingResolveRef.current = null;
          }
        }, timeoutMs);
      });
    },
    []
  );

  // Pre-connect on mount so first message feels instant
  useEffect(() => {
    isMounted.current = true;
    ensureConversation().catch(() => { /* will retry on first send */ });
    return () => {
      isMounted.current = false;
      if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    };
  }, [ensureConversation]);

  // ── Send flow ──────────────────────────────────────────────────────────────
  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || sendingRef.current) return;
      sendingRef.current = true;
      setInputValue('');
      addMessage('user', text);
      setIsTyping(true);

      try {
        // Listen BEFORE sending to not miss fast responses (mirrors HTML pattern)
        const responsePromise = waitForBotResponse(text, 120000);
        sendActivity(text).catch((err: Error) => {
          if (isMounted.current) {
            setIsTyping(false);
            addMessage('error', `Send failed: ${err.message}`);
          }
        });

        const botMessages = await responsePromise;

        if (isMounted.current) {
          setIsTyping(false);
          if (botMessages.length > 0) {
            botMessages.forEach((msg: any) => {
              let botText: string = msg.text || '';
              // Handle adaptive-card attachments
              if (!botText && msg.attachments?.length) {
                const texts: string[] = [];
                msg.attachments.forEach((att: any) => {
                  att.content?.body?.forEach((b: any) => {
                    if (b.text) texts.push(b.text);
                  });
                });
                botText = texts.join('\n\n');
              }
              if (botText) addMessage('agent', botText);
            });
          } else {
            addMessage(
              'agent',
              'No response received — the agent may be taking longer than expected. Please try again.'
            );
          }
        }
      } catch (err: any) {
        if (isMounted.current) {
          setIsTyping(false);
          addMessage('error', `Connection error: ${err.message}`);
          tokenRef.current = null;
          conversationIdRef.current = null;
          if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
          setConnectionStatus('error');
        }
      }

      sendingRef.current = false;
    },
    [addMessage, sendActivity, waitForBotResponse]
  );

  // Auto-send initial prompt
  useEffect(() => {
    if (initialPrompt && !hasUsedInitialPrompt.current) {
      hasUsedInitialPrompt.current = true;
      setInputValue(initialPrompt);
      setTimeout(() => {
        handleSend(initialPrompt);
        if (onPromptUsed) onPromptUsed();
      }, 500);
    }
  }, [initialPrompt, handleSend, onPromptUsed]);

  const handleEscalate = () => {
    alert(
      'Support escalation initiated. A ticket has been created with this conversation history.'
    );
  };

  // Basic markdown → safe HTML (bold, italic, inline code, line breaks)
  const renderMarkdown = (text: string) => {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const html = escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(
        /`([^`]+)`/g,
        '<code style="background:#f4f4f8;padding:1px 5px;border-radius:3px;font-family:monospace;font-size:0.88em;border:1px solid #e5e7eb">$1</code>'
      )
      .replace(/\n/g, '<br/>');
    return { __html: html };
  };

  const statusDot: Record<ConnectionStatus, string> = {
    idle:       'bg-gray-400',
    connecting: 'bg-yellow-400 animate-pulse',
    connected:  'bg-green-400',
    error:      'bg-red-400'
  };
  const statusLabel: Record<ConnectionStatus, string> = {
    idle:       'Connecting…',
    connecting: 'Connecting…',
    connected:  'Copilot Connected',
    error:      'Connection Error — click to retry'
  };

  return (
    <div
      className={`flex flex-col bg-white ${
        embedded
          ? 'h-[600px]'
          : 'h-[calc(100vh-12rem)] min-h-[500px] rounded-xl shadow-sm border border-[#E5E7EB]'
      } overflow-hidden animate-in fade-in duration-300`}
    >
      {/* Header */}
      <div className="bg-[#1A1F36] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm">
            <BotIcon className="h-6 w-6 text-[#1A1F36]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">
              {erpConfig.agent.name}
            </h2>
            <button
              onClick={() => {
                if (connectionStatus === 'error') {
                  tokenRef.current = null;
                  conversationIdRef.current = null;
                  ensureConversation().catch(() => {});
                }
              }}
              className="text-white/70 text-xs flex items-center font-medium hover:text-white/90 transition-colors"
            >
              <span className={`h-2 w-2 rounded-full mr-1.5 ${statusDot[connectionStatus]}`} />
              {statusLabel[connectionStatus]}
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center text-xs font-bold bg-[#5C4EBF]/20 text-[#5C4EBF] px-2 py-1 rounded-md border border-[#5C4EBF]/30">
            <ServerIcon className="h-3 w-3 mr-1" />
            Live Agent
          </div>
          <button
            onClick={handleEscalate}
            className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg flex items-center transition-colors"
          >
            <AlertCircleIcon className="h-3.5 w-3.5 mr-1.5" />
            Escalate to Support
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#F5F7FA]">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((msg) => {
            if (msg.role === 'error') {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="text-sm text-[#E8567F] bg-[#E8567F]/10 border border-[#E8567F]/20 rounded-lg px-4 py-3 max-w-[90%] flex items-start gap-2">
                    <WifiOffIcon className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{msg.content}</span>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-[#1A1F36] ml-3' : 'bg-[#5C4EBF]/20 mr-3'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <UserIcon className="h-4 w-4 text-white" />
                    ) : (
                      <BotIcon className="h-4 w-4 text-[#1A1F36]" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#5C4EBF] text-white rounded-tr-none font-medium'
                        : 'bg-white text-[#4B5563] border border-[#E5E7EB] rounded-tl-none'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <p
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                      />
                    )}
                    <span
                      className={`text-[10px] mt-2 block font-medium ${
                        msg.role === 'user' ? 'text-white/70' : 'text-[#9CA3AF]'
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[80%]">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#5C4EBF]/20 mr-3 flex items-center justify-center">
                  <BotIcon className="h-4 w-4 text-[#1A1F36]" />
                </div>
                <div className="px-4 py-4 bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-none shadow-sm flex space-x-1.5 items-center">
                  <div className="h-2 w-2 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 bg-[#9CA3AF] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested prompts (show only before first user message) */}
      {messages.length === 1 && !initialPrompt && (
        <div className="bg-white px-6 py-3 border-t border-[#E5E7EB] flex gap-2 overflow-x-auto">
          {erpConfig.agent.suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(suggestion)}
              className="flex-shrink-0 text-xs font-bold bg-[#F5F7FA] hover:bg-[#E5E7EB] text-[#1A1F36] px-4 py-2 rounded-full transition-colors border border-[#E5E7EB]"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white p-4 border-t border-[#E5E7EB]">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
          className="max-w-3xl mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask ARIA a question…"
            className="w-full pl-4 pr-12 py-3 bg-[#F5F7FA] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent focus:bg-white transition-colors text-[#1A1F36]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 p-2 bg-[#5C4EBF] text-white rounded-lg hover:bg-[#5C4EBF]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <SendIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
