import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (user: any) => void;
}

export const AddUserModal = ({ isOpen, onClose, onAdd }: AddUserModalProps) => {
    const [formData, setFormData] = useState({ fullName: '', email: '', role: 'USER' });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({ ...formData, id: Date.now(), profilePicture: '', status: 'Active' });
        onClose();
        setFormData({ fullName: '', email: '', role: 'USER' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md animate-slide-up border border-gray-700 bg-metro-dark p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-light uppercase tracking-widest text-white">
                        Add <span className="font-bold text-metro-cyan">User</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-bold uppercase text-gray-400">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full border-2 border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-metro-cyan focus:outline-none"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-bold uppercase text-gray-400">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border-2 border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-metro-cyan focus:outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-bold uppercase text-gray-400">Role</label>
                        <select
                            className="w-full border-2 border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-metro-cyan focus:outline-none"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 bg-metro-cyan px-6 py-3 text-lg font-bold uppercase text-white hover:bg-cyan-600 active:scale-95 transition-all"
                        >
                            <UserPlus size={20} />
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
