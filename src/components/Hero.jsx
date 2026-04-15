import heroBackground from '../assets/hero-component-background.jpeg';

function Hero({ invitation }) {
  const { invocation, couple, ceremony } = invitation;

  return (
    <section
      className="hero"
      id="hero"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="hero-content">
        <p className="hero-invocation">{invocation}</p>
        <p className="hero-intro">Together with the blessings of our families</p>
        <h1 className="hero-names">
          {couple.bride.name} <span className="heart">&amp;</span> {couple.groom.name}
        </h1>
        <p className="hero-subtitle">cordially invite you to celebrate their wedding</p>
        <p className="hero-ceremony-meta">
          {ceremony.dateLabel} • {ceremony.timeLabel}
        </p>
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
