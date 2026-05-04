
import React from 'react';

interface HeroProps {
  onInitiateContact: () => void;
  onViewCapabilities: () => void;
  profileImage: string;
}

export const Hero: React.FC<HeroProps> = ({ onInitiateContact, onViewCapabilities, profileImage }) => {
  const imageElement = (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative aspect-square w-64 md:w-96 overflow-hidden rounded-2xl glass-panel">
        <img 
          src={profileImage} 
          alt="Jamil Ahmed Sagor" 
          className="w-full h-full object-cover grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 font-mono text-xs text-emerald-400 bg-slate-950/80 p-2 border border-emerald-500/20 rounded">
          UID: 22234103270
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 pt-20">
      <div className="flex-1 space-y-6">
        <div>
          <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 font-mono text-xs mb-4">
            SYSTEM_VERSION: 2025.1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            I am <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 glitch-text">
              Jamil Ahmed Sagor
            </span>
          </h1>
        </div>

        {/* Mobile-only image placement: positioned between title and description */}
        <div className="md:hidden flex justify-center py-4">
          {imageElement}
        </div>
        
        <div className="space-y-6">
          <p className="text-xl text-slate-400 font-mono leading-relaxed max-w-2xl">
            &gt; CSE Student at BUBT <br />
            &gt; Full Stack Developer <br />
            &gt; Digital Product Architect <br />
            &gt; Specialized in high-performance web systems
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onInitiateContact}
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              INITIATE CONTACT
            </button>
            <button 
              onClick={onViewCapabilities}
              className="px-8 py-3 border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 font-bold rounded-lg transition-all"
            >
              VIEW CAPABILITIES
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop-only image placement: remains on the right side */}
      <div className="hidden md:block">
        {imageElement}
      </div>
    </div>
  );
};
