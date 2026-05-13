"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker, type DateRange, type DayButtonProps } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";

const NIGHTLY_PRICE_LABEL = "84\u20ac";

function PricedDayButton({ day, modifiers, children, ...buttonProps }: DayButtonProps) {
  const showPrice = !modifiers.disabled && !modifiers.outside && !modifiers.hidden;
  return (
    <button {...buttonProps} type="button">
      <span className="rdp-day-num">{day.date.getDate()}</span>
      {showPrice && <span className="rdp-day-price">{NIGHTLY_PRICE_LABEL}</span>}
      {children}
    </button>
  );
}

export type StaySelection = {
  from?: Date;
  to?: Date;
  adults: number;
  children: number;
  coupon: string;
};

type Section = "dates" | "guests" | "coupon" | null;

type Props = {
  open: boolean;
  initial: StaySelection;
  onClose: () => void;
  onSubmit: (selection: StaySelection) => void;
};

function formatRange(from?: Date, to?: Date) {
  if (!from) return null;
  const fmt = (d: Date) =>
    d.toLocaleDateString("es-ES", { day: "numeric", month: "short" }).replace(".", "");
  if (!to) return fmt(from);
  return `${fmt(from)} - ${fmt(to)}`;
}

export default function StayModal({ open, initial, onClose, onSubmit }: Props) {
  const [range, setRange] = useState<DateRange | undefined>(
    initial.from ? { from: initial.from, to: initial.to } : undefined,
  );
  const [adults, setAdults] = useState(initial.adults);
  const [children, setChildren] = useState(initial.children);
  const [coupon, setCoupon] = useState(initial.coupon);
  const [openSection, setOpenSection] = useState<Section>("dates");
  const dialogRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  useEffect(() => {
    if (!open) return;
    setRange(initial.from ? { from: initial.from, to: initial.to } : undefined);
    setAdults(initial.adults);
    setChildren(initial.children);
    setCoupon(initial.coupon);
    setOpenSection("dates");
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const datesSummary = formatRange(range?.from, range?.to);
  const guestsSummary = `${adults} adulto${adults !== 1 ? "s" : ""}${
    children > 0 ? ` · ${children} niño${children !== 1 ? "s" : ""}` : ""
  }`;
  const couponSummary = coupon.trim() ? coupon.trim().toUpperCase() : null;
  const canSubmit = Boolean(range?.from && range?.to);

  const handleSubmit = () => {
    if (!canSubmit || !range?.from || !range?.to) return;
    onSubmit({
      from: range.from,
      to: range.to,
      adults,
      children,
      coupon: coupon.trim(),
    });
  };

  return (
    <div
      className="stay-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stay-modal-title"
      onClick={onClose}
    >
      <div className="stay-modal" ref={dialogRef} onClick={(event) => event.stopPropagation()}>
        <header className="stay-modal-header">
          <h2 id="stay-modal-title">Selecciona tu estancia</h2>
          <button type="button" className="stay-modal-close" onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="stay-modal-body">
          <section className={`stay-section ${openSection === "dates" ? "is-open" : ""}`}>
            <button
              type="button"
              className="stay-section-trigger"
              onClick={() => setOpenSection((current) => (current === "dates" ? null : "dates"))}
              aria-expanded={openSection === "dates"}
            >
              <span className="stay-section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="stay-section-text">
                <span className="stay-section-title">Fechas</span>
                {datesSummary && openSection !== "dates" && (
                  <span className="stay-section-summary">{datesSummary}</span>
                )}
              </span>
              <span className={`stay-section-chevron ${openSection === "dates" ? "is-open" : ""}`} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            {openSection === "dates" && (
              <div className="stay-section-body">
                <DayPicker
                  mode="range"
                  numberOfMonths={2}
                  selected={range}
                  onSelect={setRange}
                  disabled={{ before: today }}
                  locale={es}
                  showOutsideDays={false}
                  weekStartsOn={1}
                  className="stay-daypicker"
                  components={{
                    DayButton: PricedDayButton,
                  }}
                />
                <button
                  type="button"
                  className="stay-reset"
                  onClick={() => setRange(undefined)}
                  disabled={!range?.from}
                >
                  Restablecer
                </button>
              </div>
            )}
          </section>

          <section className={`stay-section ${openSection === "guests" ? "is-open" : ""}`}>
            <button
              type="button"
              className="stay-section-trigger"
              onClick={() => setOpenSection((current) => (current === "guests" ? null : "guests"))}
              aria-expanded={openSection === "guests"}
            >
              <span className="stay-section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M5.5 19.5c0-3.4 2.9-6 6.5-6s6.5 2.6 6.5 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <span className="stay-section-text">
                <span className="stay-section-title">Huéspedes</span>
                {openSection !== "guests" && (
                  <span className="stay-section-summary">{guestsSummary}</span>
                )}
              </span>
              <span className={`stay-section-chevron ${openSection === "guests" ? "is-open" : ""}`} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            {openSection === "guests" && (
              <div className="stay-section-body">
                <GuestRow
                  label="Adultos"
                  sub="18 años o más"
                  value={adults}
                  min={1}
                  max={8}
                  onChange={setAdults}
                />
                <GuestRow
                  label="Niños"
                  sub="0 - 17 años"
                  value={children}
                  min={0}
                  max={6}
                  onChange={setChildren}
                />
              </div>
            )}
          </section>

          <section className={`stay-section ${openSection === "coupon" ? "is-open" : ""}`}>
            <button
              type="button"
              className="stay-section-trigger"
              onClick={() => setOpenSection((current) => (current === "coupon" ? null : "coupon"))}
              aria-expanded={openSection === "coupon"}
            >
              <span className="stay-section-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M8 16l8-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="15" r="1.5" fill="currentColor" />
                </svg>
              </span>
              <span className="stay-section-text">
                <span className="stay-section-title">Código de cupón</span>
                {couponSummary && openSection !== "coupon" && (
                  <span className="stay-section-summary">{couponSummary}</span>
                )}
              </span>
              <span className={`stay-section-chevron ${openSection === "coupon" ? "is-open" : ""}`} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            {openSection === "coupon" && (
              <div className="stay-section-body">
                <input
                  type="text"
                  className="stay-coupon-input"
                  placeholder="Introduce tu código"
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
                  autoComplete="off"
                  maxLength={32}
                />
              </div>
            )}
          </section>
        </div>

        <footer className="stay-modal-footer">
          <button
            type="button"
            className="stay-submit"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Buscar disponibilidad
          </button>
        </footer>
      </div>
    </div>
  );
}

type GuestRowProps = {
  label: string;
  sub: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function GuestRow({ label, sub, value, min, max, onChange }: GuestRowProps) {
  return (
    <div className="stay-guest-row">
      <div>
        <div className="stay-guest-label">
          {label} <span className="stay-guest-sub">({sub})</span>
        </div>
      </div>
      <div className="stay-guest-ctrl">
        <button
          type="button"
          className="stay-guest-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Reducir ${label.toLowerCase()}`}
        >
          −
        </button>
        <span className="stay-guest-count" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          className="stay-guest-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Aumentar ${label.toLowerCase()}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
