import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, ListMusic, ChevronLeft, ChevronRight, Music, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import Hls from 'hls.js';
import type { RootState, AppDispatch } from '../store';
import { togglePlay, setPlaying, nextSong, prevSong, toggleLike, setCurrentSong } from '../store/slices/songSlice';

const RightPanel = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { currentSong, isPlaying, likedSongIds, queue, currentIndex } = useSelector((state: RootState) => state.songs);
    const { user } = useSelector((state: RootState) => state.auth);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const isLiked = currentSong ? likedSongIds.includes(currentSong.id) : false;

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    // Initialize Audio & HLS
    useEffect(() => {
        if (!currentSong) return;

        // Clean up previous HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
        }

        const audio = audioRef.current;
        if (!audio) return;

        // Construct Stream URL
        // In local dev, streaming service is at localhost:4000
        const streamUrl = `http://localhost:4000/hls/${currentSong.slug}/index.m3u8`;
        console.log("Stream URL:", streamUrl);

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (isPlaying) {
                    audio.play().catch(e => console.error("Play error:", e));
                }
            });
            hlsRef.current = hls;
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari support
            audio.src = streamUrl;
            if (isPlaying) {
                audio.play();
            }
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
        };
    }, [currentSong?.id]); // Re-run when song changes

    // Handle Play/Pause State
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(e => console.error("Play error", e));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Handle Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Time Update Handler
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
            const progressPercent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(progressPercent || 0);
        }
    };

    const handleEnded = () => {
        dispatch(nextSong());
        setProgress(0);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = Number(e.target.value);
        if (audioRef.current) {
            const newTime = (newProgress / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(newProgress);
        }
    };

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handlePlayPause = () => {
        dispatch(togglePlay());
    };

    if (!currentSong) {
        // Empty State or Placeholder
        if (isCollapsed) {
            return (
                <aside className="hidden xl:flex w-16 flex-col bg-black border-l border-gray-900 transition-all duration-300">
                    <button onClick={() => setIsCollapsed(false)} className="p-4 text-gray-500 hover:text-metro-cyan">
                        <ChevronLeft size={20} className="mx-auto" />
                    </button>
                    <div className="flex-1 flex items-center justify-center">
                        <Music className="text-gray-800" />
                    </div>
                </aside>
            );
        }
        return (
            <aside className="hidden xl:flex w-80 flex-col bg-black border-l border-gray-900 transition-all duration-300 justify-center items-center text-gray-500">
                <button className="absolute top-0 left-0 p-3" onClick={() => setIsCollapsed(true)}>
                    <ChevronRight size={18} />
                </button>
                <Music size={48} className="mb-4 opacity-50" />
                <p className="text-sm uppercase tracking-widest">No song playing</p>
            </aside>
        );
    }

    // Collapsed state
    if (isCollapsed) {
        return (
            <aside className="hidden xl:flex w-16 flex-col bg-black border-l border-gray-900 transition-all duration-300">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="p-4 text-gray-500 hover:text-metro-cyan hover:bg-gray-900 transition-all border-b border-gray-800"
                >
                    <ChevronLeft size={20} className="mx-auto" />
                </button>

                <div className="p-2">
                    <div className="relative group cursor-pointer" onClick={handlePlayPause}>
                        <img
                            src={currentSong.coverUrl || "https://via.placeholder.com/300"}
                            alt=""
                            className="w-full aspect-square object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex justify-center py-4">
                    <div className="w-1 bg-gray-800 relative rounded-full">
                        <div
                            className="absolute bottom-0 left-0 right-0 bg-metro-cyan rounded-full transition-all"
                            style={{ height: `${progress}%` }}
                        />
                    </div>
                </div>
            </aside>
        );
    }

    // Expanded state
    return (
        <aside className="hidden xl:flex w-80 flex-col bg-black border-l border-gray-900 transition-all duration-300">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            />

            <button
                onClick={() => setIsCollapsed(true)}
                className="p-3 text-gray-500 hover:text-metro-cyan hover:bg-gray-900 transition-all border-b border-gray-800 flex items-center justify-center gap-2"
            >
                <ChevronRight size={18} />
                <span className="text-xs uppercase tracking-widest">Collapse</span>
            </button>

            {/* Current Playlist Section (Mock data for now) */}
            <div className="flex-1 p-6 border-b border-gray-900 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                    <ListMusic size={14} className="text-metro-cyan" />
                    <span className="text-xs font-bold uppercase tracking-widest text-metro-cyan">
                        Queue
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {queue.length > 0 ? (
                        <div className="space-y-1 p-2">
                            {queue.map((song, index) => {
                                const isCurrent = index === currentIndex;
                                return (
                                    <div
                                        key={`${song.id}-${index}`}
                                        className={`flex items-center gap-3 p-2 rounded cursor-pointer group hover:bg-white/10 ${isCurrent ? 'bg-white/10' : ''}`}
                                        onClick={() => {
                                            // Dispatch action to jump to this song in queue
                                            // We don't have a direct "jumpToQueueIndex" but we can implement it or just rely on logic
                                            // The simplest way is to reuse playPlaylist with startIndex? No, that resets queue
                                            // We need a jumpToSong or setIndex action
                                            // For now, let's assume we can add a simple 'setCurrentIndex' action or similar?
                                            // Actually, songSlice.ts has setCurrentSong which might handle logic if id matches...
                                            // But standard player usually allows jumping.
                                            // Let's verify songSlice actions. 
                                            // It has 'setCurrentSong' which finds index in queue. Correct.
                                            dispatch(setCurrentSong(song));
                                        }}
                                    >
                                        <div className="relative w-10 h-10 shrink-0">
                                            <img
                                                src={song.coverUrl || "https://via.placeholder.com/40"}
                                                alt={song.title}
                                                className={`w-full h-full object-cover rounded ${isCurrent ? 'opacity-50' : 'group-hover:opacity-50'}`}
                                            />
                                            {(isCurrent && isPlaying) && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-1 h-3 bg-metro-cyan animate-music-bar-1 mx-[1px]" />
                                                    <div className="w-1 h-3 bg-metro-cyan animate-music-bar-2 mx-[1px]" />
                                                    <div className="w-1 h-3 bg-metro-cyan animate-music-bar-3 mx-[1px]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-sm font-medium truncate ${isCurrent ? 'text-metro-cyan' : 'text-gray-300 group-hover:text-white'}`}>
                                                {song.title}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {song.artist_names || song.artist?.name || "Unknown Artist"}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm text-center mt-10 p-4">
                            Queue is empty
                        </div>
                    )}
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
                            src={currentSong.coverUrl || "https://via.placeholder.com/300"}
                            alt={currentSong.title}
                            className="w-16 h-16 object-cover shadow-lg"
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white truncate">{currentSong.title}</h4>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">{currentSong.artist_names || currentSong.artist?.name || "Unknown Artist"}</p>
                        </div>
                        <button
                            onClick={() => currentSong && dispatch(toggleLike(currentSong))}
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
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <div className="flex justify-between text-xs font-mono text-gray-600 mt-2">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={() => dispatch(prevSong())}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <SkipBack size={24} />
                        </button>

                        <button
                            onClick={handlePlayPause}
                            className="w-14 h-14 bg-metro-cyan flex items-center justify-center text-white hover:brightness-110 transition-all"
                        >
                            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                        </button>

                        <button
                            onClick={() => dispatch(nextSong())}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <SkipForward size={24} />
                        </button>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-3 mt-6">
                        <Volume2 size={16} className="text-gray-600" />
                        <div className="flex-1 h-1 bg-gray-800 relative">
                            <div
                                className="absolute inset-y-0 left-0 bg-gray-600"
                                style={{ width: `${volume * 100}%` }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default RightPanel;
