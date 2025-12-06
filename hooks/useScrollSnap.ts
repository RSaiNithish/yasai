import { useEffect, useRef, useState } from 'react';

export function useScrollSnap(totalSections: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToSection = (index: number) => {
    if (containerRef.current && index >= 0 && index < totalSections) {
      setIsScrolling(true);
      const section = containerRef.current.children[index] as HTMLElement;
      section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setCurrentSection(index);
      
      setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  };

  const nextSection = () => {
    if (currentSection < totalSections - 1) {
      scrollToSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      scrollToSection(currentSection - 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling) return;

      const scrollPosition = container.scrollTop;
      const containerHeight = container.clientHeight;
      const currentIndex = Math.round(scrollPosition / containerHeight);
      
      if (currentIndex !== currentSection && currentIndex >= 0 && currentIndex < totalSections) {
        setCurrentSection(currentIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentSection, isScrolling, totalSections]);

  return {
    containerRef,
    currentSection,
    scrollToSection,
    nextSection,
    prevSection,
  };
}
