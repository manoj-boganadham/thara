function Hero({ invitation }) {
  const { invocation, couple } = invitation;

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <p className="hero-invocation">{invocation}</p>
        <h1 className="hero-names">
          {couple.bride.name} <span className="heart">&amp;</span> {couple.groom.name}
        </h1>
        <p className="hero-subtitle">cordially invite you to celebrate their wedding</p>
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
