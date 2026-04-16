const galleryModules = import.meta.glob('/src/assets/gallery/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  import: 'default',
});

const galleryImages = Object.entries(galleryModules)
  .map(([path, src]) => {
    const fileName = path.split('/').pop() || 'moment';
    const baseName = fileName.replace(/\.[^.]+$/, '');
    const label = baseName.replace(/[-_]+/g, ' ').trim();
    const caption = label ? label : 'Captured moment';
    return {
      src,
      fileName,
      caption,
      alt: `Captured moment - ${caption}`,
    };
  })
  .sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { numeric: true }));

function GallerySection() {
  return (
    <section className="invite-section fade-in" id="gallery">
      <h2 className="section-heading">Captured Moments</h2>
      <div className="section-divider" />
      <div className="gallery-grid">
        {galleryImages.length === 0 ? (
          <div className="gallery-empty">Photos will appear here as they are added.</div>
        ) : (
          galleryImages.map((image, index) => (
            <figure className="gallery-item" key={image.fileName}>
              <img
                className="gallery-image"
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="gallery-caption">Moment {index + 1}</figcaption>
            </figure>
          ))
        )}
      </div>
    </section>
  );
}

export default GallerySection;
