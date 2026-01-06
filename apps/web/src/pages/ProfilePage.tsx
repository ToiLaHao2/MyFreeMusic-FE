import { useState } from 'react';
import { User, Mail, Save, Camera } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const ProfilePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    // Mock local state for form
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        profilePicture: user?.profilePicture || '',
        bio: 'Just a music lover hanging out in the Metro.',
        theme: 'Dark'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API update
        console.log("Saving user profile:", formData);
        // Mock success feedback
        alert(`Profile updated for ${formData.fullName}! (Mock)\nTheme: ${formData.theme}`);
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
                    <div className="relative group h-48 w-48 bg-gray-800 shadow-2xl overflow-hidden">
                        {formData.profilePicture ? (
                            <img src={formData.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-metro-magenta">
                                <User size={64} className="text-white" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                            <Camera size={32} className="text-white" />
                        </div>
                    </div>
                    <p className="text-xs text-center text-gray-500 uppercase tracking-widest">Profile Picture</p>
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
                                    <Mail size={14} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border-l-4 border-gray-700 p-4 text-white focus:border-metro-cyan focus:outline-none transition-colors"
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
                                className="flex items-center gap-2 bg-metro-blue px-8 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-blue-700 transition-colors"
                            >
                                <Save size={18} />
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
