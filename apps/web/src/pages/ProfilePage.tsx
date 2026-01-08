import { useState, useRef, useEffect } from 'react';
import { User, Mail, Save, Camera, Loader2, Palette, Image as ImageIcon, Droplet } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { authApi, themeApi } from '../lib/api-client';
import type { RootState } from '../store';
import { setCredentials } from '../store/slices/authSlice';
import { useTheme } from '../components/ThemeProvider';

interface Preset {
    name: string;
    accent: string;
    background: string;
}

const ProfilePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const { theme, refreshTheme } = useTheme();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bgFileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isThemeLoading, setIsThemeLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [presets, setPresets] = useState<Preset[]>([]);

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        profilePicture: user?.avatar || '',
        bio: user?.bio || 'Just a music lover hanging out in the Metro.',
    });

    const [themeData, setThemeData] = useState({
        presetTheme: theme?.presetTheme || 'Dark',
        accentColor: theme?.accentColor || '#00ABA9',
        backgroundType: theme?.backgroundType || 'default',
        backgroundColor: theme?.backgroundValue || '#000000',
    });
    const [bgPreview, setBgPreview] = useState<string | null>(null);
    const [bgFile, setBgFile] = useState<File | null>(null);

    useEffect(() => {
        themeApi.getPresets().then(res => setPresets(res.data.data.presets || []));
    }, []);

    useEffect(() => {
        if (theme) {
            setThemeData({
                presetTheme: theme.presetTheme,
                accentColor: theme.accentColor,
                backgroundType: theme.backgroundType,
                backgroundColor: theme.backgroundValue || '#000000',
            });
        }
    }, [theme]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setThemeData(prev => ({ ...prev, [name]: value }));
    };

    const handlePresetClick = (preset: Preset) => {
        setThemeData(prev => ({
            ...prev,
            presetTheme: preset.name,
            accentColor: preset.accent,
            backgroundColor: preset.background,
            backgroundType: 'default',
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBgFile(file);
            setBgPreview(URL.createObjectURL(file));
            setThemeData(prev => ({ ...prev, backgroundType: 'image' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('bio', formData.bio);

            if (selectedFile) {
                data.append('avatar', selectedFile);
            }

            const res = await authApi.updateProfile(data);

            if (res.data.success) {
                dispatch(setCredentials({
                    user: res.data.data.user
                }));
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveTheme = async () => {
        setIsThemeLoading(true);
        try {
            const data = new FormData();
            data.append('presetTheme', themeData.presetTheme);
            data.append('accentColor', themeData.accentColor);
            data.append('backgroundType', themeData.backgroundType);
            if (themeData.backgroundType === 'color') {
                data.append('backgroundColor', themeData.backgroundColor);
            }
            if (bgFile) {
                data.append('background', bgFile);
            }

            await themeApi.update(data);
            await refreshTheme();
            setBgFile(null);
            setBgPreview(null);
            alert('Theme saved!');
        } catch (err) {
            console.error('Failed to save theme:', err);
            alert('Failed to save theme.');
        } finally {
            setIsThemeLoading(false);
        }
    };

    return (
        <div className="animate-slide-up max-w-4xl mx-auto space-y-8">
            <div className="border-b border-gray-800 pb-6 mb-8">
                <h1 className="text-4xl font-light uppercase tracking-wider text-white">
                    Edit <span className="font-bold text-metro-cyan">Profile</span>
                </h1>
                <p className="text-gray-400 mt-2">Customize your personal details and app preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar */}
                <div className="flex flex-col items-center space-y-4">
                    <div
                        className="relative group h-48 w-48 bg-gray-800 shadow-2xl overflow-hidden cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {previewImage || formData.profilePicture ? (
                            <img src={previewImage || formData.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-metro-magenta">
                                <User size={64} className="text-white" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera size={32} className="text-white" />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                    />
                    <p className="text-xs text-center text-gray-500 uppercase tracking-widest">
                        Tap to Change Picture
                    </p>
                </div>

                {/* Right Column: Form */}
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2 flex items-center gap-2">
                                    <User size={14} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border-l-4 border-gray-700 p-4 text-white focus:border-metro-cyan focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2 flex items-center gap-2">
                                    <Mail size={14} /> Email Address (Read Only)
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full bg-gray-800 border-l-4 border-gray-600 p-4 text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2">
                                    Bio
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-gray-900 border-l-4 border-gray-700 p-4 text-white focus:border-metro-cyan focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-metro-blue px-8 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="border-t border-gray-800 pt-8 mt-8">
                <h2 className="text-2xl font-light uppercase tracking-wider text-white mb-6 flex items-center gap-3">
                    <Palette size={24} className="text-metro-cyan" />
                    Appearance
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Presets */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                            Theme Presets
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {presets.map(preset => (
                                <button
                                    key={preset.name}
                                    onClick={() => handlePresetClick(preset)}
                                    className={`p-3 border-2 transition-all ${themeData.presetTheme === preset.name ? 'border-white' : 'border-gray-700 hover:border-gray-500'}`}
                                    style={{ background: preset.background }}
                                >
                                    <div className="h-4 w-full rounded" style={{ background: preset.accent }} />
                                    <span className="text-xs text-white mt-1 block">{preset.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                <Droplet size={14} /> Accent Color
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    name="accentColor"
                                    value={themeData.accentColor}
                                    onChange={handleThemeChange}
                                    className="h-10 w-16 cursor-pointer bg-transparent border-none"
                                />
                                <input
                                    type="text"
                                    name="accentColor"
                                    value={themeData.accentColor}
                                    onChange={handleThemeChange}
                                    className="flex-1 bg-gray-900 border-l-4 border-gray-700 p-3 text-white text-sm font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2">
                                <ImageIcon size={14} /> Background
                            </label>
                            <div className="flex gap-2 mb-3">
                                {(['default', 'color', 'image'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setThemeData(prev => ({ ...prev, backgroundType: type }))}
                                        className={`px-4 py-2 text-xs uppercase font-bold transition-all ${themeData.backgroundType === type ? 'bg-metro-cyan text-black' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {themeData.backgroundType === 'color' && (
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="backgroundColor"
                                        value={themeData.backgroundColor}
                                        onChange={handleThemeChange}
                                        className="h-10 w-16 cursor-pointer bg-transparent border-none"
                                    />
                                    <input
                                        type="text"
                                        name="backgroundColor"
                                        value={themeData.backgroundColor}
                                        onChange={handleThemeChange}
                                        className="flex-1 bg-gray-900 border-l-4 border-gray-700 p-3 text-white text-sm font-mono"
                                    />
                                </div>
                            )}

                            {themeData.backgroundType === 'image' && (
                                <div>
                                    <button
                                        onClick={() => bgFileInputRef.current?.click()}
                                        className="w-full bg-gray-800 border-2 border-dashed border-gray-600 p-4 text-gray-400 hover:border-metro-cyan hover:text-white transition-colors"
                                    >
                                        {bgPreview || theme?.backgroundValue ? 'Change Background Image' : 'Upload Background Image'}
                                    </button>
                                    <input
                                        type="file"
                                        ref={bgFileInputRef}
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleBgFileChange}
                                    />
                                    {(bgPreview || (theme?.backgroundType === 'image' && theme?.backgroundValue)) && (
                                        <img
                                            src={bgPreview || theme?.backgroundValue || ''}
                                            alt="Background Preview"
                                            className="mt-3 h-24 w-full object-cover opacity-75"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSaveTheme}
                        disabled={isThemeLoading}
                        className="flex items-center gap-2 bg-metro-purple px-8 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-purple-600 transition-colors disabled:opacity-50"
                    >
                        {isThemeLoading ? <Loader2 className="animate-spin" size={18} /> : <Palette size={18} />}
                        Save Theme
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
