
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `You are a professional digital assistant for Jamil Ahmed Sagor. 
Your goal is to represent him to potential clients or employers.
Details about Jamil:
- Name: Jamil Ahmed Sagor
- Student at: BUBT (Bangladesh University of Business and Technology)
- Studying: CSE (Computer Science & Engineering)
- Roll No: 22234103270
- Email: jmisagor079@gmail.com
- Phone: 01307541441
- Expertise: Personalized websites, mobile apps, e-commerce, digital products.
- Tech Stack: Full Stack Development.
- Aesthetics: Professional Hacker/Cyber style.

Always be polite, concise, and helpful. Use "we" or "he" depending on the context. 
If someone asks for contact, provide the details above.`;

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Connection established. How can I assist you with Jamil\'s portfolio today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that. Please check back later.";
      setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Gateway error. Please ensure encryption keys are valid." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[450px] glass-panel flex flex-col rounded-2xl border border-emerald-500/30 shadow-2xl overflow-hidden">
          <div className="bg-emerald-500/10 p-4 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <h3 className="font-mono text-xs font-bold text-emerald-400">JAMIL_AI_CORE</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  m.role === 'user' 
                    ? 'bg-emerald-500 text-slate-950 ml-4' 
                    : 'bg-slate-800 text-emerald-400 mr-4 border border-emerald-500/20'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-lg animate-pulse text-emerald-400 border border-emerald-500/20">
                  Processing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-emerald-500/20 bg-slate-900/50">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query system..."
                className="flex-1 bg-slate-950 border border-emerald-500/20 rounded p-2 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <button 
                onClick={handleSend}
                className="bg-emerald-500 text-slate-950 p-2 rounded hover:bg-emerald-400 transition-colors"
              >
                ➔
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all group"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform">🤖</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-950 rounded-full"></div>
        </button>
      )}
    </div>
  );
};
