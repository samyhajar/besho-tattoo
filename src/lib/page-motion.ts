export const pageMotionTransition = {
  duration: 1.25,
  ease: [0.16, 1, 0.3, 1] as const,
};

export const pageMotionViewport = {
  once: true,
  amount: 0.18,
};

export const fadeUpInViewMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: pageMotionViewport,
  transition: pageMotionTransition,
};

export const fadeLeftInViewMotion = {
  initial: { opacity: 0, x: -24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: pageMotionViewport,
  transition: pageMotionTransition,
};
