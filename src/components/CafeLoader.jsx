import { useCallback, useEffect, useRef, useState } from "react";
import { Coffee, ArrowRight, Leaf } from "lucide-react";
import { BRAND } from "../data/config.js";

/**
 * Elegant, short introductory experience.
 * This is a brand reveal—not a representation of actual network progress.
 * No backend, external animation library, or duplicate timers required.
 * Render once at application root (see main.jsx instructions).
 */
export default function CafeLoader({ duration = 1850, onFinished }) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const finishRef = useRef(onFinished);
  finishRef.current = onFinished;
  const endingRef = useRef(false);

  const finish = useCallback(() => {
    if (endingRef.current) return;
    endingRef.current = true;
    setLeaving(true);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const wait = reducedMotion ? 200 : Math.min(Math.max(duration, 450), 3000);
    const id = window.setTimeout(finish, wait);
    return () => window.clearTimeout(id);
  }, [duration, finish]);

  useEffect(() => {
    if (!visible) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = oldOverflow; };
  }, [visible]);

  useEffect(() => {
    if (!leaving) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const id = window.setTimeout(() => {
      setVisible(false);
      finishRef.current?.();
    }, reducedMotion ? 15 : 600);
    return () => window.clearTimeout(id);
  }, [leaving]);

  if (!visible) return null;

  return (
    <div
      className={`yc-boot ${leaving ? "yc-boot--leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Introducing Your Café"
    >
      <div className="yc-boot__grain" aria-hidden="true" />
      <div className="yc-boot__ring yc-boot__ring--outer" aria-hidden="true" />
      <div className="yc-boot__ring yc-boot__ring--inner" aria-hidden="true" />

      <div className="yc-boot__content">
        <div className="yc-boot__seal" aria-hidden="true">
          <div className="yc-boot__steam"><i /><i /><i /></div>
          <Coffee size={57} strokeWidth={1.1} />
        </div>
        <p className="yc-boot__overline"><Leaf size={13} /> AN EVERYDAY RITUAL, REIMAGINED</p>
        <h1>{BRAND.name}</h1>
        <p className="yc-boot__tagline">{BRAND.subtitle}</p>
        <div className="yc-boot__progress" aria-hidden="true"><span /></div>
        <p className="yc-boot__caption">Brewing your experience</p>
      </div>

      <button className="yc-boot__skip" type="button" onClick={finish}>
        Enter café <ArrowRight size={15} />
      </button>
      <span className="yc-boot__corner">A PLACE TO SLOW DOWN · FRONTEND DEMO</span>
    </div>
  );
}
