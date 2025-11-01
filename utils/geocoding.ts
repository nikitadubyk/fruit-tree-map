export const getAddressFromCoordinates = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const geocoder = new google.maps.Geocoder();
    const result = await geocoder.geocode({
      language: 'ru',
      location: { lat, lng },
    });

    if (result.results[0]) {
      return result.results[0].formatted_address;
    }
    return 'Адрес не найден';
  } catch (error) {
    console.error('Ошибка при получении адреса:', error);
    return 'Не удалось определить адрес';
  }
};
