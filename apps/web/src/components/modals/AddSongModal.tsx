import { useState, useCallback, useEffect } from 'react';
import { X, Search, Plus, Check, Loader2, Music } from 'lucide-react';
import { songApi, playlistApi, type Song } from '../../lib/api-client';

interface AddSongModalProps {
    isOpen: boolean;
    onClose: () => void;
    playlistId: string;
    onSongAdded: () => void; // Callback to refresh parent
}

// Simple debounce hook (copied from SearchPage to avoid circular deps or verify utility availability)
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

export const AddSongModal = ({ isOpen, onClose, playlistId, onSongAdded }: AddSongModalProps) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [addingIds, setAddingIds] = useState<Set<string>>(new Set());
    const debouncedQuery = useDebounce(query, 300);

    const searchSongs = useCallback(async (q: string) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await songApi.search(q);
            setResults(res.data.data.songs || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        searchSongs(debouncedQuery);
    }, [debouncedQuery, searchSongs]);

    const handleAdd = async (songId: string) => {
        setAddingIds(prev => new Set(prev).add(songId));
        try {
            await playlistApi.addSong(playlistId, songId);
            onSongAdded();
            // Optional: Dismiss modal or keep open?
            // Keeping open allows adding multiple songs
        } catch (err) {
            console.error('Failed to add song:', err);
            alert('Failed to add song to playlist');
            setAddingIds(prev => {
                const next = new Set(prev);
                next.delete(songId);
                return next;
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-xl font-light uppercase tracking-wider text-white">
                        Add <span className="font-bold text-metro-cyan">Songs</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Search Body */}
                <div className="p-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search songs..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-gray-800 border-l-4 border-gray-700 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-metro-cyan focus:outline-none transition-colors"
                            autoFocus
                        />
                    </div>

                    <div className="h-96 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="animate-spin text-metro-cyan" size={32} />
                            </div>
                        ) : results.length > 0 ? (
                            results.map((song) => {
                                const isAdded = addingIds.has(song.id);
                                return (
                                    <div key={song.id} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-md group">
                                        <img
                                            src={song.coverUrl || "https://via.placeholder.com/48?text=Song"}
                                            alt={song.title}
                                            className="w-12 h-12 object-cover rounded shadow-md"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-medium truncate">{song.title}</h4>
                                            <p className="text-xs text-gray-500">Unknown Artist</p>
                                        </div>
                                        <button
                                            onClick={() => !isAdded && handleAdd(song.id)}
                                            disabled={isAdded}
                                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isAdded
                                                    ? 'bg-metro-lime text-black cursor-default'
                                                    : 'bg-gray-800 text-white hover:bg-metro-cyan hover:text-white'
                                                }`}
                                        >
                                            {isAdded ? <Check size={20} /> : <Plus size={20} />}
                                        </button>
                                    </div>
                                );
                            })
                        ) : query ? (
                            <div className="text-center py-12 text-gray-500">
                                <Music size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No songs found for "{query}"</p>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Search size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Type to search for songs</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
