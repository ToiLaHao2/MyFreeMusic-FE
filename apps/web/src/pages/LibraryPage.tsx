import { useEffect } from 'react';
import { Plus, Heart, Music } from 'lucide-react';
import { MetroTile } from '../components/MetroTile';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { fetchMyPlaylists } from '../store/slices/playlistSlice';

const LibraryPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { playlists, loading } = useSelector((state: RootState) => state.playlists);

    useEffect(() => {
        dispatch(fetchMyPlaylists());
    }, [dispatch]);

    return (
        <div className="animate-slide-up">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-light uppercase tracking-wider text-white">
                        Your <span className="font-bold text-metro-cyan">Library</span>
                    </h2>
                </div>
                <button className="flex items-center gap-2 bg-gray-800 border-2 border-transparent px-6 py-2 text-sm font-bold uppercase text-white hover:border-metro-cyan hover:bg-gray-700 transition-all">
                    <Plus size={20} />
                    <span>Create Playlist</span>
                </button>
            </div>

            {loading ? (
                <div className="text-white">Loading playlists...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[128px]">
                    {/* Hardcoded Favorites (Todo: fetch favorites specifically) */}
                    <MetroTile
                        title="Liked Songs"
                        count="N/A"
                        icon={<Heart size={32} fill="white" />}
                        color="blue"
                        size="wide"
                        to="/playlist/favorites"
                        backgroundImage="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop"
                    />

                    {/* User Playlists */}
                    {playlists.map((playlist) => (
                        <MetroTile
                            key={playlist.id}
                            title={playlist.playlist_name}
                            count={`${playlist.Songs?.length || 0} Songs`}
                            color="magenta" // Dynamic color later?
                            to={`/playlist/${playlist.id}`}
                            icon={<Music size={32} />}
                        />
                    ))}

                    {/* Empty State if no playlists */}
                    {playlists.length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-500 uppercase tracking-widest">
                            No playlists found. Create one to get started.
                        </div>
                    )}

                    {/* Slot placeholders (optional) */}
                    <MetroTile
                        title="Empty Slot"
                        color="orange"
                        className="opacity-20"
                    />
                </div>
            )}
        </div>
    );
};

export default LibraryPage;
