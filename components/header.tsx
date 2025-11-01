'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Autocomplete } from '@react-google-maps/api';
import { AvatarIcon, PersonIcon } from '@radix-ui/react-icons';
import { Button, TextField, DropdownMenu } from '@radix-ui/themes';
import { Dispatch, SetStateAction, useRef, useCallback } from 'react';

import { ROUTES } from '@/config';
import { useUserStore } from '@/store';

interface HeaderProps {
  setMapCenter: Dispatch<SetStateAction<{ lat: number; lng: number }>>;
}

export const Header = ({ setMapCenter }: HeaderProps) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const logOut = useUserStore((state) => state.logOut);
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
            placeholder="Поиск города, улицы, дома"
          />
        </Autocomplete>
      </div>

      <div className="flex gap-4 flex-shrink-0">
        {user ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button size="3">
                <AvatarIcon width={24} height={24} />
              </Button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content>
              <DropdownMenu.Item asChild>
                <Link href={ROUTES.PROFILE.HOME}>Профиль</Link>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item onClick={logOut} color="red">
                Выйти
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : (
          <Button size="3" onClick={() => router.push(ROUTES.AUTH.LOGIN)}>
            <PersonIcon />
            Войти
          </Button>
        )}
      </div>
    </div>
  );
};
