import { Plus, Heart } from 'lucide-react';
import { MetroTile } from '../components/MetroTile';

const LibraryPage = () => {
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[128px]">
                {/* Favorites Tile */}
                <MetroTile
                    title="Liked Songs"
                    count="142"
                    icon={<Heart size={32} fill="white" />}
                    color="blue"
                    size="wide"
                    to="/playlist/1"
                    backgroundImage="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop"
                />

                {/* Mock Playlists */}
                <MetroTile
                    title="Coding Focus"
                    count="45 Songs"
                    color="magenta"
                    to="/playlist/2"
                />

                <MetroTile
                    title="Gym Hits"
                    count="32 Songs"
                    color="lime"
                    to="/playlist/3"
                />

                <MetroTile
                    title="Sleepy Time"
                    count="12 Songs"
                    color="purple"
                    to="/playlist/4"
                />

                <MetroTile
                    title="Empty Slot 1"
                    color="teal"
                    className="opacity-50"
                />
                <MetroTile
                    title="Empty Slot 2"
                    color="orange"
                    className="opacity-50"
                />
            </div>
        </div>
    );
};

export default LibraryPage;
