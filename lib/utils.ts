import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

/**
 * Merges Tailwind CSS classes and removes any conflicting styles.
 * @param {...ClassValue[]} inputs - A list of class names to be merged.
 * @returns {string} The merged and resolved class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
