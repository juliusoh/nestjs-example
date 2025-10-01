'use client';

import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, Movie } from '@/lib/api';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching } = useInfiniteQuery({
    queryKey: ['movies', debouncedQuery],
    queryFn: ({ pageParam = 1 }) => api.searchMovies(debouncedQuery, pageParam),
    enabled: debouncedQuery.length > 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: api.getFavorites
  });

  const addFavoriteMutation = useMutation({
    mutationFn: api.addFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: api.removeFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediately trigger search on button click
    setDebouncedQuery(searchQuery);
  };

  const isFavorite = (imdbID: string) => {
    return favorites.some((fav) => fav.imdbID === imdbID);
  };

  const toggleFavorite = (movie: Movie) => {
    if (isFavorite(movie.imdbID)) {
      removeFavoriteMutation.mutate(movie.imdbID);
    } else {
      addFavoriteMutation.mutate(movie);
    }
  };

  // Flatten all movies from all pages
  const movies = data?.pages.flatMap((page) => page.movies) || [];
  const totalResults = data?.pages[0]?.totalResults || 0;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Search Movies</h1>

      <form onSubmit={handleSearch} className='mb-8'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search for movies...'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            type='submit'
            className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
            disabled={isFetching}
          >
            {isFetching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {isLoading && <p className='text-gray-500 mb-4'>Loading...</p>}

      {debouncedQuery && totalResults > 0 && (
        <p className='text-gray-600 mb-4'>
          Found {totalResults} result{totalResults !== 1 ? 's' : ''}
        </p>
      )}

      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {movies.map((movie) => (
          <div key={movie.imdbID} className='border rounded-lg p-4 shadow-sm'>
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
              alt={movie.Title}
              className='w-full h-64 object-cover rounded mb-3'
            />
            <h3 className='font-semibold text-lg mb-1'>{movie.Title}</h3>
            <p className='text-gray-600 mb-3'>{movie.Year}</p>
            <button
              onClick={() => toggleFavorite(movie)}
              className={`w-full py-2 rounded ${
                isFavorite(movie.imdbID) ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isFavorite(movie.imdbID) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        ))}
      </div>

      {debouncedQuery && movies.length === 0 && !isLoading && <p className='text-gray-500 text-center mt-8'>No movies found</p>}

      {/* Infinite scroll trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className='flex justify-center mt-8 py-4'>
          <div className='text-gray-500'>{isFetchingNextPage ? 'Loading more movies...' : 'Scroll for more'}</div>
        </div>
      )}
    </div>
  );
}
