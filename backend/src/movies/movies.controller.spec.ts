import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            searchMovies: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should return movies from service', async () => {
      const mockMovies = [
        {
          imdbID: 'tt0468569',
          Title: 'The Dark Knight',
          Year: '2008',
          Poster: 'https://example.com/poster.jpg',
        },
      ];

      jest.spyOn(service, 'searchMovies').mockResolvedValue(mockMovies);

      const result = await controller.searchMovies('batman');

      expect(result).toEqual({ movies: mockMovies });
      expect(service.searchMovies).toHaveBeenCalledWith('batman');
    });

    it('should return empty array when query is empty', async () => {
      const result = await controller.searchMovies('');

      expect(result).toEqual({ movies: [] });
      expect(service.searchMovies).not.toHaveBeenCalled();
    });
  });
});
