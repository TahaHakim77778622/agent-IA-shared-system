"use client";

import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérifier au chargement initial
    checkIsMobile();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkIsMobile);

    // Nettoyer l'écouteur
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkIsTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };

    // Vérifier au chargement initial
    checkIsTablet();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkIsTablet);

    // Nettoyer l'écouteur
    return () => window.removeEventListener('resize', checkIsTablet);
  }, []);

  return isTablet;
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Vérifier au chargement initial
    checkIsDesktop();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkIsDesktop);

    // Nettoyer l'écouteur
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  return isDesktop;
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width >= 768 && width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // Vérifier au chargement initial
    checkBreakpoint();

    // Écouter les changements de taille d'écran
    window.addEventListener('resize', checkBreakpoint);

    // Nettoyer l'écouteur
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return breakpoint;
} 