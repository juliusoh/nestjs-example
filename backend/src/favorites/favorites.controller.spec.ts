import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

describe('FavoritesController', () => {
  let controller: FavoritesController;
  let service: FavoritesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritesController],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            getAllFavorites: jest.fn(),
            addFavorite: jest.fn(),
            removeFavorite: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FavoritesController>(FavoritesController);
    service = module.get<FavoritesService>(FavoritesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllFavorites', () => {
    it('should return all favorites', () => {
      const mockFavorites = [
        {
          imdbID: 'tt0468569',
          Title: 'The Dark Knight',
          Year: '2008',
          Poster: 'https://example.com/poster.jpg',
        },
      ];

      jest.spyOn(service, 'getAllFavorites').mockReturnValue(mockFavorites);

      const result = controller.getAllFavorites();

      expect(result).toEqual({ favorites: mockFavorites });
      expect(service.getAllFavorites).toHaveBeenCalled();
    });
  });

  describe('addFavorite', () => {
    it('should add a movie to favorites', () => {
      const movie = {
        imdbID: 'tt0468569',
        Title: 'The Dark Knight',
        Year: '2008',
        Poster: 'https://example.com/poster.jpg',
      };

      const result = controller.addFavorite(movie);

      expect(result).toEqual({ success: true });
      expect(service.addFavorite).toHaveBeenCalledWith(movie);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a movie from favorites', () => {
      jest.spyOn(service, 'removeFavorite').mockReturnValue(true);

      const result = controller.removeFavorite('tt0468569');

      expect(result).toEqual({ success: true });
      expect(service.removeFavorite).toHaveBeenCalledWith('tt0468569');
    });

    it('should return false when movie not found', () => {
      jest.spyOn(service, 'removeFavorite').mockReturnValue(false);

      const result = controller.removeFavorite('nonexistent');

      expect(result).toEqual({ success: false });
      expect(service.removeFavorite).toHaveBeenCalledWith('nonexistent');
    });
  });
});
