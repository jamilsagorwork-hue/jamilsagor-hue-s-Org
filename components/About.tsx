
import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-bold font-mono">ABOUT_SYSTEM.EXE</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="glass-panel p-8 rounded-2xl space-y-6">
          <p className="text-slate-400 leading-relaxed italic">
            "Driven by a passion for creating seamless digital experiences. As a Computer Science student at BUBT, I bridge the gap between complex engineering and elegant design."
          </p>
          
          <div className="space-y-4 font-mono">
            <div className="flex items-center gap-4">
              <span className="w-24 text-emerald-500">IDENTIFIER</span>
              <span className="text-slate-300">Jamil Ahmed Sagor</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-emerald-500">ACADEMY</span>
              <span className="text-slate-300">BUBT (CSE)</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-emerald-500">ROLL_NO</span>
              <span className="text-slate-300">22234103270</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-emerald-500">LOCATION</span>
              <span className="text-slate-300">Bangladesh</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SkillCard title="Frontend" items={['React', 'Next.js', 'Tailwind', 'Three.js']} />
          <SkillCard title="Backend" items={['Node.js', 'Express', 'Firebase', 'MongoDB']} />
          <SkillCard title="Specialty" items={['Digital Products', 'UI/UX Design', 'Secure Apps']} />
          <SkillCard title="Tools" items={['Git', 'Docker', 'Figma', 'Linux']} />
        </div>
      </div>
    </div>
  );
};

const SkillCard: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="glass-panel p-6 rounded-xl border border-emerald-500/10 hover:border-emerald-500/40 transition-colors">
    <h3 className="text-emerald-400 font-mono font-bold mb-3">{title}</h3>
    <ul className="text-slate-400 text-sm space-y-1">
      {items.map(item => <li key={item}>&gt; {item}</li>)}
    </ul>
  </div>
);
