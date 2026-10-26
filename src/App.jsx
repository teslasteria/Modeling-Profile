import "./App.css";
import { useEffect, useRef, useState } from "react";

const photos = [
  {
    src: "/images/model-01.jpg",
    alt: "Fashion portrait in natural light",
    category: "EDITORIAL",
    type: "Editorial",
  },
  {
    src: "/images/model-02.jpg",
    alt: "Close-up model portrait",
    category: "PORTRAIT",
    type: "Portrait",
  },
  // Add more photos here using the same structure.
];

function Header() {
  return (
    <header className="header">
      <a className="logo" href="#home">
        CT<span>.</span>
      </a>

      <nav className="navigation">
        <a href="#portfolio">Portfolio</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>

      <span className="header-label">MODEL PORTFOLIO</span>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <p className="eyebrow">MODEL · MOSCOW</p>

        <h1>
          CONSTANTINE
          <br />
          <span>TESLA</span>
        </h1>

        <p className="hero-description">
          Fashion · Commercial · Editorial
        </p>

        <a className="text-link" href="#portfolio">
          EXPLORE PORTFOLIO <span>↘</span>
        </a>
      </div>

      <div className="hero-image">
        <img src="/images/hero.jpg" alt="Constantine Tesla — model" />
        <span className="image-caption">SELECTED WORKS / 2026</span>
      </div>

      <span className="hero-index">01 — 04</span>
    </section>
  );
}


function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(null);

  const [activeCategory, setActiveCategory] = useState("All");

  const closeButtonRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const handleTouchStart = (event) => {
    const touch = event.touches[0];

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null || touchStartY.current === null) {
      return;
    }

    const touch = event.changedTouches[0];

    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;

    const minimumSwipeDistance = 50;

    // Ignore vertical gestures and short movements.
    if (  
      Math.abs(deltaX) >= minimumSwipeDistance &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.5
    ) {
      if (deltaX < 0) {
        showNext();
      } else {
        showPrevious();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  const categories = [
    "All",
    ...new Set(photos.map((photo) => photo.type)),
  ];

  const filteredPhotos =
    activeCategory === "All"
      ? photos
      : photos.filter((photo) => photo.type === activeCategory);

  const closeViewer = () => setActiveIndex(null);

  const showPrevious = () => {
    setActiveIndex((current) =>
      (current - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      (current + 1) % filteredPhotos.length
    );
  };

  useEffect(() => {
    if (activeIndex === null) return;

    previouslyFocusedElement.current = document.activeElement;

    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex(
          (current) =>
            (current - 1 + filteredPhotos.length) %
            filteredPhotos.length
        );
      }

      if (event.key === "ArrowRight") {
        setActiveIndex(
          (current) => (current + 1) % filteredPhotos.length
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";

      previouslyFocusedElement.current?.focus();
    };
  }, [activeIndex, filteredPhotos.length]);

  return (
    <section className="portfolio section" id="portfolio">
      <div className="section-heading">
        <p className="eyebrow">A SELECTION OF WORK</p>
        <h2>Portfolio<span>.</span></h2>
      </div>

      <div className="gallery-filters" aria-label="Filter portfolio photos">
        {categories.map((category) => (
          <button
            key={category}
            className={`gallery-filter ${
              activeCategory === category ? "active" : ""
            }`}
            onClick={() => {
              setActiveCategory(category);
              setActiveIndex(null);
            }}
            aria-pressed={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="photo-grid">
        {filteredPhotos.map((photo, index) => (
          <figure className="photo-card" key={photo.src}>
            <button
              className="photo-button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Open photo ${index + 1}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
              />
            </button>

            <figcaption>
              <span>{photo.category}</span>
              <span>0{index + 1}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={closeViewer}
        >
          <button
            ref={closeButtonRef}
            className="lightbox-close"
            onClick={closeViewer}
            aria-label="Close photo viewer"
          >
            ×
          </button>

          <button
            className="lightbox-arrow lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Previous photo"
          >
            ←
          </button>

          <img
            className="lightbox-image"
            src={filteredPhotos[activeIndex].src}
            alt={filteredPhotos[activeIndex].alt}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />

          <button
            className="lightbox-arrow lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Next photo"
          >
            →
          </button>

          <span className="lightbox-counter">
            {activeIndex + 1} / {filteredPhotos.length}
          </span>
        </div>
      )}
    </section>
  );
}

function About() {
  return (
    <section className="about section" id="about">
      <p className="eyebrow">A LITTLE ABOUT ME</p>

      <div className="about-content">
        <h2>Character in every frame.</h2>

        <div className="about-details">
          <p>
            Мужская фотомодель с артистичной внешностью и спортивным
            телосложением. Занимаюсь музыкой, играю на скрипке и гитаре.
            Открыт к коммерческим съёмкам, рекламным кампаниям и fashion-проектам.
          </p>

          <div className="measurements">
            <div><span>HEIGHT</span><strong>185 CM</strong></div>
            <div><span>CHEST</span><strong>96 CM</strong></div>
            <div><span>WAIST</span><strong>76 CM</strong></div>
            <div><span>HIPS</span><strong>96 CM</strong></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer className="contact section" id="contact">
      <p className="eyebrow">AVAILABLE FOR SELECTED PROJECTS</p>
      <h2>Let's work<br />together<span>.</span></h2>

      <a
        className="text-link"
        href="https://www.instagram.com/constantine.tesla/"
        target="_blank"
        rel="noreferrer"
      >
        CONTACT VIA INSTAGRAM ↗
      </a>

      <div className="footer-bottom">
        <span>CONSTANTINE TESLA © 2026</span>
        <a href="#home">BACK TO TOP ↑</a>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <About />
      </main>
      <Contact />
    </>
  );
}

export default App;