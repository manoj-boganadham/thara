import { useEffect, useMemo, useState } from 'react';
import PhotoAlbum from 'react-photo-album';
import Lightbox from 'yet-another-react-lightbox';
import 'react-photo-album/masonry.css';
import 'yet-another-react-lightbox/styles.css';

const galleryModules = import.meta.glob(
  '/src/assets/gallery/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  {
    eager: true,
    import: 'default',
  }
);

const galleryImages = Object.entries(galleryModules)
  .map(([path, src]) => {
    const fileName = path.split('/').pop() || 'moment';
    const baseName = fileName.replace(/\.[^.]+$/, '');
    const label = baseName.replace(/[-_]+/g, ' ').trim();
    return {
      src,
      fileName,
      alt: label ? `Captured moment ${label}` : 'Captured moment',
    };
  })
  .sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { numeric: true }));

function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [photoMeta, setPhotoMeta] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadDimensions = async () => {
      const photoData = await Promise.all(
        galleryImages.map(
          (image) =>
            new Promise((resolve) => {
              const probe = new Image();
              probe.onload = () => {
                resolve({
                  ...image,
                  width: probe.naturalWidth || 4,
                  height: probe.naturalHeight || 5,
                });
              };
              probe.onerror = () => {
                resolve({
                  ...image,
                  width: 4,
                  height: 5,
                });
              };
              probe.src = image.src;
            })
        )
      );

      if (isMounted) {
        setPhotoMeta(photoData);
      }
    };

    loadDimensions();
    return () => {
      isMounted = false;
    };
  }, []);

  const slides = useMemo(
    () =>
      photoMeta.map((photo) => ({
        src: photo.src,
        alt: photo.alt,
        width: photo.width,
        height: photo.height,
      })),
    [photoMeta]
  );

  const isPreparingPhotos = galleryImages.length > 0 && photoMeta.length === 0;

  return (
    <section className="invite-section fade-in" id="gallery">
      <h2 className="section-heading">Captured Moments</h2>
      <div className="section-divider" />
      {galleryImages.length === 0 ? (
        <div className="gallery-empty">Photos will appear here as they are added.</div>
      ) : isPreparingPhotos ? (
        <div className="gallery-empty">Preparing captured moments...</div>
      ) : (
        <>
          <PhotoAlbum
            className="gallery-album"
            layout="masonry"
            photos={slides}
            columns={(containerWidth) => {
              if (containerWidth < 640) return 2;
              if (containerWidth < 1024) return 3;
              return 4;
            }}
            spacing={12}
            padding={0}
            onClick={({ index }) => setCurrentIndex(index)}
            renderPhoto={({ imageProps }) => <img {...imageProps} className="gallery-photo" />}
          />
          <Lightbox
            open={currentIndex >= 0}
            index={currentIndex}
            close={() => setCurrentIndex(-1)}
            slides={slides}
            carousel={{ finite: false }}
            controller={{ closeOnBackdropClick: true }}
            render={{
              iconPrev: () => <span className="lightbox-nav-btn" aria-hidden="true">&#10094;</span>,
              iconNext: () => <span className="lightbox-nav-btn" aria-hidden="true">&#10095;</span>,
            }}
          />
        </>
      )}
    </section>
  );
}

export default GallerySection;
