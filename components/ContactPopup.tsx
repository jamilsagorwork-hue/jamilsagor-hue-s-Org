
import React, { useState } from 'react';
import { supabase, TableNames } from '../lib/supabase';

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactPopup: React.FC<ContactPopupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const { error } = await supabase
        .from(TableNames.MESSAGES)
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            message: formData.message 
          }
        ]);

      if (error) throw error;

      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', email: '', message: '' });
      }, 2000);
    } catch (err) {
      console.error('Error sending message:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative glass-panel w-full max-w-lg rounded-2xl border-emerald-500/30 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-emerald-500/10 p-6 border-b border-emerald-500/20 flex items-center justify-between">
          <h2 className="text-xl font-bold font-mono text-emerald-400">CONTACT_TERMINAL</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-8">
          {status === 'success' ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl animate-bounce">✅</div>
              <h3 className="text-2xl font-bold text-emerald-400">TRANSMISSION RECEIVED</h3>
              <p className="text-slate-400 font-mono text-sm">Target reached. Awaiting response.</p>
            </div>
          ) : status === 'error' ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl">⚠️</div>
              <h3 className="text-2xl font-bold text-red-500">TRANSMISSION FAILED</h3>
              <p className="text-slate-400 font-mono text-sm">System error. Please try again later.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-emerald-500 uppercase">Identity.Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Who are you?"
                  className="w-full bg-slate-900 border border-emerald-500/20 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-emerald-500 uppercase">Identity.Email</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="Where to reply?"
                  className="w-full bg-slate-900 border border-emerald-500/20 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-emerald-500 uppercase">Transmission.Data</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Input your requirements..."
                  className="w-full bg-slate-900 border border-emerald-500/20 rounded-lg p-3 text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
              >
                {status === 'sending' ? 'UPLOADING...' : 'INITIATE UPLOAD'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
