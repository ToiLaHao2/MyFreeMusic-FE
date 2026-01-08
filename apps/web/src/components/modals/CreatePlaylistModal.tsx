import { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: { name: string; description: string; isPrivate: boolean }) => void;
    isLoading?: boolean;
}

export const CreatePlaylistModal = ({ isOpen, onClose, onCreate, isLoading }: CreatePlaylistModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onCreate({ name: name.trim(), description: description.trim(), isPrivate });
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setIsPrivate(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-gray-900 border border-gray-700 shadow-2xl animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-700 bg-black/50 px-6 py-4">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-white">
                        Create <span className="text-metro-cyan">Playlist</span>
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Playlist Name */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Playlist Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome Playlist"
                            className="w-full bg-gray-800 border-l-4 border-gray-600 py-3 px-4 text-white placeholder-gray-500 focus:border-metro-cyan focus:outline-none transition-colors"
                            autoFocus
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your playlist..."
                            rows={3}
                            className="w-full bg-gray-800 border-l-4 border-gray-600 py-3 px-4 text-white placeholder-gray-500 focus:border-metro-cyan focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Private Toggle */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsPrivate(!isPrivate)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${isPrivate ? 'bg-metro-cyan' : 'bg-gray-600'
                                }`}
                        >
                            <span
                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isPrivate ? 'left-7' : 'left-1'
                                    }`}
                            />
                        </button>
                        <span className="text-sm text-gray-300">Private Playlist</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 text-sm font-bold uppercase tracking-widest text-gray-400 border border-gray-600 hover:border-gray-400 hover:text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim() || isLoading}
                            className="flex-1 py-3 text-sm font-bold uppercase tracking-widest text-white bg-metro-cyan hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
