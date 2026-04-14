import { useEffect } from 'react';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import EventCard from './components/EventCard';
import './App.css';

function App() {
  useEffect(() => {
    // Enable theme transitions after initial paint to prevent flash
    const readyTimer = setTimeout(() => {
      document.body.classList.add('theme-ready');
    }, 100);

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
      clearTimeout(readyTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Hero />

      <Countdown />

      <section className="events-section" id="events">
        <h2 className="section-heading">Celebrations</h2>
        <div className="section-divider" />

        <EventCard
          title="The Wedding"
          icon="💍"
          date="Friday, May 1, 2026"
          time="11:20 AM"
          venue="Naina Conventions, Kukatpally, Hyderabad, Telangana"
          mapsQuery="Naina Conventions, Kukatpally, Hyderabad, Telangana"
        />

        <EventCard
          title="The Reception"
          icon="🎉"
          date="Sunday, May 3, 2026"
          time="7:00 PM"
          venue="Police Convention Centre, Siddipet, Telangana"
          mapsQuery="Police Convention Centre, Siddipet, Telangana"
        />
      </section>

      <footer className="footer">
        <p className="footer-text">
          We look forward to celebrating with you <span className="heart">❤️</span>
        </p>
        <p className="footer-names">Varsha & Rithvik</p>
      </footer>
    </>
  );
}

export default App;
