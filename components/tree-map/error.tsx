import { AlertDialog, Button } from '@radix-ui/themes';
import { ExclamationTriangleIcon, ReloadIcon } from '@radix-ui/react-icons';

export const MapError = ({ onReload }: { onReload: () => void }) => (
  <div className="flex flex-col items-center justify-center w-full h-screen bg-red-50">
    <div className="text-center mb-6">
      <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-red-700 mb-2">
        Ошибка загрузки карты
      </h2>
      <p className="text-red-600">
        Не удалось загрузить Google Maps. Проверьте подключение к интернету.
      </p>
    </div>

    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="blue">Попробовать снова</Button>
      </AlertDialog.Trigger>

      <AlertDialog.Content>
        <AlertDialog.Title className="text-lg font-semibold text-gray-900 mb-2">
          Перезагрузить страницу?
        </AlertDialog.Title>

        <AlertDialog.Description className="text-gray-600 mb-6">
          Для исправления ошибки загрузки карты рекомендуется перезагрузить
          страницу.
        </AlertDialog.Description>

        <div className="flex justify-end gap-6 mt-4">
          <AlertDialog.Cancel>
            <Button color="gray">Отмена</Button>
          </AlertDialog.Cancel>

          <AlertDialog.Action>
            <Button color="red" onClick={onReload}>
              <ReloadIcon className="w-4 h-4" />
              <span>Перезагрузить</span>
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
);
