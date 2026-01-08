import { Play, Clock, MoreHorizontal, Share2, Plus, Trash2, GripVertical } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { playlistApi, favoritesApi, type Playlist } from '../lib/api-client';
import { useDispatch } from 'react-redux';
import { playPlaylist } from '../store/slices/songSlice';

import { SharePlaylistModal } from '../components/modals/SharePlaylistModal';
import { AddSongModal } from '../components/modals/AddSongModal';
import { EditPlaylistModal } from '../components/modals/EditPlaylistModal';

// DnD Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableSongRowProps {
    song: any;
    index: number;
    onPlay: (song: any) => void;
    onRemove: (e: React.MouseEvent, songId: string) => void;
}

const SortableSongRow = ({ song, index, onPlay, onRemove }: SortableSongRowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: song.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group grid grid-cols-[auto_16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-3 hover:bg-white/5 rounded-md transition-colors items-center cursor-pointer"
            onClick={() => onPlay(song)}
        >
            {/* Drag Handle */}
            <div className="text-gray-600 cursor-grab hover:text-white" {...attributes} {...listeners} onClick={(e) => e.stopPropagation()}>
                <GripVertical size={16} />
            </div>

            {/* Index / Play Icon */}
            <div className="w-8 text-center">
                <div className="text-gray-500 group-hover:hidden">{index + 1}</div>
                <div className="hidden group-hover:block text-white"><Play size={12} fill="white" /></div>
            </div>

            {/* Title & Artist */}
            <div className="flex items-center gap-3">
                <img src={song.coverUrl || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 object-cover rounded" />
                <div>
                    <div className="text-white font-medium group-hover:text-metro-cyan transition-colors">{song.title}</div>
                    <div className="text-xs text-gray-500">{song.artist_names || "Unknown Artist"}</div>
                </div>
            </div>

            {/* Album */}
            <div className="text-sm truncate">{song.album_name || "Unknown Album"}</div>
            {/* Date Added */}
            <div className="text-sm text-gray-400">Today</div>

            {/* Actions / Time */}
            <div className="flex items-center justify-end gap-4">
                <button
                    onClick={(e) => onRemove(e, song.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all"
                    title="Remove from playlist"
                >
                    <Trash2 size={16} />
                </button>
                <div className="text-sm font-mono text-gray-400">3:45</div>
            </div>
        </div>
    );
};

const PlaylistPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [songs, setSongs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Helper: Auto-generate color gradient from string
    const getGradientFromName = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c1 = `hsl(${hash % 360}, 70%, 50%)`;
        const c2 = `hsl(${(hash + 40) % 360}, 70%, 30%)`;
        return `linear-gradient(135deg, ${c1}, ${c2})`;
    };

    const handleEditPlaylist = async (data: any) => {
        setIsEditing(true);
        try {
            await playlistApi.update(id!, data);
            await loadPlaylist();
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Failed to update playlist", err);
            alert("Failed to update playlist.");
        } finally {
            setIsEditing(false);
        }
    };

    const loadPlaylist = async () => {
        if (!id) return;
        setLoading(true);
        try {
            if (id === 'favorites') {
                // Load Favorites
                const res = await favoritesApi.getAll();
                const likedSongs = res.data.data.songs || [];
                setPlaylist({
                    id: 'favorites',
                    playlist_name: 'Liked Songs',
                    playlist_description: 'Your collection of favorite tracks',
                    playlist_is_private: true,
                    user_id: 'me',
                    Songs: likedSongs,
                    playlist_cover_url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop'
                });
                setSongs(likedSongs);
            } else {
                // Load Regular Playlist
                const res = await playlistApi.getById(id);
                setPlaylist(res.data.data.playlist);
                setSongs(res.data.data.playlist.Songs || []);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load playlist.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlaylist();
    }, [id]);

    const handlePlaySong = (song: any) => {
        // Find index of clicked song
        const startIndex = songs.findIndex(s => s.id === song.id);
        dispatch(playPlaylist({
            songs: songs,
            startIndex: startIndex !== -1 ? startIndex : 0
        }));
    };

    const handleRemoveSong = async (e: React.MouseEvent, songId: string) => {
        e.stopPropagation(); // Prevent playing song
        if (!confirm("Remove this song from the playlist?")) return;

        // Optimistic update
        const oldSongs = [...songs];
        setSongs(prev => prev.filter(s => s.id !== songId));

        try {
            if (id === 'favorites') {
                await favoritesApi.remove(songId);
                // Also update global liked state if possible, but page refresh or re-mount will handle it
            } else {
                await playlistApi.removeSong(id!, songId);
            }
        } catch (err) {
            console.error("Failed to remove song", err);
            setSongs(oldSongs); // Revert
            alert("Failed to remove song.");
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = songs.findIndex((s) => s.id === active.id);
            const newIndex = songs.findIndex((s) => s.id === over?.id);

            const newOrder = arrayMove(songs, oldIndex, newIndex);
            setSongs(newOrder);

            // Call API to save order
            try {
                const songIds = newOrder.map(s => s.id);
                await playlistApi.reorder(id!, songIds);
            } catch (err) {
                console.error("Failed to reorder songs", err);
                // Ideally revert here, but reordering failure is less critical
            }
        }
    };
    if (error || !playlist) return <div className="text-red-500 p-8">Error: {error || "Playlist not found"}</div>;

    return (
        <div className="animate-slide-up pb-20">
            {/* Playlist Header */}
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Cover Image */}
                <div
                    className="w-64 h-64 bg-gray-800 shadow-2xl relative group shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ background: !playlist.playlist_cover_url ? getGradientFromName(playlist.playlist_name) : undefined }}
                >
                    {playlist.playlist_cover_url ? (
                        <img
                            src={playlist.playlist_cover_url}
                            alt={playlist.playlist_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-6xl font-bold text-white/50 uppercase select-none">
                            {playlist.playlist_name.substring(0, 2)}
                        </span>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play size={48} className="text-white" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-end text-white flex-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2">Playlist</span>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 line-clamp-2">{playlist.playlist_name}</h1>
                    <p className="text-gray-400 mb-6 max-w-lg">{playlist.playlist_description || "No description."}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="font-bold text-white">Owner</span>
                        <span>•</span>
                        <span>{songs.length} songs</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-6">
                        <button
                            onClick={() => songs.length > 0 && handlePlaySong(songs[0])}
                            className="w-14 h-14 bg-metro-lime rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg shadow-metro-lime/20"
                        >
                            <Play size={24} fill="currentColor" className="ml-1" />
                        </button>

                        {id !== 'favorites' && (
                            <>
                                <button
                                    onClick={() => setIsAddSongModalOpen(true)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                >
                                    <Plus size={20} />
                                    Add Songs
                                </button>
                                <button
                                    onClick={() => setIsShareModalOpen(true)}
                                    className="text-gray-400 hover:text-metro-cyan transition-colors ml-auto md:ml-0"
                                    title="Share Playlist"
                                >
                                    <Share2 size={32} />
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                    title="Edit Playlist"
                                >
                                    <MoreHorizontal size={32} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Song Table */}
            <div className="bg-black/20 text-gray-300">
                {/* Table Header */}
                <div className="grid grid-cols-[auto_16px_4fr_3fr_2fr_1fr] gap-4 px-4 py-3 border-b border-gray-800 text-xs font-bold uppercase tracking-widest text-gray-500">
                    <div className="w-4"></div> {/* Grip placeholder */}
                    <div>#</div>
                    <div>Title</div>
                    <div>Album</div>
                    <div>Date Added</div>
                    <div className="text-right"><Clock size={16} className="inline" /></div>
                </div>

                {/* Table Body (Sortable) */}
                <div className="mt-2">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={songs.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {songs.map((song: any, index: number) => (
                                <SortableSongRow
                                    key={song.id}
                                    song={song}
                                    index={index}
                                    onPlay={handlePlaySong}
                                    onRemove={handleRemoveSong}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>

                    {songs.length === 0 && (
                        <div className="p-12 text-center text-gray-500 border border-dashed border-gray-800 rounded mx-4 mt-4">
                            <p className="mb-4">This playlist is empty.</p>
                            <button
                                onClick={() => setIsAddSongModalOpen(true)}
                                className="text-metro-cyan hover:underline uppercase tracking-widest font-bold text-sm"
                            >
                                Find songs to add
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <SharePlaylistModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                playlistId={id!}
                playlistName={playlist?.playlist_name || ''}
            />

            <AddSongModal
                isOpen={isAddSongModalOpen}
                onClose={() => setIsAddSongModalOpen(false)}
                playlistId={id!}
                onSongAdded={loadPlaylist}
            />

            <EditPlaylistModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleEditPlaylist}
                isLoading={isEditing}
                playlist={playlist}
            />
        </div>
    );
};

export default PlaylistPage;
