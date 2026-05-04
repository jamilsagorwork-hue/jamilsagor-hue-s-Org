
import React, { useState, useEffect } from 'react';
import { HackerBackground } from './components/HackerBackground';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { Navbar } from './components/Navbar';
import { AIChat } from './components/AIChat';
import { AdminPanel } from './components/AdminPanel';
import { CapabilitiesPage } from './components/CapabilitiesPage';
import { ContactPopup } from './components/ContactPopup';
import { supabase, TableNames } from './lib/supabase';

export type View = 'home' | 'capabilities' | 'admin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeSection, setActiveSection] = useState('hero');
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem('jamil_profile_img') || "https://picsum.photos/seed/jamil/800/800";
  });

  useEffect(() => {
    const fetchProfileSync = async () => {
      try {
        const { data, error } = await supabase
          .from(TableNames.SETTINGS)
          .select('value')
          .eq('key', 'profile_image')
          .single();
        
        if (data && data.value) {
          setProfileImage(data.value);
          localStorage.setItem('jamil_profile_img', data.value);
        }
      } catch (err) {
        console.warn('Cloud sync for profile image failed, using cached version.');
      }
    };
    fetchProfileSync();
  }, []);

  useEffect(() => {
    if (currentView !== 'home') {
      window.scrollTo(0, 0);
      return;
    }

    const handleScroll = () => {
      const sections = ['hero', 'about', 'services', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const renderContent = () => {
    switch (currentView) {
      case 'capabilities':
        return <CapabilitiesPage onBack={() => setCurrentView('home')} />;
      case 'admin':
        return <AdminPanel onBack={() => setCurrentView('home')} onProfileUpdate={setProfileImage} />;
      default:
        return (
          <>
            <section id="hero" className="min-h-screen flex items-center">
              <Hero 
                profileImage={profileImage}
                onInitiateContact={() => setIsContactOpen(true)} 
                onViewCapabilities={() => setCurrentView('capabilities')} 
              />
            </section>
            <section id="about" className="py-24">
              <About />
            </section>
            <section id="services" className="py-24">
              <Services />
            </section>
            <section id="contact" className="py-24">
              <Contact onOpenPopup={() => setIsContactOpen(true)} />
            </section>
          </>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30">
      <HackerBackground />
      
      <div className="relative z-10">
        <Navbar 
          activeSection={activeSection} 
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)} 
        />
        
        <main className="container mx-auto px-4 md:px-8">
          {renderContent()}
        </main>

        <footer className="py-8 border-t border-emerald-500/10 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Jamil Ahmed Sagor. All rights reserved.</p>
          <div className="flex justify-center items-center gap-4 mt-2 font-mono">
            <span>Status: Secured</span>
            <button 
              onClick={() => setCurrentView('admin')}
              className="text-emerald-500 hover:text-emerald-400 underline decoration-dotted"
            >
              [TERMINAL_ACCESS]
            </button>
          </div>
        </footer>
      </div>

      <AIChat />
      <ContactPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
};

export default App;
