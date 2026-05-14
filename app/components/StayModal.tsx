"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";

export type Extra = {
  id: string;
  label: string;
  sub: string;
  price: number;
  unit: "night" | "stay" | "person-night";
};

export const EXTRAS: Extra[] = [
  { id: "cleaning", label: "Limpieza diaria", sub: "Limpieza completa de la unidad cada día", price: 15, unit: "night" },
  { id: "parking", label: "Parking privado", sub: "Plaza reservada en el edificio", price: 10, unit: "night" },
  { id: "breakfast", label: "Desayuno continental", sub: "Café, zumo, fruta y bollería", price: 8, unit: "person-night" },
  { id: "crib", label: "Cuna para bebé", sub: "Cuna de viaje con ropa de cama", price: 5, unit: "night" },
  { id: "late_checkout", label: "Late check-out (14:00)", sub: "Sal hasta las 14:00 el último día", price: 20, unit: "stay" },
  { id: "beach", label: "Kit de playa", sub: "Sombrilla, dos toallas y nevera portátil", price: 12, unit: "stay" },
];

export type GuestInfo = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export type PaymentMethod = "card" | "bizum" | "transfer";

export type StaySelection = {
  from?: Date;
  to?: Date;
  adults: number;
  children: number;
  coupon: string;
  extras: string[];
  guest: GuestInfo;
  paymentMethod: PaymentMethod;
};

type Step = "stay" | "extras" | "guest" | "payment" | "done";

type StepDescriptor = {
  id: Step;
  title: string;
  label: string;
};

const STEPS: StepDescriptor[] = [
  { id: "stay", title: "Selecciona tu estancia", label: "Estancia" },
  { id: "extras", title: "Tus extras", label: "Extras" },
  { id: "guest", title: "Tus datos", label: "Datos" },
  { id: "payment", title: "Pago seguro", label: "Pago" },
];

const NIGHTLY_PRICE = 84;
const COUPON_DISCOUNT = 0.1;

type Props = {
  open: boolean;
  initial: StaySelection;
  onClose: () => void;
  onComplete?: (selection: StaySelection) => void;
};

type Section = "dates" | "guests" | "coupon" | null;

function formatRange(from?: Date, to?: Date) {
  if (!from) return null;
  const fmt = (d: Date) =>
    d.toLocaleDateString("es-ES", { day: "numeric", month: "short" }).replace(".", "");
  if (!to) return fmt(from);
  return `${fmt(from)} - ${fmt(to)}`;
}

function nightsBetween(from?: Date, to?: Date) {
  if (!from || !to) return 0;
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function extraCost(extra: Extra, nights: number, adults: number, children: number) {
  switch (extra.unit) {
    case "night":
      return extra.price * Math.max(1, nights);
    case "stay":
      return extra.price;
    case "person-night":
      return extra.price * Math.max(1, nights) * Math.max(1, adults + children);
  }
}

function formatEur(n: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n);
}

function emailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function StayModal({ open, initial, onClose, onComplete }: Props) {
  const [step, setStep] = useState<Step>("stay");
  const [range, setRange] = useState<DateRange | undefined>(
    initial.from ? { from: initial.from, to: initial.to } : undefined,
  );
  const [adults, setAdults] = useState(initial.adults);
  const [children, setChildren] = useState(initial.children);
  const [coupon, setCoupon] = useState(initial.coupon);
  const [openSection, setOpenSection] = useState<Section>("dates");
  const [extras, setExtras] = useState<string[]>(initial.extras ?? []);
  const [guest, setGuest] = useState<GuestInfo>(initial.guest);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initial.paymentMethod);
  const [submittedGuest, setSubmittedGuest] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  useEffect(() => {
    if (!open) return;
    setStep("stay");
    setRange(initial.from ? { from: initial.from, to: initial.to } : undefined);
    setAdults(initial.adults);
    setChildren(initial.children);
    setCoupon(initial.coupon);
    setExtras(initial.extras ?? []);
    setGuest(initial.guest);
    setPaymentMethod(initial.paymentMethod);
    setSubmittedGuest(false);
    setIsProcessing(false);
    setOpenSection("dates");
  }, [open, initial]);

  useEffect(() => {
    if (!open || step !== "stay") return;
    if (openSection !== "dates") return;
    if (range?.from && range?.to) {
      const id = window.setTimeout(() => setOpenSection("guests"), 220);
      return () => window.clearTimeout(id);
    }
  }, [open, step, openSection, range?.from, range?.to]);

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

  const nights = nightsBetween(range?.from, range?.to);
  const baseCost = nights * NIGHTLY_PRICE;
  const extrasCost = extras.reduce((total, id) => {
    const extra = EXTRAS.find((e) => e.id === id);
    if (!extra) return total;
    return total + extraCost(extra, nights, adults, children);
  }, 0);
  const couponApplied = coupon.trim().length > 0;
  const subtotal = baseCost + extrasCost;
  const discount = couponApplied ? subtotal * COUPON_DISCOUNT : 0;
  const total = Math.max(0, subtotal - discount);

  const datesSummary = formatRange(range?.from, range?.to);
  const guestsSummary = `${adults} adulto${adults !== 1 ? "s" : ""}${
    children > 0 ? ` · ${children} niño${children !== 1 ? "s" : ""}` : ""
  }`;
  const couponSummary = coupon.trim() ? coupon.trim().toUpperCase() : null;
  const stayReady = Boolean(range?.from && range?.to);
  const guestReady = guest.name.trim().length > 1 && emailValid(guest.email) && guest.phone.trim().length >= 6;

  const currentTitle = step === "done" ? "¡Reserva confirmada!" : STEPS.find((s) => s.id === step)?.title ?? "";

  const goNext = () => {
    if (step === "stay") {
      if (!stayReady) return;
      setStep("extras");
    } else if (step === "extras") {
      setStep("guest");
    } else if (step === "guest") {
      setSubmittedGuest(true);
      if (!guestReady) return;
      setStep("payment");
    } else if (step === "payment") {
      handleConfirmPayment();
    }
  };

  const goBack = () => {
    if (step === "extras") setStep("stay");
    else if (step === "guest") setStep("extras");
    else if (step === "payment") setStep("guest");
  };

  const handleConfirmPayment = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("done");
      onComplete?.({
        from: range?.from,
        to: range?.to,
        adults,
        children,
        coupon: coupon.trim(),
        extras,
        guest,
        paymentMethod,
      });
    }, 1500);
  };

  const toggleExtra = (id: string) => {
    setExtras((current) =>
      current.includes(id) ? current.filter((eid) => eid !== id) : [...current, id],
    );
  };

  const continueLabel = (() => {
    if (step === "stay") return "Continuar";
    if (step === "extras") return "Continuar";
    if (step === "guest") return "Ir al pago";
    if (step === "payment") return isProcessing ? "Procesando..." : "Confirmar pago";
    return "Cerrar";
  })();

  const continueDisabled =
    (step === "stay" && !stayReady) ||
    (step === "guest" && submittedGuest && !guestReady) ||
    (step === "payment" && isProcessing);

  return (
    <div
      className="stay-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stay-modal-title"
      onClick={onClose}
    >
      <div className="stay-modal" onClick={(event) => event.stopPropagation()}>
        <header className="stay-modal-header">
          <h2 id="stay-modal-title">{currentTitle}</h2>
          <button type="button" className="stay-modal-close" onClick={onClose} aria-label="Cerrar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <div className="stay-modal-body">
          {step === "stay" && (
            <>
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
                      sub="18+"
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
                    <button
                      type="button"
                      className="stay-section-done"
                      onClick={() => setOpenSection("coupon")}
                    >
                      Listo
                    </button>
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
                    <button
                      type="button"
                      className="stay-section-done"
                      onClick={() => setOpenSection(null)}
                    >
                      Aplicar
                    </button>
                  </div>
                )}
              </section>
            </>
          )}

          {step === "extras" && (
            <div className="stay-extras">
              <p className="stay-helper">Selecciona los extras que quieras añadir a tu estancia. Puedes saltarte este paso si no necesitas ninguno.</p>
              <div className="stay-extras-list">
                {EXTRAS.map((extra) => {
                  const selected = extras.includes(extra.id);
                  return (
                    <label key={extra.id} className={`stay-extra ${selected ? "is-selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleExtra(extra.id)}
                      />
                      <div className="stay-extra-body">
                        <div className="stay-extra-head">
                          <span className="stay-extra-name">{extra.label}</span>
                          <span className="stay-extra-price">
                            +{formatEur(extra.price)}
                            <span className="stay-extra-unit">
                              {extra.unit === "night" && " / noche"}
                              {extra.unit === "stay" && " / estancia"}
                              {extra.unit === "person-night" && " / persona / noche"}
                            </span>
                          </span>
                        </div>
                        <div className="stay-extra-sub">{extra.sub}</div>
                      </div>
                      <span className="stay-extra-check" aria-hidden="true">
                        {selected && (
                          <svg viewBox="0 0 24 24">
                            <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {step === "guest" && (
            <div className="stay-guest-form">
              <p className="stay-helper">Necesitamos tus datos para confirmar la reserva.</p>
              <div className="stay-form-grid">
                <label className="stay-field">
                  <span>Nombre completo</span>
                  <input
                    type="text"
                    value={guest.name}
                    onChange={(event) => setGuest({ ...guest, name: event.target.value })}
                    placeholder="Ej: María López"
                    autoComplete="name"
                  />
                  {submittedGuest && guest.name.trim().length <= 1 && (
                    <span className="stay-field-error">Indica tu nombre.</span>
                  )}
                </label>
                <label className="stay-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={guest.email}
                    onChange={(event) => setGuest({ ...guest, email: event.target.value })}
                    placeholder="maria@email.com"
                    autoComplete="email"
                  />
                  {submittedGuest && !emailValid(guest.email) && (
                    <span className="stay-field-error">Introduce un email válido.</span>
                  )}
                </label>
                <label className="stay-field">
                  <span>Teléfono</span>
                  <input
                    type="tel"
                    value={guest.phone}
                    onChange={(event) => setGuest({ ...guest, phone: event.target.value })}
                    placeholder="+34 600 000 000"
                    autoComplete="tel"
                  />
                  {submittedGuest && guest.phone.trim().length < 6 && (
                    <span className="stay-field-error">Indica un teléfono de contacto.</span>
                  )}
                </label>
                <label className="stay-field stay-field-full">
                  <span>Peticiones especiales (opcional)</span>
                  <textarea
                    rows={4}
                    value={guest.notes}
                    onChange={(event) => setGuest({ ...guest, notes: event.target.value })}
                    placeholder="Llegada aproximada, preferencia de cama, etc."
                  />
                </label>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="stay-payment">
              <div className="stay-summary">
                <h3>Resumen de tu reserva</h3>
                <ul>
                  <li>
                    <span>Apartamento Edificio México</span>
                    <span>{formatEur(NIGHTLY_PRICE)} / noche</span>
                  </li>
                  <li>
                    <span>{datesSummary ?? "Fechas sin definir"}</span>
                    <span>
                      {nights} noche{nights !== 1 ? "s" : ""}
                    </span>
                  </li>
                  <li>
                    <span>{guestsSummary}</span>
                    <span>—</span>
                  </li>
                  <li>
                    <span>Base ({nights} × {formatEur(NIGHTLY_PRICE)})</span>
                    <span>{formatEur(baseCost)}</span>
                  </li>
                  {extras.length > 0 && (
                    <li>
                      <span>Extras ({extras.length})</span>
                      <span>{formatEur(extrasCost)}</span>
                    </li>
                  )}
                  {couponApplied && (
                    <li className="stay-summary-discount">
                      <span>Cupón {couponSummary} (-10%)</span>
                      <span>-{formatEur(discount)}</span>
                    </li>
                  )}
                  <li className="stay-summary-total">
                    <span>Total</span>
                    <span>{formatEur(total)}</span>
                  </li>
                </ul>
              </div>

              <div className="stay-payment-methods">
                <p className="stay-payment-methods-title">Método de pago</p>
                {(["card", "bizum", "transfer"] as PaymentMethod[]).map((method) => {
                  const labels: Record<PaymentMethod, { name: string; sub: string }> = {
                    card: { name: "Tarjeta", sub: "Visa, Mastercard, Amex" },
                    bizum: { name: "Bizum", sub: "Pago instantáneo desde móvil" },
                    transfer: { name: "Transferencia", sub: "Recibirás los datos por email" },
                  };
                  return (
                    <label
                      key={method}
                      className={`stay-payment-method ${paymentMethod === method ? "is-selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                      />
                      <div>
                        <div className="stay-payment-name">{labels[method].name}</div>
                        <div className="stay-payment-sub">{labels[method].sub}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="stay-done">
              <div className="stay-done-check" aria-hidden="true">
                <svg viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="30" stroke="#198754" strokeWidth="2" fill="none" />
                  <path d="M20 33l8 8 16-18" stroke="#198754" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>Reserva confirmada</h3>
              <p>
                Hemos enviado los detalles a <strong>{guest.email}</strong>. Te esperamos en Edificio
                México del <strong>{datesSummary ?? "—"}</strong>.
              </p>
              <div className="stay-summary stay-summary-compact">
                <ul>
                  <li>
                    <span>Total cobrado</span>
                    <span>{formatEur(total)}</span>
                  </li>
                  <li>
                    <span>Método</span>
                    <span>
                      {paymentMethod === "card" && "Tarjeta"}
                      {paymentMethod === "bizum" && "Bizum"}
                      {paymentMethod === "transfer" && "Transferencia"}
                    </span>
                  </li>
                  <li>
                    <span>Huéspedes</span>
                    <span>{guestsSummary}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <footer className="stay-modal-footer">
          {step === "done" ? (
            <button type="button" className="stay-submit" onClick={onClose}>
              Cerrar
            </button>
          ) : (
            <>
              {step !== "stay" ? (
                <button type="button" className="stay-back" onClick={goBack} disabled={isProcessing}>
                  Volver
                </button>
              ) : (
                <span />
              )}
              {nights > 0 && step !== "stay" && (
                <span className="stay-footer-total" aria-live="polite">
                  Total <strong>{formatEur(total)}</strong>
                </span>
              )}
              <button
                type="button"
                className="stay-submit"
                onClick={goNext}
                disabled={continueDisabled}
              >
                {continueLabel}
              </button>
            </>
          )}
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
