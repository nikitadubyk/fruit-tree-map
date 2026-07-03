'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Autocomplete } from '@react-google-maps/api';
import { Dispatch, SetStateAction, useRef, useState, useCallback } from 'react';
import {
  AvatarIcon,
  PersonIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';
import {
  Button,
  TextField,
  DropdownMenu,
  SegmentedControl,
} from '@radix-ui/themes';

import { ROUTES } from '@/config';
import { UserRole } from '@/types';
import { useUserStore } from '@/store';

type SearchMode = 'city' | 'tree';

interface HeaderProps {
  search: string;
  setSearch: (value: string) => void;
  setMapCenter: Dispatch<SetStateAction<{ lat: number; lng: number }>>;
}

export const Header = ({ search, setSearch, setMapCenter }: HeaderProps) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const logOut = useUserStore((state) => state.logOut);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [mode, setMode] = useState<SearchMode>('city');

  const isAdmin = user?.role === UserRole.Admin;

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

  const onModeChange = useCallback(
    (value: string) => {
      const next = value as SearchMode;
      setMode(next);
      if (next === 'city') setSearch('');
    },
    [setSearch]
  );

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between gap-4">
      <div className="flex flex-1 gap-2 sm:max-w-md flex-col">
        {mode === 'city' ? (
          <Autocomplete
            onLoad={onLoadAutocomplete}
            onPlaceChanged={onPlaceChanged}
          >
            <TextField.Root
              size="3"
              className="w-full bg-white"
              placeholder="Поиск города, улицы, дома"
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height={16} width={16} />
              </TextField.Slot>
            </TextField.Root>
          </Autocomplete>
        ) : (
          <div>
            <TextField.Root
              size="3"
              autoFocus
              value={search}
              className="w-full bg-white"
              placeholder="Поиск по названию дерева"
              onChange={(e) => setSearch(e.target.value)}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height={16} width={16} />
              </TextField.Slot>
            </TextField.Root>
          </div>
        )}

        <SegmentedControl.Root
          size="2"
          value={mode}
          onValueChange={onModeChange}
          className="w-fit bg-white shadow-sm"
        >
          <SegmentedControl.Item value="city">Город</SegmentedControl.Item>
          <SegmentedControl.Item value="tree">Дерево</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>

      <div className="flex flex-shrink-0 gap-4">
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
              {isAdmin && (
                <DropdownMenu.Item asChild>
                  <Link href={ROUTES.APPROVE.HOME}>Деревья на проверке</Link>
                </DropdownMenu.Item>
              )}
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
