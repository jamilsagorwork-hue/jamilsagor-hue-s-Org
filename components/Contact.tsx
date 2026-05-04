
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase, TableNames } from '../lib/supabase';

interface ContactProps {
  onOpenPopup?: () => void;
}

export const Contact: React.FC<ContactProps> = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const { error } = await supabase
        .from(TableNames.MESSAGES)
        .insert([{ 
          name: formData.name, 
          email: formData.email, 
          message: formData.message 
        }]);

      if (error) throw error;

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Error sending message:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold font-mono">COMM_PROTOCOL</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="glass-panel p-8 rounded-2xl border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-emerald-500/30">ID: MSG_INITIATE</div>
            <h3 className="text-xl font-bold font-mono text-emerald-500 mb-6 uppercase tracking-widest">Initiate_Transmission</h3>
            
            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="text-5xl">✅</div>
                <h4 className="text-xl font-bold text-emerald-400">MESSAGE_UPLINK_SUCCESS</h4>
                <p className="text-slate-500 text-sm font-mono">Data packet delivered to encrypted buffer.</p>
                <button onClick={() => setStatus('idle')} className="text-emerald-500 underline text-xs font-mono uppercase">New Transmission</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-500/50 uppercase">Sender_Alias</label>
                    <input 
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-900/50 border border-emerald-500/10 rounded p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                      placeholder="GUEST_USER"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-emerald-500/50 uppercase">Reply_Address</label>
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-900/50 border border-emerald-500/10 rounded p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all font-mono"
                      placeholder="node@network.com"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-emerald-500/50 uppercase">Payload_Data</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-slate-900/50 border border-emerald-500/10 rounded p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-all font-mono resize-none"
                    placeholder="Input message context..."
                  />
                </div>
                <button 
                  disabled={status === 'sending'}
                  className="w-full py-4 bg-emerald-500 text-slate-950 font-black rounded hover:bg-emerald-400 active:scale-95 transition-all uppercase text-xs tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                >
                  {status === 'sending' ? 'Executing_Upload...' : 'Send_Transmission'}
                </button>
                {status === 'error' && <p className="text-red-500 text-[10px] font-mono text-center">LINK_FAILURE: RETRY_REQUIRED</p>}
              </form>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <ContactInfo 
            title="Direct_Line" 
            value="01307541441" 
            icon="📱" 
            link="tel:01307541441"
          />
          <ContactInfo 
            title="Gateway_Mail" 
            value="jmisagor079@gmail.com" 
            icon="📧" 
            link="mailto:jmisagor079@gmail.com"
          />
          <ContactInfo 
            title="Social_Link" 
            value="Facebook Profile" 
            icon="🔗" 
            link="https://www.facebook.com/profile.php?id=61577810570021"
          />
          
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02]">
            <h3 className="font-mono text-[10px] text-emerald-500 uppercase mb-4 tracking-[0.2em]">Network_Status</h3>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-xs text-slate-400 font-mono">AVAILABLE_FOR_DEPLOYMENT</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ContactInfo: React.FC<{ title: string; value: string; icon: string; link: string }> = ({ title, value, icon, link }) => (
  <a 
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="block glass-panel p-6 rounded-2xl border border-emerald-500/10 hover:border-emerald-500/40 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="text-2xl group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <h3 className="text-xs font-mono text-emerald-500 uppercase">{title}</h3>
        <p className="text-slate-100 font-medium">{value}</p>
      </div>
    </div>
  </a>
);
