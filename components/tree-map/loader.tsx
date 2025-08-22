import { ReloadIcon } from '@radix-ui/react-icons';

export const MapLoader = () => (
  <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-50">
    <div className="mb-4">
      <ReloadIcon className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
    <p className="text-lg text-gray-600">Загрузка карты…</p>
    <p className="text-sm text-gray-500 mt-2">Пожалуйста, подождите</p>
  </div>
);
