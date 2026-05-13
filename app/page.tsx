"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const BOOKING_HOTEL_URL = "https://www.booking.com/hotel/es/estudios-los-arcos.es.html";
const BOOKING_DEST_ID = "-404164";
const BOOKING_DEFAULT_DAYS = 2;
const DEMO_AVAILABILITY_PATH = "/disponibilidad";
const HERO_SLIDES = [
  {
    src: "/images/roquetas-de-mar.jpg",
    alt: "Roquetas de Mar - vista 1",
  },
  {
    src: "/images/roquetas-de-mar-2.jpg",
    alt: "Roquetas de Mar - vista 2",
  },
  {
    src: "/images/roquetas-de-mar-3.avif",
    alt: "Roquetas de Mar - vista 3",
  },
  {
    src: "/images/roquetas-de-mar-4.webp",
    alt: "Roquetas de Mar - vista 4",
  },
];
const TERUEL_SLIDES = [
  {
    src: "/images/teruel-carrusel-1.jpg",
    alt: "Teruel carrusel 1",
  },
  {
    src: "/images/teruel-carrusel-2.jpg",
    alt: "Teruel carrusel 2",
  },
  {
    src: "/images/teruel-carrusel-3.jpg",
    alt: "Teruel carrusel 3",
  },
  {
    src: "/images/teruel-carrusel-4.jpg",
    alt: "Teruel carrusel 4",
  },
  {
    src: "/images/teruel-carrusel-5.jpg",
    alt: "Teruel carrusel 5",
  },
  {
    src: "/images/teruel-carrusel-6.jpg",
    alt: "Teruel carrusel 6",
  },
];
const ROOMS = [
  {
    name: "Habitación Doble",
    image: "/images/habitacion-doble.png",
    size: "22 m²",
    bed: "1 cama doble",
    summary:
      "Habitación con baño privado y zona de cocina completa. Incluye entrada independiente, TV de pantalla plana y toda la unidad accesible en silla de ruedas.",
    highlights: ["Zona de cocina privada", "Baño privado", "Vistas", "WiFi gratis"],
    kitchen: ["Nevera", "Cafetera", "Microondas", "Utensilios", "Horno", "Fogones", "Tostadora"],
    bathroom: ["Ducha a ras de suelo", "Artículos de aseo gratis", "Toallas", "Papel higiénico"],
  },
  {
    name: "Apartamento Estudio",
    image: "/images/apartamento-estudio.png",
    size: "22 m²",
    bed: "1 cama doble + 1 sofá cama",
    summary:
      "Apartamento entero con aire acondicionado individual, cocina privada y vistas a la ciudad. Perfecto para una estancia cómoda en pareja o en familia.",
    highlights: ["Apartamento entero", "Cocina privada", "Vistas a la ciudad", "Aire acondicionado", "WiFi gratis"],
    kitchen: ["Nevera", "Cafetera", "Microondas", "Utensilios", "Horno", "Fogones", "Tostadora"],
    bathroom: ["Ducha a ras de suelo", "Artículos de aseo gratis", "Toallas", "Papel higiénico"],
  },
  {
    name: "Habitación Familiar con baño privado",
    image: "/images/habitacion-familiar.png",
    size: "22 m²",
    bed: "1 cama doble + 1 sofá cama",
    summary:
      "Habitación familiar con cocina privada, aire acondicionado y vistas a la ciudad. Equipada para familias con juegos de mesa y barandillas de seguridad para bebés.",
    highlights: ["Cocina privada", "Baño privado", "Vistas a la ciudad", "Aire acondicionado", "WiFi gratis"],
    kitchen: ["Nevera", "Cafetera", "Microondas", "Utensilios", "Horno", "Fogones", "Tostadora"],
    bathroom: ["Ducha a ras de suelo", "Artículos de aseo gratis", "Toallas", "Papel higiénico"],
  },
];
const REVIEWS = [
  {
    author: "Xsanz",
    country: "España",
    date: "19 abril 2026",
    type: "En familia",
    score: 10,
    title: "Excepcional",
    text: "La ubicación es perfecta para visitar Teruel, a 10 minutos andando del centro. Fuimos 2 adultos y 2 niñas y estuvimos muy cómodos.",
  },
  {
    author: "Ruben",
    country: "España",
    date: "5 abril 2026",
    type: "En familia",
    score: 10,
    title: "Excepcional",
    text: "Hemos pasado unos días en familia estupendos, la ubicación y las instalaciones son excelentes. Para repetir sin duda.",
  },
  {
    author: "Lisa",
    country: "España",
    date: "3 abril 2026",
    type: "En pareja",
    score: 10,
    title: "Excelente",
    text: "Todo muy cómodo y limpio, además de cerca del centro turístico.",
  },
  {
    author: "Claudia",
    country: "España",
    date: "23 marzo 2026",
    type: "En familia",
    score: 10,
    title: "Genial",
    text: "Bien situado, anfitrión atento, check-in fácil y camas cómodas. Estuvimos como en casa.",
  },
  {
    author: "Celia",
    country: "España",
    date: "3 marzo 2026",
    type: "En familia",
    score: 10,
    title: "Excelente",
    text: "Todo limpio e impecable, ubicación de 10 y calidad-precio excelente. Si volvemos a Teruel repetiremos.",
  },
  {
    author: "Tomasz",
    country: "Polonia",
    date: "26 febrero 2026",
    type: "Viajero solo",
    score: 10,
    title: "Muy recomendable",
    text: "Ubicación excelente para Casco Antiguo y Universidad. Zona tranquila y anfitrión muy atento.",
  },
  {
    author: "Lidia",
    country: "España",
    date: "9 noviembre 2025",
    type: "En pareja",
    score: 10,
    title: "Todo genial",
    text: "Ubicación excelente y alojamiento tal como en las fotos, con todo muy limpio.",
  },
  {
    author: "David",
    country: "España",
    date: "11 septiembre 2025",
    type: "En grupo",
    score: 10,
    title: "Excepcional",
    text: "Muy buena ubicación, alojamiento limpio y muchas facilidades para guardar las bicicletas.",
  },
];

const REVIEWS_PER_PAGE = 4;

function buildReviewPages() {
  const pages: (typeof REVIEWS)[] = [];
  for (let i = 0; i < REVIEWS.length; i += REVIEWS_PER_PAGE) {
    const page = REVIEWS.slice(i, i + REVIEWS_PER_PAGE);
    if (page.length < REVIEWS_PER_PAGE) {
      page.push(...REVIEWS.slice(0, REVIEWS_PER_PAGE - page.length));
    }
    pages.push(page);
  }
  return pages;
}

function formatDate(value: string) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

function formatDateForInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function buildDemoAvailabilityUrl(params: URLSearchParams) {
  const query = params.toString();
  return `${DEMO_AVAILABILITY_PATH}${query ? `?${query}` : ""}`;
}

export default function Home() {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [checkinDisplay, setCheckinDisplay] = useState("");
  const [checkoutDisplay, setCheckoutDisplay] = useState("");
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const reviewPages = buildReviewPages();
  const [reviewPageIndex, setReviewPageIndex] = useState(reviewPages.length);
  const [reviewTransition, setReviewTransition] = useState(true);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [teruelSlideIndex, setTeruelSlideIndex] = useState(0);
  const guestsPanelRef = useRef<HTMLDivElement>(null);
  const carouselReviewPages = [...reviewPages, ...reviewPages, ...reviewPages];
  const quickAvailabilityParams = new URLSearchParams({
    lang: "es",
    selected_currency: "EUR",
    do_availability_check: "1",
    hp_avform: "1",
    hp_group_set: "0",
    origin: "hp",
    src: "hotel",
    type: "total",
    sb_price_type: "total",
    dest_id: BOOKING_DEST_ID,
    dest_type: "city",
    checkin: formatDateForInput(new Date()),
    checkout: formatDateForInput(addDays(new Date(), BOOKING_DEFAULT_DAYS)),
    group_adults: String(adults),
    group_children: String(children),
    no_rooms: String(rooms),
  });
  const quickAvailabilityUrl = buildDemoAvailabilityUrl(quickAvailabilityParams);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleBookingSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    formData.forEach((value, key) => {
      if (typeof value === "string" && value.length > 0) {
        params.set(key, value);
      }
    });

    const checkin = params.get("checkin");
    const checkout = params.get("checkout");

    if (!checkin) {
      params.set("checkin", formatDateForInput(new Date()));
    }
    if (!checkout) {
      params.set("checkout", formatDateForInput(addDays(new Date(), BOOKING_DEFAULT_DAYS)));
    }

    const availabilityDemoUrl = buildDemoAvailabilityUrl(params);
    window.location.assign(availabilityDemoUrl);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!guestsPanelRef.current) return;
      if (!guestsPanelRef.current.contains(event.target as Node)) {
        setIsGuestsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlideIndex((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewTransition(true);
      setReviewPageIndex((current) => current + 1);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleReviewTrackTransitionEnd = () => {
    if (reviewPageIndex >= reviewPages.length * 2) {
      setReviewTransition(false);
      setReviewPageIndex(reviewPages.length);
      return;
    }
    if (reviewPageIndex < reviewPages.length) {
      setReviewTransition(false);
      setReviewPageIndex(reviewPages.length * 2 - 1);
    }
  };

  useEffect(() => {
    if (reviewTransition) return;
    const id = requestAnimationFrame(() => {
      setReviewTransition(true);
    });
    return () => cancelAnimationFrame(id);
  }, [reviewTransition]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTeruelSlideIndex((current) => (current + 1) % TERUEL_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const goToPrevTeruelSlide = () => {
    setTeruelSlideIndex((current) => (current - 1 + TERUEL_SLIDES.length) % TERUEL_SLIDES.length);
  };

  const goToNextTeruelSlide = () => {
    setTeruelSlideIndex((current) => (current + 1) % TERUEL_SLIDES.length);
  };

  const goToPrevHeroSlide = () => {
    setHeroSlideIndex((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToNextHeroSlide = () => {
    setHeroSlideIndex((current) => (current + 1) % HERO_SLIDES.length);
  };

  return (
    <>
      <nav>
        <a href="tel:+34605872573" className="nav-phone" aria-label="Llamar al 605 87 25 73">
          <span className="nav-phone-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.49c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.19 2.2z" />
            </svg>
          </span>
          <span className="nav-phone-text">605 87 25 73</span>
        </a>
        <div className="nav-logo">
          <Image
            src="/images/edificio-mexico-logo.png"
            alt="Logo Edificio México"
            width={230}
            height={70}
            className="brand-logo"
            priority
          />
        </div>
        <a href={BOOKING_HOTEL_URL} className="nav-reserve" target="_blank" rel="noreferrer">
          HAZ TU RESERVA
        </a>
      </nav>

      <section className="hero">
        {HERO_SLIDES.map((slide, index) => (
          <div key={slide.src} className={`hero-slide ${index === heroSlideIndex ? "is-active" : ""}`}>
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={index === 0}
              quality={82}
            />
          </div>
        ))}
        <div className="hero-overlay" />
        <button type="button" className="hero-nav hero-nav-prev" onClick={goToPrevHeroSlide} aria-label="Imagen anterior">
          ‹
        </button>
        <button type="button" className="hero-nav hero-nav-next" onClick={goToNextHeroSlide} aria-label="Imagen siguiente">
          ›
        </button>
        <div className="hero-dots">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.alt}
              type="button"
              className={`hero-dot ${index === heroSlideIndex ? "active" : ""}`}
              onClick={() => setHeroSlideIndex(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>

        <div className="hero-content">
          <p className="hero-eyebrow">Tu alojamiento en Teruel</p>
          <h1 className="hero-title">
            Teruel desde <em>otro punto</em>
            <br />
            de vista
          </h1>

          <div className="booking-card">
            <form className="booking-inner" onSubmit={handleBookingSubmit}>
              <input type="hidden" name="lang" value="es" />
              <input type="hidden" name="selected_currency" value="EUR" />
              <input type="hidden" name="do_availability_check" value="1" />
              <input type="hidden" name="hp_avform" value="1" />
              <input type="hidden" name="hp_group_set" value="0" />
              <input type="hidden" name="origin" value="hp" />
              <input type="hidden" name="src" value="hotel" />
              <input type="hidden" name="type" value="total" />
              <input type="hidden" name="sb_price_type" value="total" />
              <input type="hidden" name="dest_id" value={BOOKING_DEST_ID} />
              <input type="hidden" name="dest_type" value="city" />
              <input type="hidden" name="group_adults" value={adults} />
              <input type="hidden" name="group_children" value={children} />
              <input type="hidden" name="no_rooms" value={rooms} />

              <div className="bf-cell">
                <span className="bf-label">Entrada</span>
                <span className={`bf-value ${!checkinDisplay ? "placeholder" : ""}`}>{checkinDisplay || "Selecciona fecha"}</span>
                <input
                  type="date"
                  name="checkin"
                  className="bf-date-input"
                  onChange={(e) => setCheckinDisplay(formatDate(e.target.value))}
                />
              </div>

              <div className="bf-divider" />

              <div className="bf-cell">
                <span className="bf-label">Salida</span>
                <span className={`bf-value ${!checkoutDisplay ? "placeholder" : ""}`}>
                  {checkoutDisplay || "Selecciona fecha"}
                </span>
                <input
                  type="date"
                  name="checkout"
                  className="bf-date-input"
                  onChange={(e) => setCheckoutDisplay(formatDate(e.target.value))}
                />
              </div>

              <div className="bf-divider" />

              <div className="bf-cell bf-cell-guests" ref={guestsPanelRef} onClick={() => setIsGuestsOpen((p) => !p)}>
                <span className="bf-label">Huéspedes</span>
                <span className="bf-value">
                  {adults} adulto{adults !== 1 ? "s" : ""}
                  {children > 0 ? ` · ${children} niño${children !== 1 ? "s" : ""}` : ""}
                </span>

                {isGuestsOpen && (
                  <div className="guests-popover" onClick={(e) => e.stopPropagation()}>
                    {[
                      { key: "adults", label: "Adultos", sub: "13 años o más", min: 1, max: 8, value: adults, set: setAdults },
                      { key: "children", label: "Niños", sub: "2 – 12 años", min: 0, max: 6, value: children, set: setChildren },
                      { key: "rooms", label: "Habitaciones", sub: null, min: 1, max: 4, value: rooms, set: setRooms },
                    ].map(({ key, label, sub, min, max, value, set }) => (
                      <div className="guest-row" key={key}>
                        <div>
                          <div className="guest-label">{label}</div>
                          {sub && <div className="guest-sub">{sub}</div>}
                        </div>
                        <div className="guest-ctrl">
                          <button
                            type="button"
                            className="g-btn"
                            onClick={() => set((v) => Math.max(min, v - 1))}
                            disabled={value <= min}
                          >
                            −
                          </button>
                          <span className="g-count">{value}</span>
                          <button
                            type="button"
                            className="g-btn"
                            onClick={() => set((v) => Math.min(max, v + 1))}
                            disabled={value >= max}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" className="bf-search-btn">
                <span className="bf-search-icon">↗</span>
                Buscar disponibilidad
              </button>
            </form>
          </div>

          <div className="hero-actions">
            <a href="#alojamientos" className="hero-cta">
              Elige tu habitación <span className="cta-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="alojamientos" id="alojamientos">
        <div className="section-header reveal">
          <p className="section-eyebrow">Nuestros alojamientos</p>
          <h2 className="section-title">Elige tu opción ideal</h2>
        </div>
        <div className="cards">
          {ROOMS.map((room, index) => (
            <article key={room.name} className={`card reveal d${Math.min(index + 1, 3)}`}>
              <div className="card-img">
                <img src={room.image} alt={room.name} />
              </div>
              <div className="card-body">
                <div className="card-title">{room.name}</div>
                <p className="card-meta">
                  <strong>{room.size}</strong> · {room.bed}
                </p>
                <p className="card-description">{room.summary}</p>
                <ul className="card-features card-features-main">
                  {room.highlights.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <div className="card-subsection">
                  <p>Cocina</p>
                  <ul className="card-features">
                    {room.kitchen.map((item) => (
                      <li key={`${room.name}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="card-subsection">
                  <p>Baño</p>
                  <ul className="card-features">
                    {room.bathroom.map((item) => (
                      <li key={`${room.name}-bath-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>
                <ul className="card-features card-features-main">
                  <li>TV de pantalla plana</li>
                  <li>Entrada privada</li>
                  <li>Zona de comedor</li>
                  <li>Apartamento privado en edificio</li>
                </ul>
                <a href={quickAvailabilityUrl} className="btn-card">
                  Comprobar disponibilidad
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="teruel-carousel-section" id="galeria" aria-label="Carrusel de Teruel">
        <div className="teruel-carousel-track">
          {TERUEL_SLIDES.map((slide, index) => (
            <div key={slide.src} className={`teruel-slide ${index === teruelSlideIndex ? "is-active" : ""}`}>
              <img src={slide.src} alt={slide.alt} />
            </div>
          ))}
          <button type="button" className="teruel-nav teruel-nav-prev" onClick={goToPrevTeruelSlide} aria-label="Imagen anterior">
            ‹
          </button>
          <button type="button" className="teruel-nav teruel-nav-next" onClick={goToNextTeruelSlide} aria-label="Imagen siguiente">
            ›
          </button>
          <div className="teruel-dots">
            {TERUEL_SLIDES.map((slide, index) => (
              <button
                key={slide.alt}
                type="button"
                className={`teruel-dot ${index === teruelSlideIndex ? "active" : ""}`}
                onClick={() => setTeruelSlideIndex(index)}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="resenas" id="resenas">
        <div className="resenas-inner">
          <div className="resenas-grid reveal">
            <div className="resenas-side">
              <div className="booking-block">
                <Image
                  src="/images/rating-general.png"
                  alt="Valoración general"
                  width={520}
                  height={360}
                  className="rating-general-image"
                />
                <Image
                  src="/images/logo-booking.png"
                  alt="Logo Booking"
                  width={360}
                  height={96}
                  className="booking-logo-large"
                />
                <p className="booking-comments-count">512 comentarios</p>
              </div>
              <div className="google-logo-slot">
                <Image
                  src="/images/logo-google.png"
                  alt="Google"
                  width={280}
                  height={280}
                  className="google-logo-large"
                />
              </div>
            </div>
            <div className="reviews-carousel">
              <div
                className={`reviews-track ${reviewTransition ? "" : "no-transition"}`}
                style={{ transform: `translateX(-${reviewPageIndex * 100}%)` }}
                onTransitionEnd={handleReviewTrackTransitionEnd}
              >
                {carouselReviewPages.map((page, pageIndex) => (
                  <div className="review-page" key={`page-${pageIndex}`}>
                    <div className="reviews-grid">
                      {page.map((review, index) => (
                        <article className="review-card" key={`${review.author}-${review.date}-${index}`}>
                          <div className="review-meta">
                            <span className="review-badge">{review.title}</span>
                          </div>
                          <p className="review-text">{review.text}</p>
                          <div className="review-author">
                            {review.author}, {review.country}
                          </div>
                          <div className="review-submeta">
                            {review.type} - {review.date}
                          </div>
                          <img
                            src="/images/rating-number.png"
                            alt="Valoración 10"
                            className="review-score-image"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                        </article>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ubicacion-section" id="ubicacion">
        <div className="ubicacion-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1520.4156259531956!2d-1.1088443809215651!3d40.34608926889388!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd5e73320d7177a5%3A0xf2f0671726916355!2sEstudios%20los%20Arcos%20Teruel!5e0!3m2!1ses!2ses!4v1777355252929!5m2!1ses!2ses"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Estudios Los Arcos Teruel"
          />
        </div>
        <div className="ubicacion-content reveal">
          <p className="section-eyebrow">Ubicación</p>
          <h2 className="section-title">Estamos en el casco histórico de Teruel</h2>
          <p className="ubicacion-text">
            Dirección: C. los Baches, 13, 44003 Teruel
            <br />
            Teléfono (atención 24 horas): 605 87 25 73
          </p>
          <div className="ubicacion-chip">
            <strong>9,0</strong>
            <span>Valoración de ubicación · 511 comentarios</span>
          </div>
        </div>
      </section>

      <section className="cta-final" id="cta">
        <div className="cta-text">
          <div className="cta-text-main">Todo listo para tu estancia en Teruel</div>
          <div className="cta-text-sub">Apartamentos funcionales con todo lo que necesitas.</div>
        </div>
        <a href={BOOKING_HOTEL_URL} className="cta-btn" target="_blank" rel="noreferrer">
          Reservar en Booking
        </a>
      </section>

      <footer className="footer-nav" id="contacto">
        <div className="footer-brand">
          <Image
            src="/images/edificio-mexico-logo.png"
            alt="Logo Edificio México"
            width={120}
            height={36}
            className="footer-brand-logo"
          />
          <div className="footer-logo-text">EDIFICIO MÉXICO</div>
        </div>
        <ul className="footer-links">
          <li>
            <a href="#alojamientos">Apartamentos</a>
          </li>
          <li>
            <a href="#ubicacion">Ubicación</a>
          </li>
          <li>
            <a href="#resenas">Opiniones</a>
          </li>
        </ul>
      </footer>
    </>
  );
}
