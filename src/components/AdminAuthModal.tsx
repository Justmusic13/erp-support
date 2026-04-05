import React, { useState } from 'react';
import { XIcon, LockIcon } from 'lucide-react';
interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}
export function AdminAuthModal({
  isOpen,
  onClose,
  onLogin
}: AdminAuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@partnerdocs.com' && password === 'password') {
      setError('');
      setEmail('');
      setPassword('');
      onLogin();
      onClose();
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F36]/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-[#1A1F36] flex items-center">
            <LockIcon className="h-5 w-5 mr-2 text-[#5C4EBF]" />
            Admin Sign-in
          </h2>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#1A1F36] transition-colors">
            
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error &&
          <div className="bg-[#E8567F]/10 text-[#E8567F] p-3 rounded-lg text-sm font-bold border border-[#E8567F]/20">
              {error}
            </div>
          }
          <div>
            <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none transition-all text-[#1A1F36] bg-[#F5F7FA] focus:bg-white"
              placeholder="admin@partnerdocs.com"
              required />
            
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4B5563] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#5C4EBF] focus:border-transparent outline-none transition-all text-[#1A1F36] bg-[#F5F7FA] focus:bg-white"
              placeholder="••••••••"
              required />
            
          </div>
          <button
            type="submit"
            className="w-full bg-[#5C4EBF] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#5C4EBF]/90 transition-colors mt-2 shadow-sm">
            
            Sign In
          </button>
        </form>
      </div>
    </div>);

}