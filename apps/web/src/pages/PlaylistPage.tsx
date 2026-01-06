import { Play, Clock, MoreHorizontal, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { playlistApi, type Playlist } from '../lib/api-client';
import { useDispatch } from 'react-redux';
import { setCurrentSong } from '../store/slices/songSlice';

const PlaylistPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPlaylist = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const res = await playlistApi.getById(id);
                setPlaylist(res.data.data.playlist);
            } catch (err) {
                console.error(err);
                setError("Failed to load playlist.");
            } finally {
                setLoading(false);
            }
        };
        loadPlaylist();
    }, [id]);

    const handlePlaySong = (song: any) => {
        dispatch(setCurrentSong(song));
    };

    if (loading) return <div className="text-white p-8">Loading playlist...</div>;
    if (error || !playlist) return <div className="text-red-500 p-8">Error: {error || "Playlist not found"}</div>;

    const songs = playlist.Songs || [];

    return (
        <div className="animate-slide-up">
            {/* Playlist Header */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Cover Image */}
                <div className="w-64 h-64 bg-gray-800 shadow-2xl relative group">
                    <img
                        src={playlist.playlist_cover_url || "https://via.placeholder.com/300?text=Playlist"}
                        alt={playlist.playlist_name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={48} className="text-white" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-end text-white">
                    <span className="text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2">Playlist</span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">{playlist.playlist_name}</h1>
                    <p className="text-gray-400 mb-6 max-w-lg">{playlist.playlist_description || "No description."}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="font-bold text-white">Owner</span>
                        <span>•</span>
                        <span>{songs.length} songs</span>
                        <span>•</span>
                        <span>2 hr 15 min</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-6">
                        <button className="w-14 h-14 bg-metro-lime rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg shadow-metro-lime/20">
                            <Play size={24} fill="currentColor" className="ml-1" />
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <Heart size={32} />
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors">
                            <MoreHorizontal size={32} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Song Table */}
            <div className="bg-black/20 text-gray-300">
                {/* Table Header */}
                <div className="grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-3 border-b border-gray-800 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <div>#</div>
                    <div>Title</div>
                    <div>Album</div>
                    <div>Date Added</div>
                    <div className="text-right"><Clock size={16} className="inline" /></div>
                </div>

                {/* Table Body */}
                <div className="mt-2">
                    {songs.map((song: any, index: number) => (
                        <div
                            key={song.id}
                            className="group grid grid-cols-[16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-3 hover:bg-white/5 rounded-md transition-colors items-center cursor-pointer"
                            onClick={() => handlePlaySong(song)}
                        >
                            <div className="text-gray-500 group-hover:text-white group-hover:hidden">{index + 1}</div>
                            <div className="hidden group-hover:block text-white"><Play size={12} fill="white" /></div>

                            <div className="flex items-center gap-3">
                                <img src={song.coverUrl || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 object-cover rounded" />
                                <div>
                                    <div className="text-white font-medium group-hover:text-metro-cyan transition-colors">{song.title}</div>
                                    <div className="text-xs text-gray-500">Unknown Artist</div>
                                </div>
                            </div>

                            <div className="text-sm">Unknown Album</div>
                            <div className="text-sm">Today</div>
                            <div className="text-sm text-right font-mono">3:45</div>
                        </div>
                    ))}

                    {songs.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            This playlist is empty.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaylistPage;
