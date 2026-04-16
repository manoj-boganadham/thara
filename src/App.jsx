import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import AboutCouple from './components/AboutCouple';
import EventsTimeline from './components/EventsTimeline';
import StorySection from './components/StorySection';
import WhenWhereSection from './components/WhenWhereSection';
import ShareSection from './components/ShareSection';
import OpeningPrelude from './components/OpeningPrelude';
import MusicToggle from './components/MusicToggle';
import backgroundMusic from './assets/background-music.mp3';
import invitationData from './data/invitationData';
import './App.css';

const MUSIC_MUTED_STORAGE_KEY = 'musicMuted';
const MUSIC_LOOP_START_SECONDS = 21;

function LandingPage({ isEntering, onEnter }) {
  return (
    <OpeningPrelude
      opening={invitationData.opening}
      onEnter={onEnter}
      isEntering={isEntering}
    />
  );
}

function InvitationPage({ isMusicMuted, onToggleMusic }) {
  return (
    <main className="main-invite-visible invitation-theme">
      <Hero invitation={invitationData} />

      <section className="post-hero-intro fade-in" id="intro-details">
        <div className="post-hero-intro-inner">
          <p className="post-hero-venue">{invitationData.ceremony.venueLabel}</p>
          <p className="post-hero-quote">"{invitationData.quote}"</p>
        </div>
      </section>

      <Countdown
        targetDate={invitationData.ceremony.isoDate}
        dateLabel={`${invitationData.ceremony.dateLabel} • ${invitationData.ceremony.timeLabel}`}
      />

      <AboutCouple couple={invitationData.couple} />

      <EventsTimeline events={invitationData.events} />

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

      <MusicToggle isMuted={isMusicMuted} onToggle={onToggleMusic} />
    </main>
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(() => {
    return localStorage.getItem(MUSIC_MUTED_STORAGE_KEY) === 'true';
  });
  const musicRef = useRef(null);
  const chimeAudioRef = useRef(null);

  useEffect(() => {
    // Enable theme transitions after initial paint to prevent flash
    const readyTimer = setTimeout(() => {
      document.body.classList.add('theme-ready');
    }, 100);

    return () => clearTimeout(readyTimer);
  }, []);

  useEffect(() => {
    const audio = new Audio(backgroundMusic);
    audio.loop = false;
    audio.volume = 0.2;
    audio.preload = 'auto';
    audio.currentTime = MUSIC_LOOP_START_SECONDS;

    const handleEnded = () => {
      audio.currentTime = MUSIC_LOOP_START_SECONDS;
      if (!audio.muted) {
        audio.play().catch(() => {});
      }
    };
    audio.addEventListener('ended', handleEnded);
    musicRef.current = audio;

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      musicRef.current = null;
    };
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

  useEffect(() => {
    if (!musicRef.current) {
      return;
    }
    musicRef.current.muted = isMusicMuted;
    localStorage.setItem(MUSIC_MUTED_STORAGE_KEY, String(isMusicMuted));
  }, [isMusicMuted]);

  useEffect(() => {
    if (location.pathname === '/invitation' || !musicRef.current) {
      return;
    }

    musicRef.current.pause();
    musicRef.current.currentTime = MUSIC_LOOP_START_SECONDS;
  }, [location.pathname]);

  const playChimeIfAvailable = () => {
    const source = invitationData.opening.chimeSrc;

    if (source) {
      try {
        if (!chimeAudioRef.current) {
          chimeAudioRef.current = new Audio(source);
          chimeAudioRef.current.preload = 'auto';
        }
        chimeAudioRef.current.currentTime = 0;
        chimeAudioRef.current.play().catch(() => {});
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

  const startBackgroundMusic = () => {
    if (!musicRef.current) {
      return;
    }
    if (musicRef.current.currentTime < MUSIC_LOOP_START_SECONDS) {
      musicRef.current.currentTime = MUSIC_LOOP_START_SECONDS;
    }
    musicRef.current.muted = isMusicMuted;
    musicRef.current.play().catch(() => {});
  };

  const handleEnterCelebration = () => {
    if (isEntering) {
      return;
    }
    playChimeIfAvailable();
    startBackgroundMusic();
    setIsEntering(true);
    setTimeout(() => {
      setIsEntering(false);
      navigate('/invitation');
    }, 900);
  };

  const toggleMusicMute = () => {
    setIsMusicMuted((prev) => {
      const next = !prev;
      if (!next && musicRef.current && musicRef.current.paused) {
        musicRef.current.play().catch(() => {});
      }
      return next;
    });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage isEntering={isEntering} onEnter={handleEnterCelebration} />}
      />
      <Route
        path="/invitation"
        element={
          <InvitationPage
            isMusicMuted={isMusicMuted}
            onToggleMusic={toggleMusicMute}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
