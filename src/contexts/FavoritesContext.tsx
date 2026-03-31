import { useState, type ReactNode } from "react";
import { FavoritesContext } from "./favorites-hooks";

export { useFavorites } from "./favorites-hooks";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const stored = localStorage.getItem("ws-favorites");
    return stored ? new Set(JSON.parse(stored)) : new Set<string>();
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("ws-favorites", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const isFavorite = (id: string) => favorites.has(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
