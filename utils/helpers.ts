/**
 * Filters out fields with empty values (null, undefined, '') from an object.
 * Optionally skips certain keys from being filtered.
 *
 * @template T The type of the input object.
 * @param {T} obj The object to filter.
 * @param {(keyof T)[]} [skipKeys=[]] An optional array of keys to exclude from filtering.
 * @returns {Partial<T>} A new object containing only the fields with non-empty values,
 * or including skipped keys regardless of their value.
 */
export const filterEmptyFields = <T extends Record<string, any>>(
  obj: T,
  skipKeys: (keyof T)[] = []
): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => skipKeys.includes(key as keyof T) || Boolean(value)
    )
  ) as Partial<T>;

export const addParamsToUrl = (
  url: string,
  params?: Record<string, any>
): string => {
  if (!params) {
    return url;
  }
  const urlParams = new URLSearchParams();
  Object.keys(filterEmptyFields(params)).forEach((key) =>
    urlParams.append(key, params[key])
  );
  return `${url}?${urlParams.toString()}`;
};
