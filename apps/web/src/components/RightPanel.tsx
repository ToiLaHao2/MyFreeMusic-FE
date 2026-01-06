import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, ListMusic, ChevronLeft, ChevronRight, Music } from 'lucide-react';

const RightPanel = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(35);
    const [isLiked, setIsLiked] = useState(false);

    const currentPlaylist = {
        name: "My Favorite Hits",
        author: "Admin User",
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop",
        songCount: 24
    };

    const nowPlaying = {
        title: "Blinding Lights",
        artist: "The Weeknd",
        cover: "https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png",
        duration: "3:20",
        currentTime: "1:15"
    };

    // Collapsed state - thin vertical bar with mini controls
    if (isCollapsed) {
        return (
            <aside className="hidden xl:flex w-16 flex-col bg-black border-l border-gray-900 transition-all duration-300">
                {/* Expand Button at top */}
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-4 text-gray-500 hover:text-metro-cyan hover:bg-gray-900 transition-all border-b border-gray-800"
                    title="Expand Player"
                >
                    <ChevronLeft size={20} className="mx-auto" />
                </button>

                {/* Mini Album Art */}
                <div className="p-2">
                    <div className="relative group cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                        <img
                            src={nowPlaying.cover}
                            alt=""
                            className="w-full aspect-square object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                        </div>
                    </div>
                </div>

                {/* Vertical Progress Bar */}
                <div className="flex-1 flex justify-center py-4">
                    <div className="w-1 bg-gray-800 relative rounded-full">
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-metro-cyan rounded-full transition-all"
                            style={{ height: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Mini Controls */}
                <div className="flex flex-col items-center gap-3 pb-4 border-t border-gray-800 pt-4">
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`${isLiked ? 'text-metro-magenta' : 'text-gray-600'} hover:text-metro-magenta transition-colors`}
                    >
                        <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                    <button className="text-gray-600 hover:text-white transition-colors">
                        <Music size={18} />
                    </button>
                </div>
            </aside>
        );
    }

    // Expanded state - full player
    return (
        <aside className="hidden xl:flex w-80 flex-col bg-black border-l border-gray-900 transition-all duration-300">
            {/* Collapse Button */}
            <button
                onClick={() => setIsCollapsed(true)}
                className="p-3 text-gray-500 hover:text-metro-cyan hover:bg-gray-900 transition-all border-b border-gray-800 flex items-center justify-center gap-2"
                title="Collapse Player"
            >
                <ChevronRight size={18} />
                <span className="text-xs uppercase tracking-widest">Collapse</span>
            </button>

            {/* Current Playlist Section */}
            <div className="flex-1 p-6 border-b border-gray-900 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                    <ListMusic size={14} className="text-metro-cyan" />
                    <span className="text-xs font-bold uppercase tracking-widest text-metro-cyan">
                        Current Playlist
                    </span>
                </div>

                <div className="relative aspect-square mb-4 overflow-hidden group">
                    <img
                        src={currentPlaylist.cover}
                        alt={currentPlaylist.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                            {currentPlaylist.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {currentPlaylist.songCount} Songs • by {currentPlaylist.author}
                        </p>
                    </div>
                </div>
            </div>

            {/* Now Playing Section */}
            <div className="p-6 bg-gray-950">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-metro-lime rounded-full animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-metro-lime">
                        Now Playing
                    </span>
                </div>

                {/* Song Info */}
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src={nowPlaying.cover}
                        alt={nowPlaying.title}
                        className="w-16 h-16 object-cover shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white truncate">{nowPlaying.title}</h4>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{nowPlaying.artist}</p>
                    </div>
                    <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`${isLiked ? 'text-metro-magenta' : 'text-gray-600'} hover:text-metro-magenta transition-colors`}
                    >
                        <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="h-1 bg-gray-800 relative">
                        <div
                            className="absolute inset-y-0 left-0 bg-metro-cyan transition-all"
                            style={{ width: `${progress}%` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                    <div className="flex justify-between text-xs font-mono text-gray-600 mt-2">
                        <span>{nowPlaying.currentTime}</span>
                        <span>{nowPlaying.duration}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                    <button className="text-gray-500 hover:text-white transition-colors">
                        <SkipBack size={24} />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 bg-metro-cyan flex items-center justify-center text-white hover:brightness-110 transition-all"
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>

                    <button className="text-gray-500 hover:text-white transition-colors">
                        <SkipForward size={24} />
                    </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3 mt-6">
                    <Volume2 size={16} className="text-gray-600" />
                    <div className="flex-1 h-1 bg-gray-800 relative">
                        <div className="absolute inset-y-0 left-0 bg-gray-600 w-3/4" />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightPanel;
