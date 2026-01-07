import { UploadCloud, Music, Image as ImageIcon, Link2, Youtube, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

type UploadMode = 'file' | 'youtube';

interface Genre {
    id: string;
    name: string;
}

import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../store';
import { uploadSongDevice, uploadSongYoutube, clearUploadStatus } from '../store/slices/songSlice';
import { songApi } from '../lib/api-client';
import { useNavigate } from 'react-router-dom';

const UploadSongPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { uploadStatus, error, duplicateInfo } = useSelector((state: RootState) => state.songs);

    const [mode, setMode] = useState<UploadMode>('file');
    const [dragActive, setDragActive] = useState(false);
    const [songFile, setSongFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [genres, setGenres] = useState<Genre[]>([]);

    // Fetch genres from API on mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await songApi.getGenres();
                setGenres(res.data.data?.genres || []);
            } catch (err) {
                console.error('Failed to fetch genres', err);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        if (uploadStatus === 'succeeded') {
            alert('Upload successful!');
            dispatch(clearUploadStatus());
            navigate('/');
        }
        if (uploadStatus === 'failed' && error) {
            alert(`Upload failed: ${error}`);
            dispatch(clearUploadStatus());
        }
        if (uploadStatus === 'duplicate' && duplicateInfo) {
            const existingTitle = duplicateInfo.existingSong?.title || 'Unknown';
            const shouldForce = window.confirm(`⚠️ Bài hát trùng lặp!\n\n${duplicateInfo.message}\n\nBài hát đã tồn tại: "${existingTitle}"\n\nBạn có muốn tiếp tục upload không?`);

            if (shouldForce) {
                handleUpload(true); // Force upload
            }
            dispatch(clearUploadStatus());
        }
    }, [uploadStatus, error, duplicateInfo, dispatch, navigate]);

    // Extract YouTube video ID from various URL formats
    const getYoutubeVideoId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
            /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
        ];
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('audio/')) setSongFile(file);
        }
    };

    const handleUpload = (force = false) => {
        if (mode === 'file') {
            if (!songFile) {
                alert("Please select a song file.");
                return;
            }
            if (!coverFile) {
                alert("Please select a cover image.");
                return;
            }

            const formData = new FormData();
            formData.append('songFile', songFile);
            formData.append('songCover', coverFile);
            formData.append('songTitle', title || songFile.name.replace(/\.[^/.]+$/, ""));

            if (selectedGenre) {
                formData.append('songGenreId', selectedGenre);
            }
            if (artist) {
                formData.append('songArtistName', artist); // Send artist name, backend will find or create
            }

            formData.append('skipDuplicateCheck', force ? 'true' : 'false');
            dispatch(uploadSongDevice(formData));
        } else {
            if (!youtubeUrl) {
                alert("Please enter a YouTube URL.");
                return;
            }
            dispatch(uploadSongYoutube({ ytbURL: youtubeUrl, skipDuplicateCheck: force }));
        }
    };

    const isLoading = uploadStatus === 'uploading';

    return (
        <div className="animate-slide-up mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8 border-b border-gray-800 pb-6">
                <h2 className="text-4xl font-light uppercase tracking-wider text-white">
                    Add <span className="font-bold text-metro-cyan">Music</span>
                </h2>
                <p className="mt-2 text-gray-400">Upload from your device or paste a YouTube link.</p>
            </div>

            {/* Mode Tabs */}
            <div className="mb-8 flex border-b border-gray-800">
                <button
                    onClick={() => setMode('file')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-4 ${mode === 'file'
                        ? 'border-metro-cyan text-white'
                        : 'border-transparent text-gray-500 hover:text-white hover:border-gray-600'
                        }`}
                >
                    <UploadCloud size={20} />
                    Upload File
                </button>
                <button
                    onClick={() => setMode('youtube')}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all border-b-4 ${mode === 'youtube'
                        ? 'border-metro-magenta text-white'
                        : 'border-transparent text-gray-500 hover:text-white hover:border-gray-600'
                        }`}
                >
                    <Youtube size={20} />
                    YouTube Link
                </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Left Side: Upload or YouTube Input */}
                <div className="space-y-6">
                    {mode === 'file' ? (
                        <>
                            {/* Audio Upload */}
                            <div
                                className={`relative flex min-h-[200px] flex-col items-center justify-center border-2 border-dashed p-6 transition-colors ${dragActive
                                    ? 'border-metro-cyan bg-metro-cyan/10'
                                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    type="file"
                                    id="song-upload"
                                    className="hidden"
                                    accept="audio/*"
                                    onChange={(e) => e.target.files && setSongFile(e.target.files[0])}
                                />
                                <label htmlFor="song-upload" className="flex flex-col items-center cursor-pointer text-center">
                                    {songFile ? (
                                        <>
                                            <Music className="mb-4 h-12 w-12 text-metro-lime" />
                                            <span className="text-lg font-semibold text-white">{songFile.name}</span>
                                            <span className="text-sm text-gray-400">Click to change</span>
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="mb-4 h-12 w-12 text-gray-500" />
                                            <span className="text-lg font-semibold text-white">Drag & drop your song here</span>
                                            <span className="text-sm text-gray-400">or click to browse</span>
                                            <span className="mt-2 text-xs text-gray-600 uppercase tracking-widest">Supports MP3, WAV, FLAC</span>
                                        </>
                                    )}
                                </label>
                            </div>

                            {/* Cover Upload */}
                            <div className="border border-gray-800 bg-gray-900 p-4">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-metro-cyan">Cover Image</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-20 w-20 items-center justify-center bg-gray-800">
                                        {coverFile ? (
                                            <img
                                                src={URL.createObjectURL(coverFile)}
                                                alt="Cover preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="text-gray-600" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-gray-400 file:mr-4 file:border-0 file:bg-metro-blue file:px-4 file:py-2 file:text-sm file:font-bold file:uppercase file:tracking-widest file:text-white hover:file:bg-blue-700 cursor-pointer"
                                        onChange={(e) => e.target.files && setCoverFile(e.target.files[0])}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        /* YouTube URL Input */
                        <div className="space-y-6">
                            <div className="border border-gray-800 bg-gray-900 p-6">
                                <label className="mb-4 block text-xs font-bold uppercase tracking-widest text-metro-magenta flex items-center gap-2">
                                    <Link2 size={14} /> YouTube URL
                                </label>
                                <input
                                    type="url"
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="w-full bg-gray-800 border-l-4 border-gray-700 p-4 text-white placeholder-gray-500 focus:border-metro-magenta focus:outline-none transition-colors"
                                />
                                <p className="mt-4 text-xs text-gray-500">
                                    Paste a YouTube video URL. The audio will be extracted and converted to HLS format.
                                </p>
                            </div>

                            {/* YouTube Video Embed Preview */}
                            <div className="border border-gray-800 bg-gray-900 overflow-hidden">
                                {youtubeUrl && getYoutubeVideoId(youtubeUrl) ? (
                                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            src={`https://www.youtube.com/embed/${getYoutubeVideoId(youtubeUrl)}`}
                                            title="YouTube video preview"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0 w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-48 text-center text-gray-600">
                                        <div>
                                            <Youtube size={48} className="mx-auto mb-4 opacity-30" />
                                            <p className="text-sm uppercase tracking-widest">Paste a URL to preview</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Metadata Form */}
                <div className="border border-gray-800 bg-gray-900 p-6">
                    <h3 className="mb-6 text-lg font-bold uppercase tracking-widest text-white flex items-center gap-2">
                        <Music size={20} className="text-metro-cyan" />
                        Song Details
                    </h3>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-800 border-l-4 border-gray-700 p-4 text-white focus:border-metro-cyan focus:outline-none transition-colors"
                                placeholder="Enter song title"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2">Artist</label>
                            <input
                                type="text"
                                value={artist}
                                onChange={(e) => setArtist(e.target.value)}
                                className="w-full bg-gray-800 border-l-4 border-gray-700 p-4 text-white focus:border-metro-cyan focus:outline-none transition-colors"
                                placeholder="Enter artist name"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-metro-cyan mb-2">Genre</label>
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="w-full bg-gray-800 border-l-4 border-gray-700 p-4 text-white focus:border-metro-cyan focus:outline-none transition-colors"
                            >
                                <option value="">Select a genre</option>
                                {genres.map((g) => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => handleUpload(false)}
                            disabled={isLoading || (mode === 'file' && !songFile) || (mode === 'youtube' && !youtubeUrl)}
                            className={`mt-6 w-full py-4 font-bold uppercase tracking-widest text-white transition-all flex items-center justify-center gap-2 ${mode === 'file'
                                ? 'bg-metro-cyan hover:bg-cyan-600'
                                : 'bg-metro-magenta hover:bg-pink-600'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Processing...
                                </>
                            ) : mode === 'file' ? (
                                <>
                                    <UploadCloud size={20} />
                                    Upload Song
                                </>
                            ) : (
                                <>
                                    <Youtube size={20} />
                                    Download from YouTube
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadSongPage;
