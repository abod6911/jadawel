'use client';

import { useEffect } from 'react';

export const RegisterSW: React.FC = () => {
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return;
    }

    const swUrl = '/jadawel/sw.js';

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(swUrl, { scope: '/jadawel/' })
        .then((registration) => {
          // Check for waiting update
          if (registration.waiting) {
            window.dispatchEvent(
              new CustomEvent('sw-update-available', { detail: registration })
            );
          }

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
              if (
                installingWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New content is available; notify user
                window.dispatchEvent(
                  new CustomEvent('sw-update-available', { detail: registration })
                );
              }
            };
          };
        })
        .catch((error) => {
          console.warn('Service Worker registration skipped or failed:', error);
        });

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  }, []);

  return null;
};
