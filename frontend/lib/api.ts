const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export const api = {
  searchMovies: async (query: string): Promise<Movie[]> => {
    const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.movies || [];
  },

  getFavorites: async (): Promise<Movie[]> => {
    const response = await fetch(`${API_BASE_URL}/favorites`);
    const data = await response.json();
    return data.favorites || [];
  },

  addFavorite: async (movie: Movie): Promise<void> => {
    await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie),
    });
  },

  removeFavorite: async (imdbID: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/favorites/${imdbID}`, {
      method: 'DELETE',
    });
  },
};
