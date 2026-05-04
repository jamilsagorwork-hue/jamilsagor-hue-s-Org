
import React from 'react';

const SERVICES = [
  {
    title: 'Personalized Web Apps',
    desc: 'Bespoke web solutions tailored to individual or corporate needs with a focus on high performance.',
    icon: '🚀'
  },
  {
    title: 'Digital Marketplaces',
    desc: 'End-to-end e-commerce platforms optimized for selling digital goods and services.',
    icon: '⚡'
  },
  {
    title: 'Modern UI/UX Design',
    desc: 'Crafting visually stunning and intuitive interfaces that engage users from the first click.',
    icon: '🎨'
  },
  {
    title: 'API Integration',
    desc: 'Connecting systems and leveraging AI capabilities like Gemini for smarter applications.',
    icon: '🔌'
  }
];

export const Services: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-l from-emerald-500/50 to-transparent"></div>
        <h2 className="text-3xl font-bold font-mono">OPERATIONS_MATRIX</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SERVICES.map((s, idx) => (
          <div 
            key={idx} 
            className="glass-panel p-8 rounded-2xl hover:bg-emerald-500/5 transition-all group border border-emerald-500/10"
          >
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
            <h3 className="text-xl font-bold text-slate-100 mb-3">{s.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
