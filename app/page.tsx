"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import StayModal, { type StaySelection } from "./components/StayModal";

const BOOKING_HOTEL_URL = "https://www.booking.com/hotel/es/estudios-los-arcos.es.html";
const BOOKING_DEST_ID = "-404164";
const BOOKING_DEFAULT_DAYS = 2;
const DEMO_AVAILABILITY_PATH = "/reserva";
const HERO_SLIDES = [
  { src: "/images/edificio-mexico-hero.jpg", alt: "Salón del apartamento Edificio México" },
  { src: "/images/foto-habitacion.jpg", alt: "Habitación del apartamento Edificio México" },
  { src: "/images/foto-bano.jpg", alt: "Baño del apartamento Edificio México" },
  { src: "/images/foto-terraza.jpg", alt: "Terraza del apartamento Edificio México" },
] as const;
const HERO_INTERVAL_MS = 5500;
type AptIcon =
  | "tv" | "sofa" | "dining" | "wifi"
  | "bed" | "wardrobe" | "ac" | "linen"
  | "kitchen" | "fridge" | "coffee" | "cutlery"
  | "sea" | "balcony" | "sun" | "palm"
  | "terrace" | "table-out" | "open-air" | "sunbathe";

type AptSlide = {
  title: string;
  image: string;
  alt: string;
  features: { icon: AptIcon; label: string }[];
};

const APARTMENT_SLIDES: AptSlide[] = [
  {
    title: "Salón",
    image: "/images/foto-salon.jpg",
    alt: "Salón del apartamento Edificio México",
    features: [
      { icon: "tv", label: "TV de pantalla plana" },
      { icon: "sofa", label: "Sofá cama" },
      { icon: "dining", label: "Zona de comedor" },
      { icon: "wifi", label: "WiFi gratis" },
    ],
  },
  {
    title: "Dormitorio",
    image: "/images/foto-cama.jpg",
    alt: "Dormitorio del apartamento Edificio México",
    features: [
      { icon: "bed", label: "Cama doble" },
      { icon: "wardrobe", label: "Armario amplio" },
      { icon: "ac", label: "Aire acondicionado" },
      { icon: "linen", label: "Ropa de cama incluida" },
    ],
  },
  {
    title: "Cocina",
    image: "/images/foto-cocina.jpg",
    alt: "Cocina del apartamento Edificio México",
    features: [
      { icon: "kitchen", label: "Cocina equipada" },
      { icon: "fridge", label: "Nevera y horno" },
      { icon: "coffee", label: "Cafetera y microondas" },
      { icon: "cutlery", label: "Vajilla y utensilios" },
    ],
  },
  {
    title: "Balcón",
    image: "/images/foto-balcon.jpg",
    alt: "Balcón con vistas al mar del apartamento Edificio México",
    features: [
      { icon: "sea", label: "Vistas al mar" },
      { icon: "balcony", label: "Balcón privado" },
      { icon: "sun", label: "Luz natural" },
      { icon: "palm", label: "Zona tranquila" },
    ],
  },
  {
    title: "Terraza",
    image: "/images/foto-terrace.jpg",
    alt: "Terraza del apartamento Edificio México",
    features: [
      { icon: "terrace", label: "Terraza privada" },
      { icon: "table-out", label: "Mesa exterior" },
      { icon: "open-air", label: "Espacio al aire libre" },
      { icon: "sunbathe", label: "Tomar el sol" },
    ],
  },
];

function AptFeatureIcon({ name }: { name: AptIcon }) {
  const stroke = "currentColor";
  const sw = 1.5;
  switch (name) {
    case "tv":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect x="4" y="6" width="24" height="16" rx="2" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M11 26h10M16 22v4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "sofa":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M5 19v-4a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v4" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d="M3 24v-3a2 2 0 0 1 2-2h22a2 2 0 0 1 2 2v3" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d="M6 24v3M26 24v3" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "dining":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M5 14h22M6 14v12M26 14v12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M9 14v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" stroke={stroke} strokeWidth={sw} fill="none" />
        </svg>
      );
    case "wifi":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M5 13a16 16 0 0 1 22 0M9 17.5a10 10 0 0 1 14 0M13 22a4 4 0 0 1 6 0" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <circle cx="16" cy="25.5" r="1.4" fill={stroke} />
        </svg>
      );
    case "bed":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M4 22V11M28 22v-6a3 3 0 0 0-3-3H14v6" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d="M4 18h24v4" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <circle cx="10" cy="15" r="2" stroke={stroke} strokeWidth={sw} fill="none" />
        </svg>
      );
    case "wardrobe":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect x="7" y="4" width="18" height="24" rx="1.5" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M16 4v24" stroke={stroke} strokeWidth={sw} />
          <circle cx="13.5" cy="16" r="0.9" fill={stroke} />
          <circle cx="18.5" cy="16" r="0.9" fill={stroke} />
        </svg>
      );
    case "ac":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect x="4" y="8" width="24" height="10" rx="2" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M9 13h14" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M11 21v2M16 21v3M21 21v2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "linen":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M5 9c4 0 4 4 8 4s4-4 8-4 4 4 6 4M5 16c4 0 4 4 8 4s4-4 8-4 4 4 6 4M5 23c4 0 4 4 8 4s4-4 8-4 4 4 6 4" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </svg>
      );
    case "kitchen":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect x="6" y="6" width="20" height="20" rx="1.5" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M6 13h20" stroke={stroke} strokeWidth={sw} />
          <circle cx="10" cy="10" r="0.8" fill={stroke} />
          <circle cx="14" cy="10" r="0.8" fill={stroke} />
          <circle cx="18" cy="19.5" r="3" stroke={stroke} strokeWidth={sw} fill="none" />
        </svg>
      );
    case "fridge":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect x="9" y="4" width="14" height="24" rx="1.5" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M9 14h14" stroke={stroke} strokeWidth={sw} />
          <path d="M12 8v3M12 17v4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "coffee":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M6 13h17v7a6 6 0 0 1-6 6h-5a6 6 0 0 1-6-6v-7Z" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M23 15h2a3 3 0 0 1 0 6h-2" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M11 9c0-2 2-2 2-4M16 9c0-2 2-2 2-4" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </svg>
      );
    case "cutlery":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M11 4v10a3 3 0 0 1-6 0V4M8 14v14" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d="M22 4c-3 0-5 3-5 7s2 5 5 5v12M22 4c3 0 5 3 5 7s-2 5-5 5" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </svg>
      );
    case "sea":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M3 12c3-2 5-2 8 0s5 2 8 0 5-2 8 0M3 18c3-2 5-2 8 0s5 2 8 0 5-2 8 0M3 24c3-2 5-2 8 0s5 2 8 0 5-2 8 0" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
        </svg>
      );
    case "balcony":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M5 12h22M5 12v14M27 12v14M11 12v14M16 12v14M21 12v14M3 26h26" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M9 12V6h14v6" stroke={stroke} strokeWidth={sw} fill="none" />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="5" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M16 3v3M16 26v3M3 16h3M26 16h3M7 7l2 2M23 23l2 2M7 25l2-2M23 9l2-2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "palm":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 28V13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M16 13c-2-3-6-4-10-2 3-2 7-1 10 2Zm0 0c2-3 6-4 10-2-3-2-7-1-10 2Zm0 0c-3-2-5-6-3-10 1 3 1 7 3 10Zm0 0c3-2 5-6 3-10-1 3-1 7-3 10Z" stroke={stroke} strokeWidth={sw} fill="none" strokeLinejoin="round" />
        </svg>
      );
    case "terrace":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M3 14l13-8 13 8M6 14v12h20V14" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 26v-5h4v5M19 21h3v3h-3z" stroke={stroke} strokeWidth={sw} fill="none" />
        </svg>
      );
    case "table-out":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M4 14h24" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M7 14l-2 12M25 14l2 12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M14 14v-3a2 2 0 0 1 4 0v3" stroke={stroke} strokeWidth={sw} fill="none" />
        </svg>
      );
    case "open-air":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M6 20a5 5 0 0 1 1-9.9 7 7 0 0 1 13.5-1.4A5 5 0 0 1 25 20H6Z" stroke={stroke} strokeWidth={sw} fill="none" strokeLinejoin="round" />
          <path d="M10 25h12M14 28h6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    case "sunbathe":
      return (
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="9" cy="9" r="2.5" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M4 22c3-3 7-4 11-4s8 1 13 4" stroke={stroke} strokeWidth={sw} fill="none" strokeLinecap="round" />
          <path d="M4 22h24" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M22 6l3-2 1 4-3 1z" stroke={stroke} strokeWidth={sw} fill="none" strokeLinejoin="round" />
        </svg>
      );
  }
}
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
  const [heroSlide, setHeroSlide] = useState(0);
  const [aptSlide, setAptSlide] = useState(0);
  const aptTrackRef = useRef<HTMLDivElement>(null);
  const [aptTranslate, setAptTranslate] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const update = () => {
      const track = aptTrackRef.current;
      if (!track) return;
      const slide = track.querySelector<HTMLElement>(".apt-slide");
      if (!slide) return;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
      setAptTranslate(aptSlide * (slide.getBoundingClientRect().width + gap));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [aptSlide]);
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

      <section className="hero" aria-roledescription="carousel" aria-label="Fotos del apartamento Edificio México">
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className={`hero-slide ${index === heroSlide ? "is-active" : ""}`}
            aria-hidden={index === heroSlide ? "false" : "true"}
          >
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

        <button
          type="button"
          className="hero-nav hero-nav-prev"
          aria-label="Imagen anterior"
          onClick={() =>
            setHeroSlide((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
          }
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="hero-nav hero-nav-next"
          aria-label="Imagen siguiente"
          onClick={() => setHeroSlide((current) => (current + 1) % HERO_SLIDES.length)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="hero-dots" role="tablist" aria-label="Selector de imagen">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              role="tab"
              aria-selected={index === heroSlide}
              aria-label={`Ir a la imagen ${index + 1}`}
              className={`hero-dot ${index === heroSlide ? "is-active" : ""}`}
              onClick={() => setHeroSlide(index)}
            />
          ))}
        </div>

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
          <p className="section-sub">
            {APARTMENT_SLIDES[aptSlide]?.title} · {aptSlide + 1} / {APARTMENT_SLIDES.length}
          </p>
        </div>

        <div className="apt-carousel reveal">
          <button
            type="button"
            className="apt-nav apt-nav-prev"
            aria-label="Imagen anterior"
            onClick={() =>
              setAptSlide((current) => (current - 1 + APARTMENT_SLIDES.length) % APARTMENT_SLIDES.length)
            }
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="apt-viewport">
            <div
              className="apt-track"
              ref={aptTrackRef}
              style={{ transform: `translateX(-${aptTranslate}px)` }}
            >
              {APARTMENT_SLIDES.map((slide, index) => (
                <div
                  key={slide.image}
                  className={`apt-slide ${index === aptSlide ? "is-active" : ""}`}
                  aria-hidden={index === aptSlide ? "false" : "true"}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 768px) 90vw, (max-width: 1280px) 80vw, 1100px"
                    quality={82}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="apt-nav apt-nav-next"
            aria-label="Imagen siguiente"
            onClick={() => setAptSlide((current) => (current + 1) % APARTMENT_SLIDES.length)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="apt-dots" role="tablist" aria-label="Selector de slide">
          {APARTMENT_SLIDES.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              role="tab"
              aria-selected={index === aptSlide}
              aria-label={`Ver ${slide.title}`}
              className={`apt-dot ${index === aptSlide ? "is-active" : ""}`}
              onClick={() => setAptSlide(index)}
            >
              <span>{slide.title}</span>
            </button>
          ))}
        </div>

        <div className="apt-features" role="list" aria-label={`Características de ${APARTMENT_SLIDES[aptSlide]?.title}`}>
          {APARTMENT_SLIDES[aptSlide]?.features.map((feature) => (
            <div className="apt-feature" role="listitem" key={`${aptSlide}-${feature.label}`}>
              <span className="apt-feature-icon" aria-hidden="true">
                <AptFeatureIcon name={feature.icon} />
              </span>
              <span className="apt-feature-label">{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="apt-cta">
          <a href={quickAvailabilityUrl} className="btn-card">
            Comprobar disponibilidad
          </a>
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
