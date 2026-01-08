import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Search, Filter } from 'lucide-react';
import { type AppDispatch, type RootState } from '../store';
import { fetchSongs, setCurrentSong, fetchLikedSongs, toggleLike } from '../store/slices/songSlice';
import { Heart } from 'lucide-react';

const SongsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { songs, loading, likedSongIds } = useSelector((state: RootState) => state.songs);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'liked'>('all');

    useEffect(() => {
        dispatch(fetchSongs());
        dispatch(fetchLikedSongs());
    }, [dispatch]);

    const handlePlaySong = (song: any) => {
        dispatch(setCurrentSong(song));
    };

    const filteredSongs = songs.filter(song => {
        const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (song.artist_names || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || (filter === 'liked' && likedSongIds.includes(song.id));
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="animate-slide-up pb-20">
            <div className="mb-8">
                <h1 className="text-4xl font-light uppercase tracking-wider text-white mb-2">
                    All <span className="font-bold text-metro-cyan">Songs</span>
                </h1>
                <p className="text-gray-400">Explore your entire music collection</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search songs, artists..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-800 text-white pl-10 pr-4 py-3 focus:outline-none focus:border-metro-cyan transition-colors"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-3 border border-gray-800 uppercase tracking-widest text-sm font-bold transition-colors ${filter === 'all' ? 'bg-metro-cyan text-black border-metro-cyan' : 'text-gray-400 hover:text-white'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('liked')}
                        className={`px-6 py-3 border border-gray-800 uppercase tracking-widest text-sm font-bold transition-colors ${filter === 'liked' ? 'bg-metro-magenta text-white border-metro-magenta' : 'text-gray-400 hover:text-white'}`}
                    >
                        Liked
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-white text-center py-12">Loading songs...</div>
            ) : filteredSongs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-800 text-gray-500">
                    <p className="uppercase tracking-widest">No songs found</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {filteredSongs.map((song) => {
                        const isLiked = likedSongIds.includes(song.id);
                        return (
                            <div
                                key={song.id}
                                className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-800"
                            >
                                <img
                                    src={song.coverUrl || "https://via.placeholder.com/300?text=No+Cover"}
                                    alt={song.title}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-50"
                                />

                                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-100 transition-opacity z-10 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                                    <h3 className="truncate font-bold text-white uppercase tracking-wider text-sm">{song.title}</h3>
                                    <p className="truncate text-xs text-gray-300">{song.artist_names || "Unknown Artist"}</p>
                                </div>

                                {/* Hover Overlay Actions */}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(toggleLike(song));
                                        }}
                                        className={`p-3 rounded-full ${isLiked ? 'bg-metro-magenta text-white' : 'bg-white/10 text-white hover:bg-metro-magenta'} transition-colors shadow-lg backdrop-blur-sm`}
                                        title={isLiked ? "Unlike" : "Like"}
                                    >
                                        <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                                    </button>

                                    <button
                                        onClick={() => handlePlaySong(song)}
                                        className="p-4 rounded-full bg-metro-cyan text-black shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <Play size={24} fill="currentColor" className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SongsPage;
