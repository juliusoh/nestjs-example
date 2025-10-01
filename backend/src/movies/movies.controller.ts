import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async searchMovies(
    @Query('q') query: string,
    @Query('page') page?: string,
  ) {
    if (!query) {
      return { movies: [], totalResults: 0, page: 1, totalPages: 0 };
    }
    const pageNumber = page ? parseInt(page, 10) : 1;
    return await this.moviesService.searchMovies(query, pageNumber);
  }
}
