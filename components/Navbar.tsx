
import React from 'react';
import { View } from '../App';

interface NavbarProps {
  activeSection: string;
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, currentView, onNavigate }) => {
  const links = [
    { id: 'hero', label: 'ROOT' },
    { id: 'about', label: 'SYSTEM' },
    { id: 'services', label: 'CAPACITY' },
    { id: 'contact', label: 'TERMINAL' },
  ];

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    if (currentView !== 'home') {
      e.preventDefault();
      onNavigate('home');
      // Delay slightly to allow DOM to render home view before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 pointer-events-none">
      <div className="container mx-auto flex items-center justify-between pointer-events-auto">
        <button 
          onClick={() => onNavigate('home')}
          className="text-2xl font-black font-mono tracking-tighter text-emerald-500 hover:scale-105 transition-transform"
        >
          JAMIL<span className="text-slate-100">_SAGOR</span>
        </button>
        
        <div className="hidden md:flex items-center gap-1 bg-slate-900/50 backdrop-blur-md p-1 border border-emerald-500/20 rounded-full">
          {links.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`px-6 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                activeSection === link.id && currentView === 'home'
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('capabilities')}
            className={`px-4 py-1 border rounded text-[10px] font-mono transition-all ${
              currentView === 'capabilities' 
              ? 'bg-emerald-500 text-slate-950 border-emerald-500' 
              : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10'
            }`}
          >
            V_PORTFOLIO
          </button>
        </div>
      </div>
    </nav>
  );
};
