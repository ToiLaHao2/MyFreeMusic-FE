import { Search, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { MetroTile } from '../components/MetroTile';
import { songApi, type Song } from '../lib/api-client';
import { useDispatch } from 'react-redux';
import { setCurrentSong } from '../store/slices/songSlice';

// Metro Genre Colors
const GENRE_COLORS: Record<string, 'cyan' | 'magenta' | 'lime' | 'orange' | 'blue' | 'purple' | 'teal'> = {
    'Pop': 'cyan',
    'Rock': 'orange',
    'Hip-Hop': 'magenta',
    'Indie': 'lime',
    'R&B': 'purple',
    'Electronic': 'blue',
    'Classical': 'teal',
    'Jazz': 'orange',
    'Metal': 'magenta',
    'Blues': 'blue'
};

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

const SearchPage = () => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedQuery = useDebounce(query, 300);

    // Search API call
    const searchSongs = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await songApi.search(searchQuery);
            setSearchResults(response.data.data.songs || []);
        } catch (err: any) {
            console.error('Search error:', err);
            setError(err.response?.data?.message || 'Search failed');
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Effect to trigger search when debounced query changes
    useEffect(() => {
        searchSongs(debouncedQuery);
    }, [debouncedQuery, searchSongs]);

    const handlePlaySong = (song: Song) => {
        dispatch(setCurrentSong(song));
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div className="mb-8 border-b border-gray-800 pb-6">
                <h1 className="text-4xl font-light uppercase tracking-wider text-white">
                    Search <span className="font-bold text-metro-magenta">Music</span>
                </h1>
            </div>

            {/* Search Input - Metro Style */}
            <div className="mb-10">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search songs, artists, albums..."
                        className="w-full bg-gray-900 border-l-4 border-gray-700 py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:border-metro-magenta focus:outline-none transition-colors text-lg"
                        autoFocus
                    />
                    {isLoading && (
                        <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-metro-magenta animate-spin" />
                    )}
                </div>
            </div>

            {/* Search Results */}
            {query && (
                <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-metro-magenta">
                        {isLoading ? 'Searching...' : `${searchResults.length} Results for "${query}"`}
                    </h3>

                    {error && (
                        <div className="text-red-400 text-sm py-4">
                            Error: {error}
                        </div>
                    )}

                    {!isLoading && searchResults.length > 0 ? (
                        <div className="space-y-1">
                            {searchResults.map((song, index) => (
                                <div
                                    key={song.id}
                                    onClick={() => handlePlaySong(song)}
                                    className="group flex items-center justify-between bg-gray-900 hover:bg-gray-800 p-4 cursor-pointer transition-colors border-l-4 border-transparent hover:border-metro-magenta"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 text-center text-gray-600 font-mono">{index + 1}</span>
                                        <img
                                            src={song.coverUrl || 'https://via.placeholder.com/48?text=♪'}
                                            alt={song.title}
                                            className="h-12 w-12 object-cover"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-white group-hover:text-metro-magenta transition-colors">
                                                {song.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                Unknown Artist
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-mono text-gray-500">
                                        {formatDuration(song.duration_seconds || 0)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : !isLoading && query && searchResults.length === 0 ? (
                        <div className="text-center py-12">
                            <Search size={48} className="mx-auto text-gray-700 mb-4" />
                            <p className="text-gray-500">No songs found for "{query}"</p>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Browse Genres - Metro Tiles */}
            {!query && (
                <div>
                    <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                        Browse by Genre
                    </h3>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
                        {Object.entries(GENRE_COLORS).map(([genre, color]) => (
                            <MetroTile
                                key={genre}
                                title={genre}
                                color={color}
                                size="small"
                                className="aspect-square"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;

