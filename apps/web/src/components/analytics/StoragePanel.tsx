import { useState, useEffect } from 'react';
import { storageApi } from '../../lib/api-client';
import { HardDrive, Database, RefreshCw, Music, Loader2, Server, CloudOff } from 'lucide-react';

interface StorageData {
    totalSongs: number;
    filesOnDisk: number;
    totalSizeBytes: number;
    totalSizeFormatted: string;
    averageSizeBytes: number;
    averageSizeFormatted: string;
    storageType: string;
    storagePath: string;
    capacity?: {
        limitBytes: number;
        limitFormatted: string;
        usedBytes: number;
        usedFormatted: string;
        otherUsedBytes: number;
        otherUsedFormatted: string;
        otherUsagePercent: number;
        freeBytes: number;
        freeFormatted: string;
        usagePercent: number;
        diskTotal: number;
        diskTotalFormatted: string;
        diskFree: number;
        diskFreeFormatted: string;
    };
    fromCache: boolean;
    lastScannedAt: string;
}

interface DatabaseTable {
    name: string;
    sizeMB: number;
    rowCount: number;
}

interface DatabaseData {
    tables: DatabaseTable[];
    totalSizeMB: number;
    totalSizeFormatted: string;
}

export const StoragePanel = () => {
    const [storage, setStorage] = useState<StorageData | null>(null);
    const [database, setDatabase] = useState<DatabaseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [storageRes, dbRes] = await Promise.all([
                storageApi.getStats(),
                storageApi.getDatabaseStats()
            ]);
            setStorage(storageRes.data.data.storage || null);
            setDatabase(dbRes.data.data.database || null);
        } catch (error) {
            console.error('Failed to fetch storage data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            const res = await storageApi.refresh();
            setStorage(res.data.data.storage || null);
        } catch (error) {
            console.error('Failed to refresh:', error);
        } finally {
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-metro-cyan" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header with Refresh */}
            <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Storage Overview
                </h3>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                    {refreshing ? 'Scanning...' : 'Refresh'}
                </button>
            </div>

            {/* Capacity Visualization */}
            <div className="bg-gray-900 border border-gray-800 p-6">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-metro-cyan">
                        Storage Capacity ({(storage?.storageType || 'LOCAL') === 'LOCAL' ? 'Local Disk' : 'Cloud Limit'})
                    </h3>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-white">
                            {storage?.capacity?.usedFormatted || '0 B'}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                            / {storage?.capacity?.limitFormatted || '?'}
                        </span>
                    </div>
                </div>

                {/* Stacked Progress Bar */}
                <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden flex">
                    {/* Music Usage */}
                    <div
                        className="h-full bg-metro-cyan transition-all duration-500"
                        style={{ width: `${storage?.capacity?.usagePercent || 0}%` }}
                        title={`Music: ${storage?.capacity?.usedFormatted}`}
                    />
                    {/* Other System Usage */}
                    <div
                        className="h-full bg-gray-600 transition-all duration-500"
                        style={{ width: `${storage?.capacity?.otherUsagePercent || 0}%` }}
                        title={`System/Other: ${storage?.capacity?.otherUsedFormatted}`}
                    />
                </div>

                <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-metro-cyan"></div>
                            Music: <span className="text-white">{storage?.capacity?.usedFormatted}</span>
                        </span>
                        {storage?.capacity?.otherUsedBytes && storage.capacity.otherUsedBytes > 0 ? (
                            <span className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                System: <span className="text-white">{storage?.capacity?.otherUsedFormatted}</span>
                            </span>
                        ) : null}
                    </div>
                    <span>{storage?.capacity?.freeFormatted || '0 B'} Free</span>
                </div>

                {storage?.storageType === 'LOCAL' && (storage?.capacity?.diskTotal || 0) > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-xs">
                        <span className="text-gray-500">Physical Disk:</span>
                        <span className="text-gray-400">
                            Total: <span className="text-white">{storage?.capacity?.diskTotalFormatted}</span> •
                            Free: <span className="text-white">{storage?.capacity?.diskFreeFormatted}</span>
                        </span>
                    </div>
                )}
            </div>

            {/* Music Files Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-metro-blue p-6">
                    <HardDrive size={24} className="text-white/80 mb-2" />
                    <p className="text-3xl font-bold text-white">{storage?.totalSizeFormatted || '0 Bytes'}</p>
                    <p className="text-xs uppercase tracking-widest text-white/60">Total Music Data</p>
                </div>
                <div className="bg-metro-magenta p-6">
                    <Music size={24} className="text-white/80 mb-2" />
                    <p className="text-3xl font-bold text-white">{storage?.filesOnDisk || 0}</p>
                    <p className="text-xs uppercase tracking-widest text-white/60">Files on Disk</p>
                </div>
                <div className="bg-metro-lime p-6">
                    <Server size={24} className="text-white/80 mb-2" />
                    <p className="text-3xl font-bold text-white">{storage?.averageSizeFormatted || '0 Bytes'}</p>
                    <p className="text-xs uppercase tracking-widest text-white/60">Average File Size</p>
                </div>
            </div>

            {/* Storage Configuration */}
            <div className="bg-gray-900 border border-gray-800 p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-metro-cyan mb-4">
                    Configuration Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500">Storage Type:</span>
                        <span className="ml-2 text-white">{storage?.storageType || 'LOCAL'}</span>
                        {storage?.storageType === 'LOCAL' && (
                            <span className="ml-2 text-xs bg-gray-700 px-2 py-0.5 text-gray-300">
                                <CloudOff size={12} className="inline mr-1" />
                                Not Cloud
                            </span>
                        )}
                    </div>
                    <div>
                        <span className="text-gray-500">Path:</span>
                        <span className="ml-2 text-white font-mono text-xs truncate block" title={storage?.storagePath}>
                            {storage?.storagePath || 'N/A'}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500">Songs in DB:</span>
                        <span className="ml-2 text-white">{storage?.totalSongs || 0}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Last Scanned:</span>
                        <span className="ml-2 text-white">
                            {storage?.lastScannedAt
                                ? new Date(storage.lastScannedAt).toLocaleString()
                                : 'Never'}
                        </span>
                        {storage?.fromCache && (
                            <span className="ml-2 text-xs text-gray-500">(cached)</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Database Stats */}
            <div className="bg-gray-900 border border-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-metro-orange">
                        Database Tables
                    </h3>
                    <span className="text-metro-orange font-bold">
                        {database?.totalSizeFormatted || '0 Bytes'} Total
                    </span>
                </div>
                <div className="space-y-2">
                    {database?.tables.map((table) => (
                        <div key={table.name} className="flex items-center gap-4">
                            <Database size={14} className="text-gray-500" />
                            <span className="flex-1 text-white font-mono text-sm">{table.name}</span>
                            <span className="text-gray-400 text-xs">{table.rowCount} rows</span>
                            <span className="text-metro-cyan font-mono text-sm w-20 text-right">
                                {table.sizeMB.toFixed(2)} MB
                            </span>
                        </div>
                    ))}
                    {(!database?.tables || database.tables.length === 0) && (
                        <div className="text-gray-500 text-sm">No table data available</div>
                    )}
                </div>
            </div>

            {/* Cloud Migration Hint */}
            <div className="bg-gray-800/50 border border-gray-700 p-4 text-sm">
                <p className="text-gray-400">
                    💡 <strong className="text-white">Tip:</strong> When migrating to Cloudflare R2,
                    you'll need approximately <strong className="text-metro-cyan">{storage?.totalSizeFormatted || '0 Bytes'}</strong> of
                    cloud storage. R2 offers 10GB free storage per month.
                </p>
            </div>
        </div>
    );
};
