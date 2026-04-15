import { useEffect, useMemo, useState } from 'react';

function calculateTimeLeft(targetDate) {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Countdown({ targetDate, dateLabel }) {
  const weddingDate = useMemo(() => new Date(targetDate), [targetDate]);
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(weddingDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(weddingDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <section className="countdown-section fade-in" id="countdown">
      <h2 className="countdown-title">Counting Down To Our Special Day</h2>
      <p className="countdown-subtitle">{dateLabel}</p>
      <div className="countdown-boxes">
        {units.map((unit) => (
          <div className="countdown-box" key={unit.label}>
            <div className="countdown-value">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="countdown-label">{unit.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Countdown;
