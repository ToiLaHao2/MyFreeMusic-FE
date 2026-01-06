import { useState } from 'react';
import { Trash2, UserPlus, FileAudio, Users, RotateCcw, BarChart2, FileText } from 'lucide-react';
import { MOCK_USERS } from '../mocks/users';
import { MetroTile } from '../components/MetroTile';
import { AddUserModal } from '../components/modals/AddUserModal';
import { ResetPasswordModal } from '../components/modals/ResetPasswordModal';
import { UserLogModal } from '../components/modals/UserLogModal';
import { AnalyticsPanel } from '../components/analytics/AnalyticsPanel';

type TabType = 'users' | 'analytics';

const AdminDashboard = () => {
    const [users, setUsers] = useState(MOCK_USERS);
    const [activeTab, setActiveTab] = useState<TabType>('users');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [resetUser, setResetUser] = useState<any>(null);
    const [logUser, setLogUser] = useState<any>(null);

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleAddUser = (newUser: any) => {
        setUsers([...users, newUser]);
        alert(`User ${newUser.fullName} created successfully! (Mock)`);
    };

    const handleResetPassword = (password: string) => {
        alert(`Password for ${resetUser.fullName} reset to: ${password} (Mock)`);
        setResetUser(null);
    };

    return (
        <div className="animate-slide-up space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-light uppercase tracking-wider text-white">
                        Admin <span className="font-bold text-metro-cyan">Panel</span>
                    </h1>
                    <p className="text-gray-400">Analyze & Manage System</p>
                </div>
                {activeTab === 'users' && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-metro-lime px-6 py-3 text-lg font-bold uppercase text-white hover:brightness-110 transition-all"
                    >
                        <UserPlus size={24} />
                        <span>New User</span>
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-4 ${activeTab === 'users'
                            ? 'border-metro-cyan text-white'
                            : 'border-transparent text-gray-500 hover:text-white'
                        }`}
                >
                    <Users size={18} />
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-4 ${activeTab === 'analytics'
                            ? 'border-metro-magenta text-white'
                            : 'border-transparent text-gray-500 hover:text-white'
                        }`}
                >
                    <BarChart2 size={18} />
                    Analytics
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'users' ? (
                <>
                    {/* Live Stats Tiles */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <MetroTile
                            title="Total Users"
                            count={users.length}
                            icon={<Users size={32} />}
                            color="blue"
                        />
                        <MetroTile
                            title="Total Songs"
                            count="5,678"
                            icon={<FileAudio size={32} />}
                            color="magenta"
                        />
                        <MetroTile
                            title="Server Status"
                            count="Online"
                            icon={<RotateCcw size={32} />}
                            color="teal"
                        />
                        <MetroTile
                            title="Pending Approvals"
                            count="3"
                            color="orange"
                        />
                    </div>

                    {/* User Management Table */}
                    <div className="border border-gray-800 bg-gray-900/50">
                        <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4 bg-black/40">
                            <h3 className="text-lg font-bold uppercase tracking-widest text-white">User Management</h3>
                            <span className="text-xs text-gray-500">{users.length} records found</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-black text-xs font-bold uppercase text-metro-cyan">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {user.profilePicture ? (
                                                        <img src={user.profilePicture} alt="" className="h-10 w-10 ring-1 ring-gray-600" />
                                                    ) : (
                                                        <div className="flex h-10 w-10 items-center justify-center bg-gray-700 text-white font-bold">
                                                            {user.fullName.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-white">{user.fullName}</div>
                                                        <div className="text-xs text-gray-500">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-metro-purple text-white' : 'bg-gray-700 text-gray-300'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-metro-lime animate-pulse" />
                                                    <span className="text-white">Active</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <button
                                                        onClick={() => setLogUser(user)}
                                                        className="p-2 text-gray-400 hover:text-metro-cyan transition-colors"
                                                        title="View Logs"
                                                    >
                                                        <FileText size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setResetUser(user)}
                                                        className="p-2 text-gray-400 hover:text-metro-orange transition-colors"
                                                        title="Reset Password"
                                                    >
                                                        <RotateCcw size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-gray-400 hover:text-metro-magenta transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <AnalyticsPanel />
            )}

            {/* Modals */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddUser}
            />
            <ResetPasswordModal
                isOpen={!!resetUser}
                onClose={() => setResetUser(null)}
                user={resetUser}
                onReset={handleResetPassword}
            />
            <UserLogModal
                isOpen={!!logUser}
                onClose={() => setLogUser(null)}
                user={logUser}
            />
        </div>
    );
};

export default AdminDashboard;
