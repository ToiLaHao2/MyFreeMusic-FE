import { Search, Loader2, X, ArrowLeft } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { MetroTile } from '../components/MetroTile';
import { songApi, type Song, type Genre } from '../lib/api-client';
import { useDispatch } from 'react-redux';
import { setCurrentSong } from '../store/slices/songSlice';

// Helper to assign random Metro colors to genres
const METRO_COLORS = ['cyan', 'magenta', 'lime', 'orange', 'blue', 'purple', 'teal', 'red', 'green', 'pink'];
const getRandomColor = (index: number) => {
    return METRO_COLORS[index % METRO_COLORS.length] as 'cyan' | 'magenta' | 'lime' | 'orange' | 'blue' | 'purple' | 'teal';
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
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const debouncedQuery = useDebounce(query, 300);

    // Initial load: Fetch Genres
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await songApi.getGenres();
                setGenres(res.data.data.genres || []);
            } catch (err) {
                console.error("Failed to load genres", err);
            }
        };
        fetchGenres();
    }, []);

    // Search or Filter Logic
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (debouncedQuery.trim()) {
                    // Search mode
                    const res = await songApi.search(debouncedQuery);
                    setSearchResults(res.data.data.songs || []);
                } else if (selectedGenre) {
                    // Genre filter mode
                    const res = await songApi.getSongsByGenre(selectedGenre.id);
                    setSearchResults(res.data.data.songs || []);
                } else {
                    // Clear results if nothing selected
                    setSearchResults([]);
                }
            } catch (err: any) {
                console.error("Search/Filter failed", err);
                setError("Failed to load songs");
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };

        if (debouncedQuery.trim() || selectedGenre) {
            fetchData();
        } else {
            setSearchResults([]);
        }
    }, [debouncedQuery, selectedGenre]);

    // Clear genre when typing search
    useEffect(() => {
        if (query.trim() && selectedGenre) {
            setSelectedGenre(null);
        }
    }, [query]);

    const handlePlaySong = (song: Song) => {
        dispatch(setCurrentSong(song));
    };

    const handleGenreClick = (genre: Genre) => {
        setQuery(''); // Clear search query
        setSelectedGenre(genre);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="animate-slide-up pb-20">
            {/* Header */}
            <div className="mb-8 border-b border-gray-800 pb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-light uppercase tracking-wider text-white">
                        {selectedGenre ? (
                            <>
                                Genre <span className="font-bold text-metro-cyan">{selectedGenre.name}</span>
                            </>
                        ) : (
                            <>
                                Search <span className="font-bold text-metro-magenta">Music</span>
                            </>
                        )}
                    </h1>
                </div>
                {selectedGenre && (
                    <button
                        onClick={() => setSelectedGenre(null)}
                        className="text-gray-400 hover:text-white flex items-center gap-1 text-sm uppercase font-bold tracking-widest"
                    >
                        <ArrowLeft size={16} /> Back to Genres
                    </button>
                )}
            </div>

            {/* Search Input - Only show if not selected genre (or allow filtering within genre?) */}
            {/* For now, simplified: Search OR Browse Genre */}
            {!selectedGenre && (
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
                        {query && (
                            <button
                                onClick={() => setQuery('')}
                                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        )}
                        {loading && (
                            <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-metro-magenta animate-spin" />
                        )}
                    </div>
                </div>
            )}

            {/* Results Section */}
            {(query || selectedGenre) ? (
                <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-metro-magenta">
                        {loading ? 'Loading...' : `${searchResults.length} Results`}
                    </h3>

                    {error && (
                        <div className="text-red-400 text-sm py-4">Error: {error}</div>
                    )}

                    {!loading && searchResults.length > 0 ? (
                        <div className="space-y-1">
                            {searchResults.map((song, index) => (
                                <div
                                    key={song.id}
                                    onClick={() => handlePlaySong(song)}
                                    className="group flex items-center justify-between bg-gray-900 hover:bg-gray-800 p-4 cursor-pointer transition-colors border-l-4 border-transparent hover:border-metro-cyan"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 text-center text-gray-600 font-mono">{index + 1}</span>
                                        <img
                                            src={song.coverUrl || 'https://via.placeholder.com/48?text=♪'}
                                            alt={song.title}
                                            className="h-12 w-12 object-cover"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-white group-hover:text-metro-cyan transition-colors">
                                                {song.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                                                {song.artist_names || (song as any).artist?.name || "Unknown Artist"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-mono text-gray-500">
                                        {formatDuration(song.duration_seconds || 0)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : !loading && (
                        <div className="text-center py-12">
                            <Search size={48} className="mx-auto text-gray-700 mb-4" />
                            <p className="text-gray-500">No songs found.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Genre Grid - Only show when no search */
                <div>
                    <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-500">
                        Browse by Genre
                    </h3>
                    {genres.length === 0 ? (
                        <div className="text-gray-500 italic">No genres available.</div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
                            {genres.map((genre, index) => (
                                <div key={genre.id} onClick={() => handleGenreClick(genre)}>
                                    <MetroTile
                                        title={genre.name}
                                        count={genre.description || 'Explore'}
                                        color={getRandomColor(index)}
                                        size="small"
                                        className="aspect-square cursor-pointer hover:scale-105 transition-transform"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;

