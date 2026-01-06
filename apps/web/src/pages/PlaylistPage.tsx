import { Play, Clock, MoreHorizontal } from 'lucide-react';
import { MOCK_SONGS } from '../mocks/songs';
import { Link } from 'react-router-dom';

const PlaylistPage = () => {
    // Mock Playlist Data
    const playlist = {
        name: "My Favorite Hits",
        author: "Admin User",
        cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop",
        description: "Best songs for coding and relaxing.",
        songs: MOCK_SONGS
    };

    return (
        <div className="animate-slide-up">
            <div className="mb-4">
                <Link to="/library" className="text-gray-400 hover:text-white uppercase text-xs font-bold tracking-widest">
                    ← Back to Library
                </Link>
            </div>

            {/* Playlist Header */}
            <div className="flex flex-col gap-8 md:flex-row md:items-end border-b border-gray-800 pb-8">
                <div className="relative h-64 w-64 shadow-2xl group">
                    <img src={playlist.cover} alt={playlist.name} className="h-full w-full object-cover rounded-none" />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold uppercase tracking-widest text-metro-cyan">Playlist</span>
                    <h1 className="text-5xl font-light text-white uppercase tracking-tighter md:text-7xl">
                        {playlist.name}
                    </h1>
                    <p className="mt-2 text-gray-400 font-light">{playlist.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white">
                        <span>{playlist.author}</span>
                        <span className="mx-2 text-gray-600">•</span>
                        <span>{playlist.songs.length} songs</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="my-8 flex items-center gap-6">
                <button className="flex h-16 w-16 items-center justify-center rounded-full bg-metro-cyan text-white shadow-lg hover:scale-105 hover:bg-cyan-500 transition-all">
                    <Play size={32} fill="currentColor" className="ml-1" />
                </button>
                <button className="text-gray-400 hover:text-white border-2 border-transparent hover:border-white rounded-full p-2 transition-all">
                    <MoreHorizontal size={32} />
                </button>
            </div>

            {/* Song Table */}
            <div className="mt-8">
                <div className="grid grid-cols-[40px_4fr_3fr_1fr] gap-4 border-b-2 border-metro-dark px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <span>#</span>
                    <span>Title</span>
                    <span>Album</span>
                    <span className="flex justify-end"><Clock size={16} /></span>
                </div>

                <div className="mt-2">
                    {playlist.songs.map((song, index) => (
                        <div key={song.id} className="group grid grid-cols-[40px_4fr_3fr_1fr] gap-4 px-4 py-3 hover:bg-gray-800/50 transition-colors cursor-default border-b border-gray-900">
                            <span className="flex items-center font-mono text-gray-500 group-hover:text-metro-cyan">{index + 1}</span>
                            <div className="flex items-center gap-4">
                                <img src={song.coverUrl} className="h-10 w-10 object-cover shadow-sm" alt="" />
                                <div>
                                    <p className="font-semibold text-white group-hover:text-metro-cyan transition-colors">{song.title}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">{song.artist}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-400">Single</div>
                            <div className="flex items-center justify-end text-sm font-mono text-gray-500">
                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlaylistPage;
