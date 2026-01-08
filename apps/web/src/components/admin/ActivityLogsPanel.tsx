import React, { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api-client';
import { RefreshCw, Trash2, Filter, ChevronLeft, ChevronRight, User } from 'lucide-react';

interface ActivityLog {
    id: string;
    action: string;
    details: any;
    ip_address: string;
    user_agent: string;
    createdAt: string;
    User?: {
        id: string;
        user_full_name: string;
        user_email: string;
    };
}

const ActivityLogsPanel = () => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [filterAction, setFilterAction] = useState('');

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getLogs(page, 20, filterAction || undefined);
            const data = response.data.data;
            setLogs(data.logs || []);
            setTotalPages(data.totalPages || 1);
            setTotalLogs(data.total || 0);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, filterAction]);

    const handleClearLogs = async () => {
        if (!confirm("Are you sure you want to delete logs older than 30 days?")) return;
        try {
            const result = await adminApi.clearLogs(30);
            alert(`Cleared ${result.data.data.deletedCount} old logs.`);
            fetchLogs();
        } catch (error) {
            console.error("Failed to clear logs", error);
            alert("Failed to clear logs");
        }
    };

    const formatAction = (action: string) => {
        const colors: Record<string, string> = {
            'USER_LOGIN': 'text-green-400',
            'USER_LOGOUT': 'text-gray-400',
            'PLAYLIST_CREATE': 'text-blue-400',
            'PLAYLIST_DELETE': 'text-red-400',
            'SONG_UPLOAD_DEVICE': 'text-purple-400',
            'SONG_UPLOAD_YOUTUBE': 'text-red-500',
            'USER_DELETE': 'text-red-600 font-bold',
        };
        return <span className={`${colors[action] || 'text-white'} font-semibold`}>{action}</span>;
    };

    return (
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-bold text-white">Activity Logs</h2>
                    <div className="flex items-center space-x-2 bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-700">
                        <Filter size={14} className="text-gray-400" />
                        <select
                            value={filterAction}
                            onChange={(e) => setFilterAction(e.target.value)}
                            className="bg-transparent text-sm text-gray-200 outline-none border-none"
                        >
                            <option value="">All Actions</option>
                            <option value="USER_LOGIN">Logins</option>
                            <option value="PLAYLIST_CREATE">Playlist Creations</option>
                            <option value="SONG_UPLOAD_DEVICE">Song Uploads</option>
                            <option value="USER_DELETE">User Deletions</option>
                        </select>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => fetchLogs()}
                        className="p-2 hover:bg-zinc-700 rounded-full transition text-gray-400 hover:text-white"
                        title="Refresh"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={handleClearLogs}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg border border-red-900/50 transition-colors"
                    >
                        <Trash2 size={16} />
                        <span>Clear Old Logs</span>
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-zinc-900/50 rounded-lg border border-zinc-800 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-zinc-800/50 text-gray-200 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Time</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Details</th>
                            <th className="px-6 py-3">IP / Agent</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading && logs.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8">No logs found</td></tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center">
                                                <User size={12} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{log.User?.user_full_name || 'Unknown'}</span>
                                                <span className="text-xs text-gray-500">{log.User?.user_email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatAction(log.action)}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-gray-400">
                                        {log.details ? JSON.stringify(log.details) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500">
                                        <div>{log.ip_address}</div>
                                        <div className="truncate w-32" title={log.user_agent}>{log.user_agent}</div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4">
                <div className="text-sm text-gray-500">
                    Showing logs {((page - 1) * 20) + 1} to {Math.min(page * 20, totalLogs)} of {totalLogs}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="flex items-center px-4 bg-zinc-800 rounded">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded disabled:opacity-50"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogsPanel;
