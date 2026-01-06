import { X, LogIn, LogOut, Play, ListMusic, Heart, Share2 } from 'lucide-react';
import { MOCK_USER_LOGS, type UserLog } from '../../mocks/analytics';

interface UserLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: { id: string; fullName: string; email: string } | null;
}

const getActionIcon = (action: UserLog['action']) => {
    switch (action) {
        case 'LOGIN': return <LogIn size={14} className="text-metro-lime" />;
        case 'LOGOUT': return <LogOut size={14} className="text-gray-500" />;
        case 'PLAY_SONG': return <Play size={14} className="text-metro-cyan" />;
        case 'CREATE_PLAYLIST': return <ListMusic size={14} className="text-metro-blue" />;
        case 'LIKE_SONG': return <Heart size={14} className="text-metro-magenta" />;
        case 'SHARE_PLAYLIST': return <Share2 size={14} className="text-metro-orange" />;
    }
};

const getActionColor = (action: UserLog['action']) => {
    switch (action) {
        case 'LOGIN': return 'border-metro-lime';
        case 'LOGOUT': return 'border-gray-600';
        case 'PLAY_SONG': return 'border-metro-cyan';
        case 'CREATE_PLAYLIST': return 'border-metro-blue';
        case 'LIKE_SONG': return 'border-metro-magenta';
        case 'SHARE_PLAYLIST': return 'border-metro-orange';
    }
};

export const UserLogModal = ({ isOpen, onClose, user }: UserLogModalProps) => {
    if (!isOpen || !user) return null;

    const userLogs = MOCK_USER_LOGS.filter(log => log.userId === user.id);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in" onClick={onClose}>
            <div
                className="w-full max-w-2xl max-h-[80vh] bg-gray-900 border border-gray-800 overflow-hidden animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-black">
                    <div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white">
                            Activity <span className="text-metro-cyan">Log</span>
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">{user.fullName} • {user.email}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Log List */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {userLogs.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No activity logs found</p>
                    ) : (
                        <div className="space-y-3">
                            {userLogs.map(log => (
                                <div
                                    key={log.id}
                                    className={`flex items-start gap-4 p-4 bg-gray-800/50 border-l-4 ${getActionColor(log.action)}`}
                                >
                                    <div className="mt-1">{getActionIcon(log.action)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm">{log.details}</p>
                                        <p className="text-xs text-gray-500 mt-1 font-mono">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                                        {log.action.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
