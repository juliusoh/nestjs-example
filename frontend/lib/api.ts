const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export interface SearchMoviesResponse {
  movies: Movie[];
  totalResults: number;
  page: number;
  totalPages: number;
}

export const api = {
  searchMovies: async (query: string, page: number = 1): Promise<SearchMoviesResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return {
      movies: data.movies || [],
      totalResults: data.totalResults || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 0,
    };
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
