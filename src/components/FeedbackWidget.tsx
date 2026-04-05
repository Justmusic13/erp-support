import React, { useState } from 'react';
import { SendIcon, XIcon, CheckCircleIcon } from 'lucide-react';
interface FeedbackWidgetProps {
  erpId: string | null;
}
export function FeedbackWidget({ erpId }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('feedback');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>(
    'idle'
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Opens the user's email client pre-filled with the feedback.
    // TODO: Replace with your Power Automate / webhook URL for fully in-app submission.
    const subject = encodeURIComponent(`[${type.toUpperCase()}] Partner Docs Feedback${erpId ? ` — ${erpId}` : ''}`);
    const body = encodeURIComponent(
      `Type: ${type}\nContext: ${erpId || 'General'}\n\n${message}\n\n${email ? `Reply to: ${email}` : ''}`
    );
    window.location.href = `mailto:support@partnerdocs.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setMessage('');
        setEmail('');
      }, 3000);
    }, 800);
  };
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#1A1F36] hover:bg-[#1A1F36]/90 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5C4EBF] flex items-center justify-center group"
        aria-label="Open feedback form">
        
        <SendIcon className="h-6 w-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
      </button>);

  }
  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] z-50 overflow-hidden flex flex-col">
      <div className="bg-[#1A1F36] px-5 py-4 flex justify-between items-center">
        <h3 className="text-white font-bold flex items-center">
          <SendIcon className="h-4 w-4 mr-2 text-[#5C4EBF]" />
          Feedback & Support
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/70 hover:text-white focus:outline-none rounded-full p-1 hover:bg-white/10 transition-colors"
          aria-label="Close feedback form">
          
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="p-6">
        {status === 'success' ?
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircleIcon className="h-12 w-12 text-[#5C4EBF] mb-3" />
            <h4 className="text-lg font-bold text-[#1A1F36]">Thank You!</h4>
            <p className="text-sm text-[#4B5563] mt-1">
              Your feedback has been submitted successfully.
            </p>
          </div> :

        <form onSubmit={handleSubmit} className="space-y-4">
            {erpId &&
          <div className="text-xs text-[#4B5563] bg-[#F5F7FA] p-2 rounded border border-[#E5E7EB] mb-2">
                Context:{' '}
                <span className="font-bold text-[#1A1F36]">{erpId}</span>
              </div>
          }

            <div>
              <label
              htmlFor="feedback-type"
              className="block text-sm font-bold text-[#1A1F36] mb-1">
              
                What is this regarding?
              </label>
              <select
              id="feedback-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent bg-white">
              
                <option value="feedback">General Feedback</option>
                <option value="bug">Report an Issue</option>
                <option value="feature">Feature Request</option>
                <option value="support">Need Support</option>
              </select>
            </div>

            <div>
              <label
              htmlFor="feedback-message"
              className="block text-sm font-bold text-[#1A1F36] mb-1">
              
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
              id="feedback-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent resize-none bg-white" />
            
            </div>

            <div>
              <label
              htmlFor="feedback-email"
              className="block text-sm font-bold text-[#1A1F36] mb-1">
              
                Email (optional)
              </label>
              <input
              id="feedback-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent bg-white" />
            
            </div>

            <button
            type="submit"
            disabled={status === 'submitting' || !message.trim()}
            className="w-full bg-[#5C4EBF] hover:bg-[#5C4EBF]/90 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed mt-2">
            
              {status === 'submitting' ?
            <span className="inline-block animate-pulse">
                  Submitting...
                </span> :

            <>
                  <SendIcon className="h-4 w-4 mr-2" />
                  Submit
                </>
            }
            </button>
          </form>
        }
      </div>
    </div>);

}