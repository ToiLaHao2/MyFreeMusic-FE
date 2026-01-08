import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';
import {
    Home,
    Search,
    Library,
    UploadCloud,
    LogOut,
    User as UserIcon,
    Menu,
    X,
    Globe,
    Music
} from 'lucide-react';
import { useState } from 'react';
import RightPanel from '../components/RightPanel';

const MainLayout = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
        <Link
            to={to}
            className={`group flex items-center gap-4 border-l-4 px-6 py-4 transition-all duration-200 ${isActive(to)
                ? 'border-metro-cyan bg-gray-800 text-white'
                : 'border-transparent text-gray-400 hover:border-metro-lime hover:bg-gray-800 hover:text-white'
                }`}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <Icon size={24} className="transition-transform group-hover:scale-110" />
            <span className="text-lg font-light uppercase tracking-wide">{label}</span>
        </Link>
    );


    // ... existing imports

    return (
        <div className="min-h-screen bg-metro-dark text-white font-sans selection:bg-metro-cyan selection:text-white">
            {/* Mobile Header */}
            <header className="flex items-center justify-between border-b border-gray-800 bg-metro-dark p-4 lg:hidden">
                {/* ... existing header content ... */}
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-widest text-white">MyFreeMusic</h1>
                </div>
                <div className="flex items-center gap-2">
                    {user?.avatar ? (
                        <img src={user.avatar} alt="User" className="h-8 w-8 rounded-none border border-gray-600" />
                    ) : (
                        <UserIcon className="h-8 w-8 rounded-none bg-metro-blue p-1" />
                    )}
                </div>
            </header>

            <div className="flex h-screen overflow-hidden">
                {/* Sidebar - Column 1 */}
                <aside className={`
            fixed inset-y-0 left-0 z-50 w-80 transform bg-black border-r border-gray-800 transition-transform duration-300 ease-out lg:static lg:translate-x-0
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
                    <div className="flex h-24 items-center px-8">
                        <h1 className="text-3xl font-light uppercase tracking-widest text-white">
                            My<span className="font-bold text-metro-cyan">Free</span>Music
                        </h1>
                    </div>

                    <nav className="flex flex-col gap-1 py-4">
                        <NavItem to="/" icon={Home} label="Home" />
                        <NavItem to="/songs" icon={Music} label="All Songs" />
                        <NavItem to="/search" icon={Search} label="Search" />
                        <NavItem to="/library" icon={Library} label="Library" />
                        <NavItem to="/upload" icon={UploadCloud} label="Upload" />
                        <NavItem to="/community" icon={Globe} label="Community" />
                    </nav>

                    <div className="absolute bottom-0 w-full p-8">
                        <Link to="/profile" className="mb-6 flex items-center gap-4 group cursor-pointer">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="User" className="h-12 w-12 rounded-none ring-2 ring-gray-700 group-hover:ring-metro-cyan transition-all" />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center bg-metro-magenta">
                                    <UserIcon className="h-6 w-6 text-white" />
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-white group-hover:text-metro-cyan transition-colors">{user?.name || 'User'}</p>
                                <p className="text-xs uppercase tracking-wider text-metro-cyan">{user?.role}</p>
                            </div>
                        </Link>
                        <button
                            onClick={() => dispatch(logout())}
                            className="flex w-full items-center justify-center gap-2 border border-gray-700 bg-transparent py-3 hover:bg-metro-orange hover:border-metro-orange hover:text-white transition-colors uppercase text-sm font-bold tracking-widest text-gray-400"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Backdrop for mobile */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/80 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Main Content Area - Column 2 */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-12">
                    <Outlet />
                </main>

                {/* Right Panel - Column 3 */}
                <RightPanel />
            </div>
        </div>
    );
};

export default MainLayout;
