import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface EditPlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; description: string; isPrivate: boolean }) => void;
    isLoading?: boolean;
    playlist: {
        id: string;
        playlist_name: string;
        playlist_description?: string;
        playlist_is_private: boolean;
    } | null;
}

export const EditPlaylistModal = ({ isOpen, onClose, onSave, isLoading, playlist }: EditPlaylistModalProps) => {
    const [name, setName] = useState(playlist?.playlist_name || '');
    const [description, setDescription] = useState(playlist?.playlist_description || '');
    const [isPrivate, setIsPrivate] = useState(playlist?.playlist_is_private || false);

    // Reset form when playlist changes
    useState(() => {
        if (playlist) {
            setName(playlist.playlist_name || '');
            setDescription(playlist.playlist_description || '');
            setIsPrivate(playlist.playlist_is_private || false);
        }
    });

    if (!isOpen || !playlist) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, description, isPrivate });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-white">
                        Edit <span className="text-metro-cyan">Playlist</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Playlist Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full bg-black border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:border-metro-cyan focus:outline-none transition-colors"
                            placeholder="My Playlist"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full bg-black border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:border-metro-cyan focus:outline-none transition-colors resize-none"
                            placeholder="Describe your playlist..."
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsPrivate(!isPrivate)}
                            className={`w-12 h-6 rounded-full transition-colors ${isPrivate ? 'bg-metro-cyan' : 'bg-gray-700'
                                }`}
                        >
                            <div
                                className={`w-5 h-5 mx-0.5 rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                        <span className="text-sm text-gray-400">Private Playlist</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-700 py-3 text-sm font-bold uppercase tracking-widest text-gray-400 hover:border-gray-600 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || isLoading}
                            className="flex-1 bg-metro-cyan py-3 text-sm font-bold uppercase tracking-widest text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
