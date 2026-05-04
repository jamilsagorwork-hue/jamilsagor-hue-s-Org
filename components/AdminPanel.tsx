
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, TableNames } from '../lib/supabase';
import { Message, Capability } from '../types';

export const AdminPanel: React.FC<{ onBack: () => void, onProfileUpdate: (url: string) => void }> = ({ onBack, onProfileUpdate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'messages' | 'capabilities' | 'settings'>('dashboard');
  
  // Data State
  const [messages, setMessages] = useState<Message[]>([]);
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [profileUrl, setProfileUrl] = useState(localStorage.getItem('jamil_profile_img') || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
      fetchCapabilities();
    }
  }, [isAuthenticated]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from(TableNames.MESSAGES)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCapabilities = async () => {
    try {
      const { data, error } = await supabase
        .from(TableNames.CAPABILITIES)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setCapabilities(data.map(item => ({
          id: item.id,
          title: item.title,
          imageUrl: item.image_url,
          description: item.description
        })));
        localStorage.setItem('jamil_capabilities', JSON.stringify(data));
      }
    } catch (err) {
      console.warn('Supabase capabilities fetch failed, using local fallback:', err);
      const local = JSON.parse(localStorage.getItem('jamil_capabilities') || '[]');
      setCapabilities(local);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Jamil321#') {
      setIsAuthenticated(true);
    } else {
      alert('ACCESS_DENIED: Invalid Credentials');
    }
  };

  const handleSaveProfile = async () => {
    localStorage.setItem('jamil_profile_img', profileUrl);
    onProfileUpdate(profileUrl);
    
    try {
      await supabase
        .from(TableNames.SETTINGS)
        .upsert({ key: 'profile_image', value: profileUrl }, { onConflict: 'key' });
      alert('System profile updated in cloud.');
    } catch (err) {
      console.error('Error syncing profile to cloud:', err);
      alert('Profile updated locally only.');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Erase this message from history?')) return;
    
    try {
      const { error } = await supabase
        .from(TableNames.MESSAGES)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setMessages(messages.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to erase trace.');
    }
  };

  const handleAddCapability = async () => {
    const title = prompt('Project Title:');
    const url = prompt('Image URL:');
    const desc = prompt('Description:');
    
    if (title && url && desc) {
      try {
        const { data, error } = await supabase
          .from(TableNames.CAPABILITIES)
          .insert([{ title, image_url: url, description: desc }])
          .select();
        
        if (error) throw error;
        
        if (data) {
          const newItem = { 
            id: data[0].id, 
            title: data[0].title, 
            imageUrl: data[0].image_url, 
            description: data[0].description 
          };
          setCapabilities([newItem, ...capabilities]);
        }
      } catch (err) {
        console.error('Error adding capability:', err);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 font-mono">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 rounded-2xl w-full max-w-md border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        >
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-black text-emerald-500 underline uppercase tracking-[0.2em]">GATEWAY_CONTROL</h2>
            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">Authorized Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-emerald-500/50 uppercase ml-1">Secure_Key_Input</label>
              <input 
                autoFocus
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-500/20 rounded p-4 text-emerald-500 text-center tracking-[0.5em] focus:outline-none focus:border-emerald-500 focus:bg-slate-900/80 transition-all"
              />
            </div>
            <button className="w-full py-4 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              INITIATE_HANDSHAKE
            </button>
            <button onClick={onBack} type="button" className="w-full text-slate-500 text-[10px] hover:text-emerald-500 transition-colors uppercase tracking-widest">
              TERMINATE_SESSION
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-emerald-500/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-500/50 text-[10px] mb-2 uppercase tracking-[0.3em]">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              System_Status: Optimal
            </div>
            <h2 className="text-4xl font-black text-emerald-500 tracking-tighter">JAMSAGOR_CONSOLE<span className="animate-pulse">_</span></h2>
          </div>
          
          <nav className="flex bg-slate-900/50 p-1 rounded-lg border border-emerald-500/10">
            {[
              { id: 'dashboard', label: 'DASHBOARD', icon: '📊' },
              { id: 'messages', label: 'INBOX', icon: '📨' },
              { id: 'capabilities', label: 'SYSTEM', icon: '🛠️' },
              { id: 'settings', label: 'CORE', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded flex items-center gap-2 text-[10px] font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500 text-slate-950' 
                    : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <button onClick={onBack} className="ml-2 px-4 py-2 text-red-500/50 hover:text-red-500 transition-colors text-[10px] font-bold">
              [EXIT]
            </button>
          </nav>
        </div>

        <main className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid md:grid-cols-3 gap-6"
              >
                <div className="glass-panel p-6 rounded-2xl border-emerald-500/10">
                  <h3 className="text-[10px] text-emerald-500 uppercase mb-4 tracking-widest">Inbound_Traffic</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-white">{messages.length}</span>
                    <span className="text-2xl opacity-20">📨</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-4 uppercase">Total messages received</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-emerald-500/10">
                  <h3 className="text-[10px] text-emerald-500 uppercase mb-4 tracking-widest">System_Nodes</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-white">{capabilities.length}</span>
                    <span className="text-2xl opacity-20">🛠️</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-4 uppercase">Capabilities online</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl border-emerald-500/10">
                  <h3 className="text-[10px] text-emerald-500 uppercase mb-4 tracking-widest">Last_Sync</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">READY</span>
                    <span className="text-2xl opacity-20">📡</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-4 uppercase">Cloud connection active</p>
                </div>

                <div className="md:col-span-3 glass-panel p-8 rounded-2xl border-emerald-500/10 bg-emerald-500/[0.02]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded bg-emerald-500/20 flex items-center justify-center">🚀</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">System Overview</h3>
                      <p className="text-xs text-slate-500">Node monitoring and status report</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-[10px] text-emerald-500 uppercase tracking-widest mb-2">Recent_Transmissions</p>
                      {messages.slice(0, 5).length > 0 ? (
                        messages.slice(0, 5).map((m, i) => (
                          <div key={i} className="p-3 bg-slate-950 rounded border border-emerald-500/5 flex justify-between items-center group cursor-pointer hover:border-emerald-500/20" onClick={() => setActiveTab('messages')}>
                            <div>
                              <p className="text-[10px] text-emerald-400 font-bold">{m.name}</p>
                              <p className="text-[9px] text-slate-500 truncate max-w-[150px]">{m.message}</p>
                            </div>
                            <span className="text-[8px] text-slate-600 font-mono">[{new Date(m.created_at || '').toLocaleTimeString()}]</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[9px] text-slate-600 italic">No incoming data...</p>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-950 rounded border border-emerald-500/5">
                        <div className="flex justify-between text-[10px] uppercase mb-2">
                          <span className="text-slate-400">Database Connection</span>
                          <span className="text-emerald-500">CONNECTED</span>
                        </div>
                        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-full"></div>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-950 rounded border border-emerald-500/5">
                        <div className="flex justify-between text-[10px] uppercase mb-2">
                          <span className="text-slate-400">Secure Protocol</span>
                          <span className="text-emerald-500">V2.4_ENABLED</span>
                        </div>
                        <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 w-[85%]"></div>
                        </div>
                      </div>
                      <div className="p-2 border border-emerald-500/10 rounded text-[8px] text-slate-500 font-mono font-bold text-center uppercase tracking-widest">
                        Uptime: 99.98% // Nodes: Active
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div 
                key="messages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-emerald-500 uppercase tracking-widest">Inbound_Messages</h3>
                  <button onClick={fetchMessages} className="text-[10px] text-emerald-500/50 hover:text-emerald-500 uppercase">Refresh_Buffer</button>
                </div>
                
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 text-[10px] uppercase">Decrypting_Transmissions...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4 glass-panel rounded-2xl border-emerald-500/5">
                      <span className="text-4xl opacity-10">📡</span>
                      <p className="text-slate-500 text-[10px] uppercase">Zero_Transmissions_In_History</p>
                    </div>
                  ) : (
                    messages.map((m, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={m.id} 
                        className="glass-panel p-6 rounded-2xl border border-emerald-500/10 flex justify-between items-start gap-6 hover:border-emerald-500/30 transition-all group"
                      >
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center text-xs">👤</span>
                              <div>
                                <h4 className="text-emerald-400 font-bold">{m.name}</h4>
                                <p className="text-[10px] text-slate-500">{m.email}</p>
                              </div>
                            </div>
                            <span className="text-[9px] text-slate-600 uppercase tracking-widest">
                              {m.created_at ? new Date(m.created_at).toLocaleString() : 'Recent'}
                            </span>
                          </div>
                          <div className="p-4 bg-slate-950/50 rounded border border-emerald-500/5">
                            <p className="text-sm text-slate-300 leading-relaxed italic">{m.message}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => m.id && handleDeleteMessage(m.id)}
                          className="w-10 h-10 rounded bg-red-500/5 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all"
                          title="Purge Message"
                        >
                          🗑️
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'capabilities' && (
              <motion.div 
                key="capabilities"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center border-b border-emerald-500/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-emerald-500 uppercase tracking-widest">System_Nodes</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Configure portfolio capability modules</p>
                  </div>
                  <button onClick={handleAddCapability} className="bg-emerald-500 text-slate-950 px-6 py-2 rounded text-[10px] font-black hover:bg-emerald-400 transition-all uppercase shadow-[0_0_20px_rgba(16,185,129,0.2)]">+ Add_Node</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {capabilities.map((c, i) => (
                    <motion.div 
                      key={c.id} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-panel p-4 rounded-2xl border border-emerald-500/10 group hover:border-emerald-500/40 transition-all overflow-hidden"
                    >
                      <div className="aspect-video relative overflow-hidden rounded-lg mb-4 border border-emerald-500/10">
                        <img src={c.imageUrl} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                        <div className="absolute inset-0 bg-emerald-500/10 opacity-40 mix-blend-overlay"></div>
                      </div>
                      <h4 className="font-bold text-emerald-400 truncate mb-2">{c.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-3 mb-6 leading-relaxed italic">{c.description}</p>
                      <button 
                        onClick={() => {
                          if(confirm('Confirm deletion of this capability block?')) {
                            const updated = capabilities.filter(item => item.id !== c.id);
                            setCapabilities(updated);
                          }
                        }}
                        className="w-full py-2 text-[9px] text-red-500/40 hover:text-red-500 hover:bg-red-500/5 rounded border border-red-500/10 transition-all uppercase tracking-widest"
                      >
                        [PURGE_DATA]
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto space-y-12"
              >
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-emerald-500 uppercase tracking-widest border-b border-emerald-500/10 pb-4">Core_Config</h3>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] text-emerald-500/50 uppercase tracking-[0.2em] ml-1">Profile_Image_Source</label>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={profileUrl}
                        onChange={e => setProfileUrl(e.target.value)}
                        className="flex-1 bg-slate-900 border border-emerald-500/20 rounded-lg p-4 text-emerald-500 text-xs focus:outline-none focus:border-emerald-500 transition-all"
                        placeholder="https://..."
                      />
                      <button 
                        onClick={handleSaveProfile}
                        className="bg-emerald-500 text-slate-950 px-8 py-4 rounded-lg font-black text-[10px] hover:bg-emerald-400 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      >
                        COMMIT
                      </button>
                    </div>
                  </div>

                  <div className="p-8 glass-panel border border-emerald-500/10 rounded-2xl flex flex-col items-center">
                    <p className="text-[10px] text-slate-500 mb-6 uppercase tracking-widest">Visual_Output_Buffer</p>
                    <div className="relative group p-2 rounded-full border-2 border-dashed border-emerald-500/20">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <img 
                        src={profileUrl} 
                        className="relative w-40 h-40 object-cover rounded-full border border-emerald-500/30 grayscale hover:grayscale-0 transition-all duration-700" 
                        alt="Preview" 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <h4 className="text-red-500 font-bold text-xs uppercase mb-2">Danger_Zone</h4>
                  <p className="text-[10px] text-slate-500 mb-4">Perform destructive operations on core system tables</p>
                  <button className="text-[9px] text-red-500 underline uppercase hover:text-red-400">[RESTORE_SYSTEM_DEFAULTS]</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="pt-12 text-center text-slate-600 text-[9px] uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} Jamsagor_Networks // All Rights Reserved
        </footer>
      </div>
    </div>
  );
};
