import { useEffect } from 'react';

interface UseGeolocation {
  setMapCenter: (values: { lat: number; lng: number }) => void;
}

export const useGeolocation = ({ setMapCenter }: UseGeolocation) => {
  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMapCenter({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      (err) => {
        console.warn('Не удалось получить геолокацию:', err);
      }
    );
  }, [setMapCenter]);
};
