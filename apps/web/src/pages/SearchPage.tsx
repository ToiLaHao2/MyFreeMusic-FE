import { Search } from 'lucide-react';
import { useState } from 'react';
import { MOCK_SONGS } from '../mocks/songs';
import { MetroTile } from '../components/MetroTile';

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

const SearchPage = () => {
    const [query, setQuery] = useState('');

    const filteredSongs = query
        ? MOCK_SONGS.filter(song =>
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase())
        )
        : [];

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
                </div>
            </div>

            {/* Search Results */}
            {query && (
                <div className="space-y-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-metro-magenta">
                        {filteredSongs.length} Results for "{query}"
                    </h3>
                    {filteredSongs.length > 0 ? (
                        <div className="space-y-1">
                            {filteredSongs.map((song, index) => (
                                <div
                                    key={song.id}
                                    className="group flex items-center justify-between bg-gray-900 hover:bg-gray-800 p-4 cursor-pointer transition-colors border-l-4 border-transparent hover:border-metro-magenta"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="w-8 text-center text-gray-600 font-mono">{index + 1}</span>
                                        <img src={song.coverUrl} alt={song.title} className="h-12 w-12 object-cover" />
                                        <div>
                                            <h4 className="font-semibold text-white group-hover:text-metro-magenta transition-colors">{song.title}</h4>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">{song.artist}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-mono text-gray-500">
                                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Search size={48} className="mx-auto text-gray-700 mb-4" />
                            <p className="text-gray-500">No songs found for "{query}"</p>
                        </div>
                    )}
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
