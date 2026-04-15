function AboutCouple({ couple }) {
  return (
    <section className="invite-section fade-in" id="about-couple">
      <h2 className="section-heading">About the Couple</h2>
      <div className="section-divider" />
      <div className="couple-grid">
        <article className="couple-card">
          <h3 className="couple-name">{couple.groom.fullName}</h3>
          <p className="couple-parent-text">{couple.groom.parents}</p>
        </article>
        <article className="couple-card">
          <h3 className="couple-name">{couple.bride.fullName}</h3>
          <p className="couple-parent-text">{couple.bride.parents}</p>
        </article>
      </div>
    </section>
  );
}

export default AboutCouple;
