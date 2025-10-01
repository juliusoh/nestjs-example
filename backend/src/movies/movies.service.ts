import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

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

@Injectable()
export class MoviesService {
  private readonly OMDB_API_KEY = process.env.OMDB_API_KEY || 'YOUR_API_KEY_HERE';
  private readonly OMDB_BASE_URL = 'http://www.omdbapi.com/';

  async searchMovies(query: string, page: number = 1): Promise<SearchMoviesResponse> {
    try {
      const response = await axios.get(this.OMDB_BASE_URL, {
        params: {
          apikey: this.OMDB_API_KEY,
          s: query,
          page: page,
        },
      });

      if (response.data.Response === 'False') {
        // Log the specific error from OMDb API
        console.error('OMDb API Error:', response.data.Error);

        // If it's an API key error, throw a more specific message
        if (response.data.Error?.includes('Invalid API key')) {
          throw new HttpException(
            'Invalid OMDb API key. Please check your .env file and get a valid key from https://www.omdbapi.com/apikey.aspx',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        return {
          movies: [],
          totalResults: 0,
          page: page,
          totalPages: 0,
        };
      }

      const totalResults = parseInt(response.data.totalResults) || 0;
      const totalPages = Math.ceil(totalResults / 10); // OMDb returns 10 results per page

      return {
        movies: response.data.Search || [],
        totalResults,
        page,
        totalPages,
      };
    } catch (error) {
      // If it's already an HttpException, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }

      // Otherwise, throw a generic error
      console.error('Error fetching from OMDb:', error.message);
      throw new HttpException(
        'Failed to fetch movies from OMDb',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
