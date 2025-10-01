import { Injectable, OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import type { Movie } from '../movies/movies.service';

@Injectable()
export class FavoritesService implements OnModuleInit {
  private favorites: Map<string, Movie> = new Map();
  private readonly dataFilePath = join(process.cwd(), 'data', 'favorites.json');

  async onModuleInit() {
    await this.loadFavorites();
  }

  private async loadFavorites(): Promise<void> {
    try {
      const data = await fs.readFile(this.dataFilePath, 'utf-8');
      const favorites: Movie[] = JSON.parse(data);
      this.favorites = new Map(favorites.map((movie) => [movie.imdbID, movie]));
      console.log(`Loaded ${this.favorites.size} favorites from disk`);
    } catch (error) {
      // File doesn't exist yet or is corrupted, start fresh
      console.log('No existing favorites found, starting fresh');
      await this.ensureDataDirectory();
    }
  }

  private async saveFavorites(): Promise<void> {
    try {
      await this.ensureDataDirectory();
      const favorites = Array.from(this.favorites.values());
      await fs.writeFile(
        this.dataFilePath,
        JSON.stringify(favorites, null, 2),
        'utf-8',
      );
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }

  private async ensureDataDirectory(): Promise<void> {
    const dataDir = join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }

  async addFavorite(movie: Movie): Promise<void> {
    this.favorites.set(movie.imdbID, movie);
    await this.saveFavorites();
  }

  async removeFavorite(imdbID: string): Promise<boolean> {
    const removed = this.favorites.delete(imdbID);
    if (removed) {
      await this.saveFavorites();
    }
    return removed;
  }

  getAllFavorites(): Movie[] {
    return Array.from(this.favorites.values());
  }

  isFavorite(imdbID: string): boolean {
    return this.favorites.has(imdbID);
  }
}
