import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { MetroTile } from '../components/MetroTile';
import { Users, Globe, Share2, Play, Heart, Loader2 } from 'lucide-react';
import { playlistApi } from '../lib/api-client';
import { playPlaylist } from '../store/slices/songSlice';

interface CommunityPlaylist {
    id: string;
    playlist_name: string;
    playlist_cover_url?: string;
    playlist_description?: string;
    User?: {
        user_full_name: string;
    };
    Songs?: any[];
    likes?: number;
    color?: string; // UI only
}

const COLORS = ['cyan', 'magenta', 'lime', 'orange', 'blue', 'purple', 'teal'];

const CommunityPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [playlists, setPlaylists] = useState<CommunityPlaylist[]>([]);
    const [loading, setLoading] = useState(true);
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                setLoading(true);
                const res = await playlistApi.getCommunity();
                const data = res.data.data.playlists || [];

                // Add random colors for UI (keep this as UI only feature)
                const coloredData = data.map((p: any, index: number) => ({
                    ...p,
                    color: COLORS[index % COLORS.length],
                    likes: p.likes || 0 // Real likes from API
                }));

                setPlaylists(coloredData);

                // Set initial liked Set
                const likedSet = new Set<string>();
                data.forEach((p: any) => {
                    if (p.isLiked) likedSet.add(p.id);
                });
                setLikedIds(likedSet);
            } catch (error) {
                console.error("Failed to fetch community playlists", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCommunity();
    }, []);

    const handleLike = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();

        // Optimistic update
        const isLikedNow = likedIds.has(id);
        setLikedIds(prev => {
            const newSet = new Set(prev);
            if (isLikedNow) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });

        setPlaylists(prev => prev.map(p =>
            p.id === id
                ? { ...p, likes: (p.likes || 0) + (isLikedNow ? -1 : 1) }
                : p
        ));

        try {
            await playlistApi.toggleLike(id);
        } catch (error) {
            console.error("Failed to toggle like", error);
            // Revert on failure
            setLikedIds(prev => {
                const newSet = new Set(prev);
                if (isLikedNow) newSet.add(id);
                else newSet.delete(id);
                return newSet;
            });
            setPlaylists(prev => prev.map(p =>
                p.id === id
                    ? { ...p, likes: (p.likes || 0) + (isLikedNow ? 1 : -1) }
                    : p
            ));
        }
    };

    const handlePlay = (e: React.MouseEvent, playlist: CommunityPlaylist) => {
        e.stopPropagation();
        // Assuming playlist.Songs is populated. If not, we might need to fetch it first?
        // The type definition says Songs?: any[], so it might be there.
        // If it's empty, we might need to fetch details. But let's assume valid data for now or check length.
        if (playlist.Songs && playlist.Songs.length > 0) {
            dispatch(playPlaylist({
                songs: playlist.Songs,
                startIndex: 0
            }));
        } else {
            // If no songs, maybe just navigate
            navigate(`/playlist/${playlist.id}`);
        }
    };

    return (
        <div className="animate-slide-up">
            <div className="mb-8 flex items-end justify-between border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-4xl font-light uppercase tracking-wider text-white">
                        Discovery <span className="font-bold text-metro-cyan">Zone</span>
                    </h1>
                    <p className="text-gray-400">Explore and like playlists from the community</p>
                </div>
                <Globe className="text-metro-cyan opacity-20" size={64} />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-metro-cyan" size={48} />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {playlists.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500 uppercase tracking-widest border border-dashed border-gray-800 bg-gray-900/50">
                            No public playlists found. Be the first to share yours!
                        </div>
                    )}

                    {playlists.map((playlist) => {
                        const isLiked = likedIds.has(playlist.id);
                        const colorClass = `bg-metro-${playlist.color || 'cyan'}`;

                        return (
                            <div
                                key={playlist.id}
                                onClick={() => navigate(`/playlist/${playlist.id}`)}
                                className="group relative h-48 cursor-pointer overflow-hidden bg-gray-900 border border-gray-800 transition-all hover:border-gray-700"
                            >
                                {/* Background: Image or Color Accent */}
                                {playlist.playlist_cover_url ? (
                                    <>
                                        <div className="absolute inset-0">
                                            <img
                                                src={playlist.playlist_cover_url}
                                                alt={playlist.playlist_name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
                                        </div>
                                        {/* Top accent line even with image */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 ${colorClass}`} />
                                    </>
                                ) : (
                                    <div className={`absolute top-0 left-0 right-0 h-1 ${colorClass}`} />
                                )}

                                <div className="relative z-10 flex h-full flex-col justify-between p-6">
                                    <div className="flex justify-between items-start">
                                        <Users size={24} className="text-gray-600" />
                                        <div className="flex items-center gap-3">
                                            {/* Like Button */}
                                            <button
                                                onClick={(e) => handleLike(playlist.id, e)}
                                                className={`flex items-center gap-1 px-2 py-1 transition-all rounded-full bg-black/30 backdrop-blur-sm ${isLiked
                                                    ? 'text-metro-magenta bg-metro-magenta/20'
                                                    : 'text-gray-400 hover:text-metro-magenta hover:bg-gray-800'
                                                    }`}
                                            >
                                                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                                                <span className="text-xs font-bold">{playlist.likes}</span>
                                            </button>
                                            <div className="rounded-full bg-black/30 backdrop-blur-sm p-1.5">
                                                <Share2 size={16} className="text-gray-400 hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold uppercase tracking-wide text-white group-hover:text-metro-cyan transition-colors truncate drop-shadow-lg">
                                            {playlist.playlist_name}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400 font-medium">
                                            <span>by {playlist.User?.user_full_name || 'Unknown'}</span>
                                            <span>•</span>
                                            <span>{playlist.Songs?.length || 0} songs</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Play Overlay */}
                                <div
                                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-200 group-hover:opacity-100"
                                    onClick={(e) => handlePlay(e, playlist)}
                                >
                                    <div className={`${colorClass} p-4 text-white transform scale-75 transition-transform group-hover:scale-100 shadow-2xl`}>
                                        <Play size={28} fill="currentColor" className="ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Share Your Playlist Tile */}
                    <MetroTile
                        title="Share Yours"
                        icon={<Share2 size={32} />}
                        color="purple"
                        className="h-48 flex items-center justify-center"
                        onClick={() => alert("To share: Go to your Playlist -> Edit -> Uncheck 'Private'")}
                    />
                </div>
            )}
        </div>
    );
};

export default CommunityPage;
