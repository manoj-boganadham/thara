import DayCycleScene from './DayCycleScene';

function Hero({ invitation }) {
  const { invocation, couple, quote, ceremony } = invitation;

  return (
    <section className="hero" id="hero">
      <DayCycleScene />
      <div className="hero-content">
        <p className="hero-invocation">{invocation}</p>
        <p className="hero-intro">Together with the blessings of our families</p>
        <h1 className="hero-names">
          {couple.bride.name} <span className="heart">&amp;</span> {couple.groom.name}
        </h1>
        <div className="hero-divider" />
        <p className="hero-subtitle">cordially invite you to celebrate their wedding</p>
        <p className="hero-ceremony-meta">
          {ceremony.dateLabel} • {ceremony.timeLabel}
        </p>
        <p className="hero-ceremony-venue">{ceremony.venueLabel}</p>
        <p className="hero-quote">"{quote}"</p>
      </div>
      <div className="hero-overlay-bottom" />
      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-arrow" />
      </div>
    </section>
  );
}

export default Hero;
