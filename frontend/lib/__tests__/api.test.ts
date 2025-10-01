import { api } from '../api';

global.fetch = jest.fn();

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchMovies', () => {
    it('should fetch movies from the API', async () => {
      const mockMovies = [
        {
          imdbID: 'tt0468569',
          Title: 'The Dark Knight',
          Year: '2008',
          Poster: 'https://example.com/poster.jpg',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ movies: mockMovies }),
      });

      const result = await api.searchMovies('batman');

      expect(result).toEqual(mockMovies);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/movies/search?q=batman'
      );
    });

    it('should return empty array when movies is undefined', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({}),
      });

      const result = await api.searchMovies('batman');

      expect(result).toEqual([]);
    });
  });

  describe('getFavorites', () => {
    it('should fetch favorites from the API', async () => {
      const mockFavorites = [
        {
          imdbID: 'tt0468569',
          Title: 'The Dark Knight',
          Year: '2008',
          Poster: 'https://example.com/poster.jpg',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ favorites: mockFavorites }),
      });

      const result = await api.getFavorites();

      expect(result).toEqual(mockFavorites);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/favorites');
    });

    it('should return empty array when favorites is undefined', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({}),
      });

      const result = await api.getFavorites();

      expect(result).toEqual([]);
    });
  });

  describe('addFavorite', () => {
    it('should send POST request to add favorite', async () => {
      const movie = {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster.jpg',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true }),
      });

      await api.addFavorite(movie);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/favorites',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movie),
        }
      );
    });
  });

  describe('removeFavorite', () => {
    it('should send DELETE request to remove favorite', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        json: async () => ({ success: true }),
      });

      await api.removeFavorite('tt0468569');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/favorites/tt0468569',
        {
          method: 'DELETE',
        }
      );
    });
  });
});
