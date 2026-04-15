import openingBackground from '../assets/opening-page-background.jpeg';

function OpeningPrelude({ opening, onEnter, isEntering }) {
  return (
    <section className={`opening-prelude ${isEntering ? 'opening-prelude-exit' : ''}`}>
      <div
        className="opening-prelude-bg"
        style={{ backgroundImage: `url(${openingBackground})` }}
        aria-hidden="true"
      />
      <div className="opening-prelude-vignette" />

      <div className="petal-layer" aria-hidden="true">
        <span className="petal petal-1">✽</span>
        <span className="petal petal-2">✽</span>
        <span className="petal petal-3">✽</span>
        <span className="petal petal-4">✽</span>
      </div>

      <div className="opening-prelude-content">
        <p className="opening-invocation">{opening.invocation}</p>
        <p className="opening-tagline">{opening.tagline}</p>
        <h1 className="opening-names">{opening.coupleLine}</h1>
        <p className="opening-meta">{opening.ceremonyLine}</p>
        <p className="opening-quote">"{opening.quote}"</p>

        <button
          type="button"
          className="opening-enter-btn"
          onClick={onEnter}
          disabled={isEntering}
        >
          {isEntering ? 'Welcoming You...' : opening.enterLabel}
        </button>
      </div>
    </section>
  );
}

export default OpeningPrelude;
