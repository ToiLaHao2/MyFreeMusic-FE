import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface EditPlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; description: string; isPrivate: boolean }) => void;
    isLoading?: boolean;
    playlist: {
        playlist_cover_url?: string | null;
        id: string;
        playlist_name: string;
        playlist_description?: string;
        playlist_is_private: boolean;
    } | null;
}

export const EditPlaylistModal = ({ isOpen, onClose, onSave, isLoading, playlist }: EditPlaylistModalProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    // Customization
    const [activeTab, setActiveTab] = useState<'details' | 'customization'>('details');
    const [color, setColor] = useState('blue'); // Default theme color
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Metro Colors for selection
    const THEME_COLORS = ['cyan', 'magenta', 'lime', 'orange', 'blue', 'purple', 'teal', 'red', 'green'];

    // Reset form when playlist changes
    useEffect(() => {
        if (playlist) {
            setName(playlist.playlist_name || '');
            setDescription(playlist.playlist_description || '');
            setIsPrivate(playlist.playlist_is_private || false);
            setPreviewUrl(playlist.playlist_cover_url || null);

            // Extract color from cover_url if it's a color code (custom logic)
            // For now just default or random
            setCoverFile(null);
            setActiveTab('details');
        }
    }, [playlist, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Construct data
        // If file present -> FormData
        // If no file, but color selected -> maybe send color as special coverUrl? 
        // For now, let's just pass raw data to parent, parent handles logic or we handle it here?
        // The prop expects 'data: {name, description...}' which implies JSON
        // but we updated api-client to handle FormData.
        // We should change the onSave signature or handle FormData creation here.

        // Let's pass a specialized object or FormData back to parent
        // However, to keep it simple and consistent with `EditPlaylistModalProps`, 
        // let's change onSave to accept `any`.

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('isPrivate', String(isPrivate));

        if (coverFile) {
            formData.append('cover', coverFile);
        } else if (!previewUrl) {
            // Logic: if user wants a "Color" theme, maybe we send it as a special flag or string
            // For this implementation, let's assume 'color' is stored in description or separate field/metadata?
            // Backend schema doesn't have 'color'.
            // Workaround: We can store `color:${color}` in cover_url if it's not a link?
            // Or just rely on client to hash the name for color if no cover exists.

            // If user explicitly chose a color but no image, we might want to tell backend to clear cover or set a color code.
            // Let's stick to: Image Upload OR Default (Auto-gen).
            // If we want to force a color, we can implement that later or assume auto-gen is enough.
        }

        onSave(formData as any);
    };

    if (!isOpen || !playlist) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-gray-900 border border-gray-800 animate-slide-up shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
                    <h2 className="text-lg font-bold uppercase tracking-widest text-white">
                        Edit <span className="text-metro-cyan uppercase">Playlist</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'details' ? 'bg-white/10 text-white border-b-2 border-metro-cyan' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Details
                    </button>
                    <button
                        onClick={() => setActiveTab('customization')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'customization' ? 'bg-white/10 text-white border-b-2 border-metro-cyan' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        Customization
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {activeTab === 'details' ? (
                        <>
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
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full bg-black border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:border-metro-cyan focus:outline-none transition-colors resize-none"
                                    placeholder="Describe your playlist..."
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-black/20 p-4 border border-gray-800 rounded">
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
                                <div>
                                    <span className="block text-sm text-white font-bold">Private Playlist</span>
                                    <span className="text-xs text-gray-500">Only you can view this playlist</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            {/* Cover Image Upload */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                    Cover Image
                                </label>
                                <div className="flex items-center gap-6">
                                    <div className="w-32 h-32 bg-gray-800 shrink-0 border border-gray-700 flex items-center justify-center overflow-hidden relative group">
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-gray-600 text-xs text-center px-2">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            id="cover-upload"
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="cover-upload"
                                            className="inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white text-sm font-bold uppercase tracking-wider cursor-pointer transition-colors"
                                        >
                                            Upload Image
                                        </label>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Recommended: Square JPG/PNG, max 5MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Theme Color Selection (Visual Only for now / Placeholder for future) */}
                            {/* 
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                    Auto-Gen Theme Base
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {THEME_COLORS.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setColor(c)}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                            style={{ backgroundColor: `var(--metro-${c}, ${c})` }} // Simplified, would need actual map
                                        />
                                    ))}
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    Used for auto-generated covers if no image is uploaded.
                                </p>
                            </div> 
                            */}
                        </div>
                    )}



                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-800">
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
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
