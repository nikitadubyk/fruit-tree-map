'use client';

import { Button, TextField } from '@radix-ui/themes';
import { Autocomplete } from '@react-google-maps/api';
import Link from 'next/link';
import { Dispatch, SetStateAction, useRef, useCallback } from 'react';

interface HeaderProps {
  setMapCenter: Dispatch<SetStateAction<{ lat: number; lng: number }>>;
}

export const Header = ({ setMapCenter }: HeaderProps) => {
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoadAutocomplete = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      autoCompleteRef.current = autocomplete;
    },
    []
  );

  const onPlaceChanged = useCallback(() => {
    const place = autoCompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMapCenter({ lat, lng });
    }
  }, [setMapCenter]);

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center gap-4">
      <div className="flex-1 max-w-md">
        <Autocomplete
          onLoad={onLoadAutocomplete}
          onPlaceChanged={onPlaceChanged}
        >
          <TextField.Root
            size="3"
            className="bg-white w-full"
            placeholder="Поиск города"
          />
        </Autocomplete>
      </div>

      <div className="flex gap-4 flex-shrink-0">
        <Button size="3">
          <Link href="/login">Войти</Link>
        </Button>
      </div>
    </div>
  );
};
