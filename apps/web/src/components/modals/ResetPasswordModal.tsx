import { useState } from 'react';
import { X, KeyRound } from 'lucide-react';

interface ResetPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onReset: (password: string) => void;
}

export const ResetPasswordModal = ({ isOpen, onClose, user, onReset }: ResetPasswordModalProps) => {
    const [password, setPassword] = useState('');

    if (!isOpen || !user) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onReset(password);
        onClose();
        setPassword('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md animate-slide-up border border-gray-700 bg-metro-dark p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-light uppercase tracking-widest text-white">
                        Reset <span className="font-bold text-metro-orange">Password</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-6 rounded-md bg-gray-800 p-4">
                    <p className="text-sm text-gray-400">Resetting password for:</p>
                    <p className="text-lg font-bold text-white">{user.fullName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-bold uppercase text-gray-400">New Password</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter new password"
                            className="w-full border-2 border-gray-700 bg-gray-900 px-4 py-3 text-white focus:border-metro-orange focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 bg-metro-orange px-6 py-3 text-lg font-bold uppercase text-white hover:bg-orange-600 active:scale-95 transition-all"
                        >
                            <KeyRound size={20} />
                            Set Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
