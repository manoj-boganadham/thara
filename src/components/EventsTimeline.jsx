const MAPS_BASE_URL = 'https://www.google.com/maps/search/?api=1&query=';

function EventsTimeline({ events }) {
  return (
    <section className="invite-section fade-in" id="events">
      <h2 className="section-heading">Wedding Events</h2>
      <div className="section-divider" />
      <div className="timeline">
        {events.map((event) => {
          const mapsUrl = `${MAPS_BASE_URL}${encodeURIComponent(event.mapsQuery)}`;
          return (
            <article className="timeline-item" key={event.id}>
              <p className="timeline-subtitle">{event.subtitle}</p>
              <h3 className="timeline-title">{event.title}</h3>
              <p className="timeline-meta">{event.date}</p>
              <p className="timeline-meta">{event.time}</p>
              <p className="timeline-venue">{event.venue}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="location-btn"
              >
                Get Directions
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default EventsTimeline;
