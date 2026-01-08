import { useState } from 'react';
import { X, Share2, Mail, Users } from 'lucide-react';
import { playlistApi } from '../../lib/api-client';

interface SharePlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    playlistId: string;
    playlistName: string;
}

export const SharePlaylistModal = ({ isOpen, onClose, playlistId, playlistName }: SharePlaylistModalProps) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await playlistApi.share(playlistId, email, 'VIEW');
            alert(`Playlist shared with ${email}`);
            setEmail('');
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to share playlist');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="bg-gray-900 border border-gray-800 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h2 className="text-xl font-light text-white flex items-center gap-2">
                        <Share2 size={24} className="text-metro-cyan" />
                        Share "{playlistName}"
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleShare} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Share with Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="email"
                                required
                                className="w-full bg-black border border-gray-800 text-white pl-10 pr-4 py-2 focus:border-metro-cyan focus:outline-none transition-colors"
                                placeholder="Enter user email..."
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 italic flex items-center gap-2">
                        <Users size={14} />
                        Only registered users can receive shared playlists.
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-800 text-white text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-metro-cyan text-white text-xs uppercase tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Sharing...' : 'Share'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
