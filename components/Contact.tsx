
import React from 'react';

interface ContactProps {
  onOpenPopup: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onOpenPopup }) => {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold font-mono">COMM_PROTOCOL</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-6">
          <div className="text-6xl">📡</div>
          <h3 className="text-2xl font-bold font-mono">ENCRYPTED TRANSMISSION</h3>
          <p className="text-slate-400 max-w-md">
            The secure link is active. Please click the button below to open the communication terminal.
          </p>
          <button 
            onClick={onOpenPopup}
            className="px-12 py-4 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          >
            OPEN TERMINAL
          </button>
        </div>

        <div className="space-y-6">
          <ContactInfo 
            title="Secure Line" 
            value="01307541441" 
            icon="📱" 
            link="tel:01307541441"
          />
          <ContactInfo 
            title="Main Gateway" 
            value="jmisagor079@gmail.com" 
            icon="📧" 
            link="mailto:jmisagor079@gmail.com"
          />
          <ContactInfo 
            title="Social Node" 
            value="Facebook Profile" 
            icon="🔗" 
            link="https://www.facebook.com/profile.php?id=61577810570021"
          />
          
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/10">
            <h3 className="font-mono text-xs text-emerald-500 uppercase mb-4">Network Status</h3>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
              <span className="text-sm text-slate-300">Available for new opportunities</span>
            </div>
          </div>
        </div>
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
