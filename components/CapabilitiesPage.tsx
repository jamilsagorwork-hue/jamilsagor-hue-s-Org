
import React, { useState, useEffect } from 'react';

interface Project {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
}

export const CapabilitiesPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('jamil_capabilities');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      // Default sample projects
      const defaults = [
        { id: 1, title: 'Crypto Dashboard', imageUrl: 'https://picsum.photos/seed/crypto/800/600', description: 'Real-time blockchain analysis tool.' },
        { id: 2, title: 'AI Assistant Interface', imageUrl: 'https://picsum.photos/seed/ai/800/600', description: 'Gemini-powered neural network UI.' },
        { id: 3, title: 'Cyber E-commerce', imageUrl: 'https://picsum.photos/seed/shop/800/600', description: 'Next-gen marketplace for digital assets.' }
      ];
      setProjects(defaults);
      localStorage.setItem('jamil_capabilities', JSON.stringify(defaults));
    }
  }, []);

  return (
    <div className="pt-32 pb-24 space-y-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            CAPABILITIES_LOG
          </h2>
          <p className="text-slate-400 mt-2 font-mono italic">&gt; Decoding previous successful deployments...</p>
        </div>
        <button 
          onClick={onBack}
          className="px-6 py-2 border border-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/10 transition-all font-mono text-sm"
        >
          [RETURN_TO_BASE]
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(p => (
          <div key={p.id} className="group glass-panel rounded-2xl overflow-hidden border border-emerald-500/10 hover:border-emerald-500/40 transition-all">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={p.imageUrl} 
                alt={p.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <span className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded text-xs">VIEW_DETAIL</span>
              </div>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-emerald-400 font-mono uppercase">{p.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-emerald-500/20 rounded-2xl">
          <p className="text-slate-500 font-mono">NO_DATA_FOUND: Please update database via Admin Console.</p>
        </div>
      )}
    </div>
  );
};
