const MAPS_BASE_URL = 'https://www.google.com/maps/search/?api=1&query=';

function WhenWhereSection({ ceremony }) {
  const mapsUrl = `${MAPS_BASE_URL}${encodeURIComponent(ceremony.mapsQuery)}`;

  return (
    <section className="invite-section fade-in" id="when-where">
      <h2 className="section-heading">When &amp; Where</h2>
      <div className="section-divider" />
      <article className="venue-card">
        <h3 className="venue-title">{ceremony.title}</h3>
        <p className="venue-meta">{ceremony.dateLabel}</p>
        <p className="venue-meta">{ceremony.timeLabel}</p>
        <p className="venue-address">{ceremony.venueLabel}</p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="location-btn"
        >
          View Location
        </a>
      </article>
    </section>
  );
}

export default WhenWhereSection;
