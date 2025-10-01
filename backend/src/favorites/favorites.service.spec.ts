import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritesService],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addFavorite', () => {
    it('should add a movie to favorites', () => {
      const movie = {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster.jpg',
      };

      service.addFavorite(movie);

      expect(service.getAllFavorites()).toContainEqual(movie);
    });

    it('should overwrite existing favorite with same imdbID', () => {
      const movie1 = {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster.jpg',
      };

      const movie2 = {
        imdbID: 'tt0468569',
        Title: 'Updated Title',
        Year: '2008',
        Poster: 'https://example.com/poster2.jpg',
      };

      service.addFavorite(movie1);
      service.addFavorite(movie2);

      const favorites = service.getAllFavorites();
      expect(favorites).toHaveLength(1);
      expect(favorites[0].Title).toBe('Updated Title');
    });
  });

  describe('removeFavorite', () => {
    it('should remove a movie from favorites', () => {
      const movie = {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster.jpg',
      };

      service.addFavorite(movie);
      const removed = service.removeFavorite('tt0468569');

      expect(removed).toBe(true);
      expect(service.getAllFavorites()).toHaveLength(0);
    });

    it('should return false when removing non-existent favorite', () => {
      const removed = service.removeFavorite('nonexistent');

      expect(removed).toBe(false);
    });
  });

  describe('getAllFavorites', () => {
    it('should return empty array when no favorites', () => {
      expect(service.getAllFavorites()).toEqual([]);
    });

    it('should return all favorites', () => {
      const movie1 = {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster.jpg',
      };

      const movie2 = {
        imdbID: 'tt0120815',
        Title: 'Saving Private Ryan',
        Year: '1998',
        Poster: 'https://example.com/poster2.jpg',
      };

      service.addFavorite(movie1);
      service.addFavorite(movie2);

      const favorites = service.getAllFavorites();
      expect(favorites).toHaveLength(2);
      expect(favorites).toContainEqual(movie1);
      expect(favorites).toContainEqual(movie2);
    });
  });

  describe('isFavorite', () => {
    it('should return true for existing favorite', () => {
      const movie = {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster.jpg',
      };

      service.addFavorite(movie);

      expect(service.isFavorite('tt0468569')).toBe(true);
    });

    it('should return false for non-existent favorite', () => {
      expect(service.isFavorite('nonexistent')).toBe(false);
    });
  });
});
