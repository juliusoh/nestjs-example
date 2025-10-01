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
  addFavorite(@Body() movie: Movie) {
    this.favoritesService.addFavorite(movie);
    return { success: true };
  }

  @Delete(':imdbID')
  removeFavorite(@Param('imdbID') imdbID: string) {
    const removed = this.favoritesService.removeFavorite(imdbID);
    return { success: removed };
  }
}
