import { MOCK_SONGS } from '../mocks/songs';
import { MetroTile } from '../components/MetroTile';
import { Play, Search, Library, UploadCloud, Settings, Radio } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const HomePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className="animate-slide-up">
            <div className="mb-8">
                <h1 className="text-4xl font-light uppercase tracking-wider text-white">
                    Start <span className="font-bold text-metro-cyan">Scanning</span>
                </h1>
                <p className="text-lg text-gray-400">Welcome back, {user?.fullName}</p>
            </div>

            {/* Dashboard Tiles */}
            <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:auto-rows-[128px]">
                {/* Hero Tile */}
                <MetroTile
                    title="Library"
                    count="128 Songs"
                    icon={<Library size={32} />}
                    color="cyan"
                    size="wide"
                    to="/library"
                    backgroundImage="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop"
                />

                <MetroTile
                    title="Search"
                    icon={<Search size={32} />}
                    color="magenta"
                    to="/search"
                />

                <MetroTile
                    title="Upload"
                    icon={<UploadCloud size={32} />}
                    color="lime"
                    to="/upload"
                />

                {user?.role === 'ADMIN' && (
                    <MetroTile
                        title="Admin Panel"
                        icon={<Settings size={32} />}
                        color="orange"
                        size="medium"
                        to="/admin"
                    />
                )}

                <MetroTile
                    title="Radio"
                    icon={<Radio size={32} />}
                    color="purple"
                    count="Live"
                />

                <MetroTile
                    title="Favorites"
                    color="blue"
                    count="12"
                    to="/playlist/1"
                />
            </div>

            {/* Recommended Songs Sections */}
            <h2 className="mb-6 text-2xl font-light uppercase tracking-wide text-white border-b border-gray-800 pb-2">
                Recommended For You
            </h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {MOCK_SONGS.map((song) => (
                    <div
                        key={song.id}
                        className="group relative aspect-square cursor-pointer overflow-hidden bg-gray-800 hover:z-10 hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                        <img src={song.coverUrl} alt={song.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />

                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 opacity-100 transition-opacity">
                            <h3 className="truncate font-bold text-white uppercase tracking-wider">{song.title}</h3>
                            <p className="truncate text-xs text-gray-300">{song.artist}</p>
                        </div>

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="rounded-full bg-metro-lime p-2 text-black shadow-lg">
                                <Play size={16} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
