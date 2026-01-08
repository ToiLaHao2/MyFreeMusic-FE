import { useEffect, useState, useRef } from 'react';
import { Plus, Heart, Music, Trash2, Edit2, Users } from 'lucide-react';
import { MetroTile } from '../components/MetroTile';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { fetchMyPlaylists, createPlaylist, deletePlaylist, updatePlaylist } from '../store/slices/playlistSlice';
import { CreatePlaylistModal } from '../components/modals/CreatePlaylistModal';
import { EditPlaylistModal } from '../components/modals/EditPlaylistModal';
import { playlistApi, authApi } from '../lib/api-client';
import { setCredentials } from '../store/slices/authSlice';

interface PlaylistType {
    id: string;
    playlist_name: string;
    playlist_description?: string;
    playlist_is_private: boolean;
    playlist_cover_url?: string;
    Songs?: any[];
}

const LibraryPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { playlists, loading } = useSelector((state: RootState) => state.playlists);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState<PlaylistType | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [sharedPlaylists, setSharedPlaylists] = useState<any[]>([]);
    const { user } = useSelector((state: RootState) => state.auth); // Get user for custom covers
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingCoverType, setUploadingCoverType] = useState<'allSongs' | 'likedSongs' | null>(null);

    // Import useRef
    // import { useEffect, useState, useRef } from 'react'; (Will be handled by imports below if consistent, but need to ensure useRef is imported)

    // ... useEffect ...

    const handleEditCover = (type: 'allSongs' | 'likedSongs') => {
        setUploadingCoverType(type);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingCoverType) return;

        const formData = new FormData();
        if (uploadingCoverType === 'allSongs') {
            formData.append('customAllSongsCover', file);
        } else {
            formData.append('customLikedSongsCover', file);
        }

        try {
            const res = await authApi.updateProfile(formData);
            dispatch(setCredentials({ user: res.data.data.user }));
            alert('Cover updated successfully!');
        } catch (error) {
            console.error('Failed to update cover:', error);
            alert('Failed to update cover.');
        } finally {
            setUploadingCoverType(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        dispatch(fetchMyPlaylists());
        const fetchShared = async () => {
            try {
                const res = await playlistApi.getShared();
                setSharedPlaylists(res.data.data.playlists || []);
            } catch (err) {
                console.error("Failed to fetch shared playlists", err);
            }
        };
        fetchShared();
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
                <div className="space-y-12">
                    {/* Section: My Playlists */}
                    <div>
                        <h3 className="text-xl font-light uppercase tracking-widest text-white mb-4 border-b border-gray-800 pb-2">
                            My Collections
                        </h3>
                        {playlists.length === 0 ? (
                            <div className="py-8 text-center text-gray-500 uppercase tracking-widest bg-gray-900/50 border border-gray-800 border-dashed">
                                No private playlists found. Create one to get started.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[128px]">
                                {/* All Songs */}
                                <div className="relative group">
                                    <MetroTile
                                        title="All Songs"
                                        count="Library"
                                        icon={<Music size={32} fill="white" />}
                                        color="lime"
                                        size="wide"
                                        to="/songs"
                                        backgroundImage={user?.customAllSongsCover || "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop"}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleEditCover('allSongs');
                                        }}
                                        className="absolute top-2 right-2 p-2 bg-black/70 text-white hover:bg-metro-cyan transition-colors opacity-0 group-hover:opacity-100 z-20 rounded shadow-lg"
                                        title="Change Cover"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>

                                {/* Liked Songs */}
                                <div className="relative group">
                                    <MetroTile
                                        title="Liked Songs"
                                        count="N/A"
                                        icon={<Heart size={32} fill="white" />}
                                        color="blue"
                                        size="wide"
                                        to="/playlist/favorites"
                                        backgroundImage={user?.customLikedSongsCover || "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop"}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleEditCover('likedSongs');
                                        }}
                                        className="absolute top-2 right-2 p-2 bg-black/70 text-white hover:bg-metro-cyan transition-colors opacity-0 group-hover:opacity-100 z-20 rounded shadow-lg"
                                        title="Change Cover"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </div>

                                {/* User Playlists */}
                                {playlists.map((playlist: PlaylistType) => (
                                    <div key={playlist.id} className="relative group">
                                        <MetroTile
                                            title={playlist.playlist_name}
                                            count={`${playlist.Songs?.length || 0} Songs`}
                                            color="magenta"
                                            to={`/playlist/${playlist.id}`}
                                            icon={<Music size={32} />}
                                            backgroundImage={playlist.playlist_cover_url}
                                        />
                                        {/* Action buttons */}
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
                            </div>
                        )}
                    </div>

                    {/* Section: Shared With Me */}
                    <div>
                        <h3 className="text-xl font-light uppercase tracking-widest text-white mb-4 border-b border-gray-800 pb-2 flex items-center gap-2">
                            Shared With Me <span className="text-xs bg-metro-orange px-2 py-0.5 text-black font-bold rounded">New</span>
                        </h3>
                        {sharedPlaylists.length === 0 ? (
                            <div className="py-8 text-center text-gray-500 uppercase tracking-widest bg-gray-900/50 border border-gray-800 border-dashed">
                                No playlists have been shared with you yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[128px]">
                                {sharedPlaylists.map((playlist: any) => (
                                    <MetroTile
                                        key={playlist.id}
                                        title={playlist.playlist_name}
                                        count={`Shared by ${playlist.shared_from?.user_full_name || 'User'}`}
                                        color="orange"
                                        to={`/playlist/${playlist.id}`}
                                        icon={<Users size={32} />}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
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

            {/* Hidden File Input for Custom Covers */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default LibraryPage;


