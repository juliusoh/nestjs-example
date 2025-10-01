'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function FavoritesPage() {
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: api.getFavorites,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: api.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

      {isLoading && <p>Loading...</p>}

      {favorites.length === 0 && !isLoading && (
        <p className="text-gray-500 text-center mt-8">No favorites yet. Start adding some movies!</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((movie) => (
          <div key={movie.imdbID} className="border rounded-lg p-4 shadow-sm">
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
              alt={movie.Title}
              className="w-full h-64 object-cover rounded mb-3"
            />
            <h3 className="font-semibold text-lg mb-1">{movie.Title}</h3>
            <p className="text-gray-600 mb-3">{movie.Year}</p>
            <button
              onClick={() => removeFavoriteMutation.mutate(movie.imdbID)}
              className="w-full py-2 rounded bg-red-500 hover:bg-red-600 text-white"
            >
              Remove from Favorites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
