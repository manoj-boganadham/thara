function GallerySection({ items }) {
  return (
    <section className="invite-section fade-in" id="gallery">
      <h2 className="section-heading">Captured Moments</h2>
      <div className="section-divider" />
      <div className="gallery-grid">
        {items.map((item) => (
          <div className="gallery-tile" key={item}>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GallerySection;
