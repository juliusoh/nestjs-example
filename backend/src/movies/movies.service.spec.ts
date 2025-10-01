import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should return movies when API call succeeds', async () => {
      const mockResponse = {
        data: {
          Response: 'True',
          Search: [
            {
              imdbID: 'tt0468569',
              Title: 'The Dark Knight',
              Year: '2008',
              Poster: 'https://example.com/poster.jpg',
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.searchMovies('batman');

      expect(result).toEqual(mockResponse.data.Search);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://www.omdbapi.com/',
        expect.objectContaining({
          params: expect.objectContaining({
            s: 'batman',
          }),
        }),
      );
    });

    it('should return empty array when no movies found', async () => {
      const mockResponse = {
        data: {
          Response: 'False',
          Error: 'Movie not found!',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await service.searchMovies('nonexistentmovie123');

      expect(result).toEqual([]);
    });

    it('should throw HttpException when API key is invalid', async () => {
      const mockResponse = {
        data: {
          Response: 'False',
          Error: 'Invalid API key!',
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      await expect(service.searchMovies('batman')).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw HttpException when network error occurs', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(service.searchMovies('batman')).rejects.toThrow(
        HttpException,
      );
    });
  });
});
