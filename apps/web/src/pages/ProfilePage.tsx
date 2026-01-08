import { useState, useRef } from 'react';
import { User, Mail, Save, Camera, Loader2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { authApi } from '../lib/api-client';
import type { RootState } from '../store';
import { setCredentials } from '../store/slices/authSlice';

const ProfilePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        profilePicture: user?.avatar || '',
        bio: user?.bio || 'Just a music lover hanging out in the Metro.',
        theme: user?.theme || 'Dark'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('bio', formData.bio);
            data.append('theme', formData.theme);
            // Email update might not be supported yet or needs verification
            // data.append('email', formData.email); 

            if (selectedFile) {
                data.append('avatar', selectedFile);
            }

            const res = await authApi.updateProfile(data);

            if (res.data.success) {
                // Update Redux state with new user info
                // We need to keep tokens, just update user
                dispatch(setCredentials({
                    user: {
                        id: res.data.data.user.id,
                        name: res.data.data.user.name,
                        email: res.data.data.user.email,
                        role: res.data.data.user.role,
                        avatar: res.data.data.user.avatar,
                        bio: res.data.data.user.bio,
                        theme: res.data.data.user.theme
                    }
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
                                    rows={4}
                                    className="w-full bg-gray-900 border-l-4 border-gray-700 p-4 text-white focus:border-metro-cyan focus:outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2">
                                    Theme Preference
                                </label>
                                <select
                                    name="theme"
                                    value={formData.theme}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border-l-4 border-gray-700 p-4 text-white focus:border-metro-cyan focus:outline-none transition-colors"
                                >
                                    <option>Dark</option>
                                    <option>Light (Coming Soon)</option>
                                    <option>High Contrast</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-4">
                            <button type="button" className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-metro-blue px-8 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default ProfilePage;
