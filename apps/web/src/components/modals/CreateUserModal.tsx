import { useState } from 'react';
import { X, UserPlus, Shield, Mail, Lock, User } from 'lucide-react';
import { adminApi } from '../../lib/api-client';

interface CreateUserModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateUserModal = ({ onClose, onSuccess }: CreateUserModalProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        user_full_name: '',
        user_email: '',
        user_password: '',
        confirm_password: '',
        role: 'USER'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.user_password !== formData.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        if (formData.user_password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            setLoading(true);
            await adminApi.createUser({
                user_full_name: formData.user_full_name,
                user_email: formData.user_email,
                user_password: formData.user_password,
                role: formData.role
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="bg-gray-900 border border-gray-800 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800">
                    <h2 className="text-xl font-light text-white flex items-center gap-2">
                        <UserPlus size={24} className="text-metro-cyan" />
                        Create New User
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black border border-gray-800 text-white pl-10 pr-4 py-2 focus:border-metro-cyan focus:outline-none transition-colors"
                                    placeholder="Enter full name"
                                    value={formData.user_full_name}
                                    onChange={e => setFormData({ ...formData, user_full_name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-black border border-gray-800 text-white pl-10 pr-4 py-2 focus:border-metro-cyan focus:outline-none transition-colors"
                                    placeholder="Enter email address"
                                    value={formData.user_email}
                                    onChange={e => setFormData({ ...formData, user_email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-black border border-gray-800 text-white pl-10 pr-4 py-2 focus:border-metro-cyan focus:outline-none transition-colors"
                                        placeholder="Min 6 chars"
                                        value={formData.user_password}
                                        onChange={e => setFormData({ ...formData, user_password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Confirm</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-black border border-gray-800 text-white pl-10 pr-4 py-2 focus:border-metro-cyan focus:outline-none transition-colors"
                                        placeholder="Confirm"
                                        value={formData.confirm_password}
                                        onChange={e => setFormData({ ...formData, confirm_password: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-1">Role</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <select
                                    className="w-full bg-black border border-gray-800 text-white pl-10 pr-4 py-2 focus:border-metro-cyan focus:outline-none transition-colors appearance-none"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="USER">USER - Standard Access</option>
                                    <option value="ADMIN">ADMIN - Full Access</option>
                                </select>
                            </div>
                        </div>
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
                            className="flex-1 px-4 py-2 bg-metro-cyan text-white text-xs uppercase tracking-widest hover:bg-cyan-600 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
