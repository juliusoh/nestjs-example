import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import type { Movie } from '../movies/movies.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites() {
    return { favorites: this.favoritesService.getAllFavorites() };
  }

  @Post()
  async addFavorite(@Body() movie: Movie) {
    await this.favoritesService.addFavorite(movie);
    return { success: true };
  }

  @Delete(':imdbID')
  async removeFavorite(@Param('imdbID') imdbID: string) {
    const removed = await this.favoritesService.removeFavorite(imdbID);
    return { success: removed };
  }
}
