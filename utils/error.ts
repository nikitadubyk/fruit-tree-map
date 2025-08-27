import axios from 'axios';

export const handleErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error?.response?.data?.error || error?.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Неизвестная ошибка';
};
