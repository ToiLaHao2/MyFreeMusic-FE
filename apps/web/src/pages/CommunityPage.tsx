import { useState } from 'react';
import { MetroTile } from '../components/MetroTile';
import { Users, Globe, Share2, Play, Heart } from 'lucide-react';

interface SharedPlaylist {
    id: string;
    title: string;
    owner: string;
    songs: number;
    color: 'cyan' | 'magenta' | 'lime' | 'orange' | 'blue' | 'purple' | 'teal';
    likes: number;
}

const INITIAL_PLAYLISTS: SharedPlaylist[] = [
    { id: '101', title: 'Top Hits 2024', owner: 'Alice Cooper', songs: 45, color: 'cyan', likes: 128 },
    { id: '102', title: 'Chill Vibes', owner: 'Bob Marley', songs: 120, color: 'lime', likes: 256 },
    { id: '103', title: 'Gym Motivation', owner: 'The Rock', songs: 32, color: 'magenta', likes: 89 },
    { id: '104', title: 'Coding Focus', owner: 'Dev Guru', songs: 15, color: 'blue', likes: 412 },
    { id: '105', title: 'Sunset Drive', owner: 'Driver', songs: 28, color: 'orange', likes: 67 },
    { id: '106', title: 'Lo-Fi Beats', owner: 'ChillHop', songs: 50, color: 'purple', likes: 321 },
    { id: '107', title: 'Morning Coffee', owner: 'Barista', songs: 18, color: 'teal', likes: 45 },
];

const CommunityPage = () => {
    const [playlists, setPlaylists] = useState(INITIAL_PLAYLISTS);
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

    const handleLike = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPlaylists(prev => prev.map(p =>
            p.id === id
                ? { ...p, likes: likedIds.has(id) ? p.likes - 1 : p.likes + 1 }
                : p
        ));
        setLikedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {playlists.map((playlist) => {
                    const isLiked = likedIds.has(playlist.id);
                    const colorClass = `bg-metro-${playlist.color}`;

                    return (
                        <div
                            key={playlist.id}
                            className="group relative h-48 cursor-pointer overflow-hidden bg-gray-900 border border-gray-800 transition-all hover:border-gray-700"
                        >
                            {/* Color Accent */}
                            <div className={`absolute top-0 left-0 right-0 h-1 ${colorClass}`} />

                            <div className="relative z-10 flex h-full flex-col justify-between p-6">
                                <div className="flex justify-between items-start">
                                    <Users size={24} className="text-gray-600" />
                                    <div className="flex items-center gap-3">
                                        {/* Like Button */}
                                        <button
                                            onClick={(e) => handleLike(playlist.id, e)}
                                            className={`flex items-center gap-1 px-2 py-1 transition-all ${isLiked
                                                    ? 'text-metro-magenta bg-metro-magenta/10'
                                                    : 'text-gray-500 hover:text-metro-magenta hover:bg-gray-800'
                                                }`}
                                        >
                                            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                                            <span className="text-xs font-bold">{playlist.likes}</span>
                                        </button>
                                        <Share2 size={18} className="text-gray-600 hover:text-white transition-colors" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold uppercase tracking-wide text-white group-hover:text-metro-cyan transition-colors">
                                        {playlist.title}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                        <span>by {playlist.owner}</span>
                                        <span>•</span>
                                        <span>{playlist.songs} songs</span>
                                    </div>
                                </div>
                            </div>

                            {/* Play Overlay */}
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 opacity-0 transition-all duration-200 group-hover:opacity-100">
                                <div className={`${colorClass} p-4 text-white transform scale-75 transition-transform group-hover:scale-100`}>
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
                    onClick={() => alert("Sharing feature coming soon!")}
                />
            </div>
        </div>
    );
};

export default CommunityPage;
