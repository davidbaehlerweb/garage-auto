import { useEffect, useRef, useState } from "react";

export default function Carousel({
  slides = [],
  interval = 4000,
  aspect = "16/9",
  className = "",
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchDiff = useRef(0);

  useEffect(() => {
    start();
    return stop;
  }, [index, interval, slides.length]);

  const start = () => {
    stop();
    if (slides.length > 1) {
      timerRef.current = setTimeout(
        () => setIndex((i) => (i + 1) % slides.length),
        interval
      );
    }
  };
  const stop = () => timerRef.current && clearTimeout(timerRef.current);

  const goTo = (i) => setIndex((i + slides.length) % slides.length);
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDiff.current = 0;
    stop();
  };
  const onTouchMove = (e) => {
    touchDiff.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (touchDiff.current > 60) prev();
    else if (touchDiff.current < -60) next();
    start();
  };

  if (!slides.length) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      onMouseEnter={stop}
      onMouseLeave={start}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      <div className="w-full" style={{ aspectRatio: aspect }}>
        <div
          className="h-full w-full flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div key={i} className="relative shrink-0 w-full h-full">
              <img
                src={s.src}
                alt={s.alt || `slide ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
                draggable="false"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-black/50 via-black/20 to-transparent text-white">
                {s.caption && (
                  <p className="max-w-3xl text-sm md:text-base font-medium drop-shadow">
                    {s.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Précédent"
            className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/70 hover:bg-white shadow"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Suivant"
            className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/70 hover:bg-white shadow"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Aller au slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2.5 bg-white/60 hover:bg-white"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
