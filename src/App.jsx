import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import AboutCouple from './components/AboutCouple';
import EventsTimeline from './components/EventsTimeline';
import GallerySection from './components/GallerySection';
import StorySection from './components/StorySection';
import WhenWhereSection from './components/WhenWhereSection';
import ShareSection from './components/ShareSection';
import OpeningPrelude from './components/OpeningPrelude';
import invitationData from './data/invitationData';
import './App.css';

function LandingPage() {
  const [isEntering, setIsEntering] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const playChimeIfAvailable = () => {
    const source = invitationData.opening.chimeSrc;

    if (source) {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio(source);
          audioRef.current.preload = 'auto';
        }
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
        return;
      } catch {
        // Fall through to synthetic tone if playback fails.
      }
    }

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const masterGain = audioContext.createGain();
      masterGain.gain.value = 0.05;
      masterGain.connect(audioContext.destination);

      [523.25, 659.25].forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const toneGain = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = freq;
        toneGain.gain.setValueAtTime(0.01, audioContext.currentTime + index * 0.13);
        toneGain.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContext.currentTime + index * 0.13 + 0.4
        );
        oscillator.connect(toneGain);
        toneGain.connect(masterGain);
        oscillator.start(audioContext.currentTime + index * 0.13);
        oscillator.stop(audioContext.currentTime + index * 0.13 + 0.45);
      });
    } catch {
      // Ignore audio playback issues silently.
    }
  };

  const openMainInvitation = () => {
    if (isEntering) {
      return;
    }

    playChimeIfAvailable();
    setIsEntering(true);
    setTimeout(() => {
      setIsEntering(false);
      navigate('/invitation');
    }, 900);
  };

  return (
    <OpeningPrelude
      opening={invitationData.opening}
      onEnter={openMainInvitation}
      isEntering={isEntering}
    />
  );
}

function InvitationPage() {
  return (
    <main className="main-invite-visible invitation-theme">
      <Hero invitation={invitationData} />

      <Countdown
        targetDate={invitationData.ceremony.isoDate}
        dateLabel={`${invitationData.ceremony.dateLabel} • ${invitationData.ceremony.timeLabel}`}
      />

      <AboutCouple couple={invitationData.couple} />

      <EventsTimeline events={invitationData.events} />

      <GallerySection items={invitationData.galleryPlaceholders} />
      <StorySection story={invitationData.story} />
      <WhenWhereSection ceremony={invitationData.ceremony} />
      <ShareSection
        shareText={invitationData.share.whatsappText}
        coupleNames={`${invitationData.couple.bride.name} & ${invitationData.couple.groom.name}`}
      />

      <footer className="footer">
        <p className="footer-text">{invitationData.footerMessage}</p>
        <p className="footer-names">
          {invitationData.couple.bride.name} &amp; {invitationData.couple.groom.name}
        </p>
      </footer>
    </main>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    // Enable theme transitions after initial paint to prevent flash
    const readyTimer = setTimeout(() => {
      document.body.classList.add('theme-ready');
    }, 100);

    return () => clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    if (location.pathname !== '/invitation') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/invitation" element={<InvitationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
