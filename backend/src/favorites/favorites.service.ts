import { Injectable } from '@nestjs/common';
import type { Movie } from '../movies/movies.service';

@Injectable()
export class FavoritesService {
  private favorites: Map<string, Movie> = new Map();

  addFavorite(movie: Movie): void {
    this.favorites.set(movie.imdbID, movie);
  }

  removeFavorite(imdbID: string): boolean {
    return this.favorites.delete(imdbID);
  }

  getAllFavorites(): Movie[] {
    return Array.from(this.favorites.values());
  }

  isFavorite(imdbID: string): boolean {
    return this.favorites.has(imdbID);
  }
}
