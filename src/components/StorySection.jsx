function StorySection({ story }) {
  return (
    <section className="invite-section fade-in" id="story">
      <h2 className="section-heading">Our Story</h2>
      <div className="section-divider" />
      <div className="story-card">
        {story.map((paragraph) => (
          <p key={paragraph} className="story-text">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

export default StorySection;
