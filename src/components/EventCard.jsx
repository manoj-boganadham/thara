const MAPS_BASE_URL = 'https://www.google.com/maps/search/?api=1&query=';

function EventCard({ title, icon, date, time, venue, mapsQuery }) {
  const mapsUrl = mapsQuery
    ? `${MAPS_BASE_URL}${encodeURIComponent(mapsQuery)}`
    : '#';

  return (
    <div className="event-card fade-in">
      <span className="event-card-icon">{icon}</span>
      <h3 className="event-card-title">{title}</h3>
      <div className="event-detail">
        <span className="event-detail-icon">📅</span>
        <span className="event-detail-text">{date}</span>
      </div>
      <div className="event-detail">
        <span className="event-detail-icon">🕐</span>
        <span className="event-detail-text">{time}</span>
      </div>
      <div className="event-card-divider" />
      <div className="event-detail">
        <span className="event-detail-icon">📍</span>
        <span className="event-detail-text">{venue}</span>
      </div>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="location-btn"
      >
        <span className="location-btn-icon">🗺️</span>
        View Location
      </a>
    </div>
  );
}

export default EventCard;
