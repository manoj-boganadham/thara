import DayCycleScene from './DayCycleScene';

function Hero() {
  return (
    <section className="hero" id="hero">
      <DayCycleScene />
      <div className="hero-content">
        <h1 className="hero-names">
          Varsha <span className="heart">❤️</span> Rithvik
        </h1>
        <div className="hero-divider" />
        <p className="hero-subtitle">
          Together with their families invite you to celebrate their wedding
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
