import { Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async searchMovies(@Query('q') query: string) {
    if (!query) {
      return { movies: [] };
    }
    const movies = await this.moviesService.searchMovies(query);
    return { movies };
  }
}
