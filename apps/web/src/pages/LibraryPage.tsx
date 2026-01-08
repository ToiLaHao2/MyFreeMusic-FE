import { useEffect, useState } from 'react';
import { Plus, Heart, Music, Trash2, Edit2 } from 'lucide-react';
import { MetroTile } from '../components/MetroTile';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { fetchMyPlaylists, createPlaylist, deletePlaylist, updatePlaylist } from '../store/slices/playlistSlice';
import { CreatePlaylistModal } from '../components/modals/CreatePlaylistModal';
import { EditPlaylistModal } from '../components/modals/EditPlaylistModal';

interface PlaylistType {
    id: string;
    playlist_name: string;
    playlist_description?: string;
    playlist_is_private: boolean;
    Songs?: any[];
}

const LibraryPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { playlists, loading } = useSelector((state: RootState) => state.playlists);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState<PlaylistType | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchMyPlaylists());
    }, [dispatch]);

    const handleCreatePlaylist = async (data: { name: string; description: string; isPrivate: boolean }) => {
        setIsCreating(true);
        try {
            await dispatch(createPlaylist({
                name: data.name,
                description: data.description,
                isPrivate: data.isPrivate
            })).unwrap();
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Failed to create playlist:', error);
            alert('Failed to create playlist. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeletePlaylist = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await dispatch(deletePlaylist(id)).unwrap();
            } catch (error) {
                console.error('Failed to delete playlist:', error);
                alert('Failed to delete playlist. Please try again.');
            }
        }
    };

    const handleEditPlaylist = async (data: { name: string; description: string; isPrivate: boolean }) => {
        if (!editingPlaylist) return;
        setIsEditing(true);
        try {
            await dispatch(updatePlaylist({
                id: editingPlaylist.id,
                data: { name: data.name, description: data.description, isPrivate: data.isPrivate }
            })).unwrap();
            setEditingPlaylist(null);
        } catch (error) {
            console.error('Failed to update playlist:', error);
            alert('Failed to update playlist. Please try again.');
        } finally {
            setIsEditing(false);
        }
    };

    return (
        <div className="animate-slide-up">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-4xl font-light uppercase tracking-wider text-white">
                        Your <span className="font-bold text-metro-cyan">Library</span>
                    </h2>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-gray-800 border-2 border-transparent px-6 py-2 text-sm font-bold uppercase text-white hover:border-metro-cyan hover:bg-gray-700 transition-all"
                >
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
                    {playlists.map((playlist: PlaylistType) => (
                        <div key={playlist.id} className="relative group">
                            <MetroTile
                                title={playlist.playlist_name}
                                count={`${playlist.Songs?.length || 0} Songs`}
                                color="magenta"
                                to={`/playlist/${playlist.id}`}
                                icon={<Music size={32} />}
                            />
                            {/* Action buttons - visible on hover */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setEditingPlaylist(playlist);
                                    }}
                                    className="p-2 bg-black/70 text-white hover:bg-metro-cyan transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeletePlaylist(playlist.id, playlist.playlist_name);
                                    }}
                                    className="p-2 bg-black/70 text-white hover:bg-metro-magenta transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty State if no playlists */}
                    {playlists.length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-500 uppercase tracking-widest">
                            No playlists found. Create one to get started.
                        </div>
                    )}
                </div>
            )}

            {/* Create Playlist Modal */}
            <CreatePlaylistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreatePlaylist}
                isLoading={isCreating}
            />

            {/* Edit Playlist Modal */}
            <EditPlaylistModal
                isOpen={!!editingPlaylist}
                onClose={() => setEditingPlaylist(null)}
                onSave={handleEditPlaylist}
                isLoading={isEditing}
                playlist={editingPlaylist}
            />
        </div>
    );
};

export default LibraryPage;


