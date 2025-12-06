import { Variants, Transition } from 'framer-motion';

// Enhanced easing functions - More refined
export const smoothEase: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 18,
  mass: 0.8
};

export const gentleEase: Transition = {
  type: 'spring',
  stiffness: 60,
  damping: 22,
  mass: 1
};

export const snappyEase: Transition = {
  type: 'spring',
  stiffness: 250,
  damping: 25,
  mass: 0.4
};

export const fluidEase: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
  mass: 1.2
};

export const elegantEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
export const smoothEaseCurve: [number, number, number, number] = [0.4, 0, 0.2, 1];

// Base animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { ...smoothEase, duration: 0.8 }
  }
};

export const slideUp: Variants = {
  hidden: { 
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...smoothEase, duration: 0.8 }
  }
};

export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0,
    x: -60,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { ...smoothEase, duration: 0.8 }
  }
};

export const slideInRight: Variants = {
  hidden: { 
    opacity: 0,
    x: 60,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { ...smoothEase, duration: 0.8 }
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    rotate: -5
  },
  visible: { 
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { ...gentleEase, duration: 0.6 }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// Enhanced hover effects
export const hoverLift = {
  scale: 1.08,
  y: -8,
  rotate: 1,
  transition: { ...snappyEase, duration: 0.3 }
};

export const hoverGlow = {
  boxShadow: '0 20px 40px rgba(244, 63, 94, 0.3)',
  transition: { duration: 0.3 }
};

export const hoverScale = {
  scale: 1.05,
  transition: { ...snappyEase, duration: 0.2 }
};

// Parallax and scroll animations
export const parallaxVariants: Variants = {
  offscreen: {
    y: 80,
    opacity: 0,
    scale: 0.9
  },
  onscreen: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      ...gentleEase,
      duration: 1,
      opacity: { duration: 0.8 }
    }
  }
};

export const fadeInOnScroll: Variants = {
  offscreen: {
    opacity: 0,
    y: 40
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Page transition variants
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.96
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: elegantEase,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.96,
    transition: {
      duration: 0.5,
      ease: elegantEase
    }
  }
};

export const messageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 80,
    scale: 0.9,
    filter: 'blur(10px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      ...fluidEase,
      duration: 1,
      ease: elegantEase
    }
  },
  exit: {
    opacity: 0,
    y: -80,
    scale: 0.9,
    filter: 'blur(10px)',
    transition: {
      duration: 0.6,
      ease: elegantEase
    }
  }
};

// Magnetic effect for interactive elements
export const magneticVariants = {
  rest: { x: 0, y: 0 },
  hover: {
    x: 0,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
};

// Ripple effect
export const rippleVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0.6
  },
  animate: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

// Text reveal animation
export const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Stagger text reveal
export const staggerText: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
};
