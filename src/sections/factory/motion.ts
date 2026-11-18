// ----------------------------------------------------------------------
// variants กลางของ module factory — ใช้คู่กับ `m.*` (LazyMotion strict)
// ----------------------------------------------------------------------

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const stagger = (delayChildren = 0.08, staggerChildren = 0.06) => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

/** เนื้อหาลอยขึ้น + คลาย blur (ใช้กับ card แทบทุกใบ) */
export const riseIn = {
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

export const popIn = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 26 } },
};

export const slideLeft = {
  hidden: { opacity: 0, x: 32, filter: 'blur(8px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE } },
};

/** เส้น SVG ที่ค่อย ๆ ถูกวาด — ใช้กับ `m.path` */
export const drawPath = (delay = 0, duration = 1.2) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay, duration, ease: EASE }, opacity: { delay, duration: 0.2 } },
  },
});
