const FAVORITES_KEY = 'favorites';

export const getFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
};

export const toggleFavorite = (productId: string): string[] => {
  const favorites = getFavorites();
  const updated = favorites.includes(productId)
    ? favorites.filter((id) => id !== productId)
    : [...favorites, productId];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
};
