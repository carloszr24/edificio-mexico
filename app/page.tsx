"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import StayModal, { type StaySelection } from "./components/StayModal";

const BOOKING_HOTEL_URL = "https://www.booking.com/hotel/es/estudios-los-arcos.es.html";
const BOOKING_DEST_ID = "-404164";
const BOOKING_DEFAULT_DAYS = 2;
const DEMO_AVAILABILITY_PATH = "/reserva";
const APARTMENT = {
  name: "Apartamento Edificio México",
  image: "/images/edificio-mexico-hero.jpg",
  size: "Apartamento completo",
  bed: "1 cama doble + 1 sofá cama",
  summary:
    "Apartamento entero en El Puerto de Roquetas de Mar. Aire acondicionado individual, cocina privada totalmente equipada y vistas a la ciudad. Perfecto para parejas o familias que quieran sentirse como en casa.",
  highlights: [
    "Apartamento entero",
    "Cocina privada",
    "Aire acondicionado",
    "WiFi gratis",
    "Vistas a la ciudad",
  ],
  kitchen: ["Nevera", "Cafetera", "Microondas", "Utensilios", "Horno", "Fogones", "Tostadora"],
  bathroom: ["Ducha a ras de suelo", "Artículos de aseo gratis", "Toallas", "Papel higiénico"],
} as const;
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
  const [stay, setStay] = useState<StaySelection>({
    adults: 2,
    children: 0,
    coupon: "",
  });
  const [isStayModalOpen, setIsStayModalOpen] = useState(false);
  const reviewPages = buildReviewPages();
  const [reviewPageIndex, setReviewPageIndex] = useState(reviewPages.length);
  const [reviewTransition, setReviewTransition] = useState(true);
  const carouselReviewPages = [...reviewPages, ...reviewPages, ...reviewPages];

  const stayTriggerLabel = (() => {
    if (!stay.from || !stay.to) return "Selecciona tu estancia";
    const fmt = (d: Date) =>
      d.toLocaleDateString("es-ES", { day: "numeric", month: "short" }).replace(".", "");
    return `${fmt(stay.from)} - ${fmt(stay.to)}`;
  })();

  const stayGuestsLabel = `${stay.adults} adulto${stay.adults !== 1 ? "s" : ""}${
    stay.children > 0 ? ` · ${stay.children} niño${stay.children !== 1 ? "s" : ""}` : ""
  }`;

  const buildAvailabilityParams = (selection: StaySelection) => {
    const params = new URLSearchParams({
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
      checkin: formatDateForInput(selection.from ?? new Date()),
      checkout: formatDateForInput(
        selection.to ?? addDays(selection.from ?? new Date(), BOOKING_DEFAULT_DAYS),
      ),
      group_adults: String(selection.adults),
      group_children: String(selection.children),
      no_rooms: "1",
    });
    if (selection.coupon) {
      params.set("coupon", selection.coupon);
    }
    return params;
  };

  const quickAvailabilityUrl = buildDemoAvailabilityUrl(buildAvailabilityParams(stay));

  const handleStaySubmit = (selection: StaySelection) => {
    setStay(selection);
    setIsStayModalOpen(false);
    const url = buildDemoAvailabilityUrl(buildAvailabilityParams(selection));
    window.location.assign(url);
  };

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

  return (
    <>
      <nav>
        <a href="tel:+34601523359" className="nav-phone" aria-label="Llamar al 601 52 33 59">
          <span className="nav-phone-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.61 21 3 13.39 3 4c0-.55.45-1 1-1h3.49c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.19 2.2z" />
            </svg>
          </span>
          <span className="nav-phone-text">601 52 33 59</span>
        </a>
        <div className="nav-logo">
          <Image
            src="/images/edificio-mexico-logo.png"
            alt="Logo Edificio México"
            width={460}
            height={140}
            className="brand-logo"
            priority
          />
        </div>
        <a href={BOOKING_HOTEL_URL} className="nav-reserve" target="_blank" rel="noreferrer">
          HAZ TU RESERVA
        </a>
      </nav>

      <section className="hero">
        <div className="hero-slide is-active">
          <Image
            src="/images/edificio-mexico-hero.jpg"
            alt="Edificio México - alojamiento en Roquetas de Mar"
            fill
            sizes="100vw"
            priority
            quality={82}
          />
        </div>
        <div className="hero-overlay" />

        <div className="hero-content">
          <button
            type="button"
            className="stay-trigger"
            onClick={() => setIsStayModalOpen(true)}
            aria-haspopup="dialog"
          >
            <span className="stay-trigger-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
                <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stay-trigger-text">
              <span className="stay-trigger-title">{stayTriggerLabel}</span>
              <span className="stay-trigger-sub">{stayGuestsLabel}</span>
            </span>
            <span className="stay-trigger-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>

          <div className="hero-actions">
            <a href="#alojamientos" className="hero-cta">
              Ver el apartamento <span className="cta-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="alojamientos" id="alojamientos">
        <div className="section-header reveal">
          <p className="section-eyebrow">Nuestro alojamiento</p>
          <h2 className="section-title">Tu apartamento en Roquetas de Mar</h2>
        </div>
        <div className="cards cards-single">
          <article className="card reveal d1">
            <div className="card-img">
              <img src={APARTMENT.image} alt={APARTMENT.name} />
            </div>
            <div className="card-body">
              <div className="card-title">{APARTMENT.name}</div>
              <p className="card-meta">
                <strong>{APARTMENT.size}</strong> · {APARTMENT.bed}
              </p>
              <p className="card-description">{APARTMENT.summary}</p>
              <ul className="card-features card-features-main">
                {APARTMENT.highlights.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <div className="card-subsection">
                <p>Cocina</p>
                <ul className="card-features">
                  {APARTMENT.kitchen.map((item) => (
                    <li key={`kitchen-${item}`}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="card-subsection">
                <p>Baño</p>
                <ul className="card-features">
                  {APARTMENT.bathroom.map((item) => (
                    <li key={`bath-${item}`}>{item}</li>
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
        </div>
      </section>

      <section className="video-showcase" id="galeria" aria-label="V\u00eddeo de Edificio M\u00e9xico en Almer\u00eda">
        <video
          className="video-showcase-media"
          src="/images/edificio-mexico-almeria.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="V\u00eddeo en loop del Edificio M\u00e9xico"
        />
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
            src="https://www.google.com/maps?q=Avenida+Antonio+Machado+73,+El+Puerto,+Roquetas+de+Mar&output=embed"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Edificio México - Roquetas de Mar"
          />
        </div>
        <div className="ubicacion-content reveal">
          <p className="section-eyebrow">Ubicación</p>
          <h2 className="section-title">Estamos en El Puerto de Roquetas de Mar</h2>
          <p className="ubicacion-text">
            Dirección: Avenida Antonio Machado 73, El Puerto, Roquetas de Mar
            <br />
            Teléfono (atención 24 horas): <a href="tel:+34601523359">601 52 33 59</a>
            <br />
            Email: <a href="mailto:info@edificiomexico.com">info@edificiomexico.com</a>
          </p>
          <div className="ubicacion-chip">
            <strong>9,0</strong>
            <span>Valoración de ubicación · 511 comentarios</span>
          </div>
        </div>
      </section>

      <section className="cta-final" id="cta">
        <div className="cta-text">
          <div className="cta-text-main">Todo listo para tu estancia en Roquetas de Mar</div>
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
        <ul className="footer-contact">
          <li>
            <a href="tel:+34601523359">601 52 33 59</a>
          </li>
          <li>
            <a href="mailto:info@edificiomexico.com">info@edificiomexico.com</a>
          </li>
        </ul>
      </footer>

      <StayModal
        open={isStayModalOpen}
        initial={stay}
        onClose={() => setIsStayModalOpen(false)}
        onSubmit={handleStaySubmit}
      />
    </>
  );
}
