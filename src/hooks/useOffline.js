import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { fullSync } from '../services/sync';
import { queryLocal } from '../services/database';

export const useOffline = () => {
    const [isOnline, setIsOnline] = useState(true);
    const [queueCount, setQueueCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOnline(!!state.isConnected);
        });

        // Vérification initiale
        checkQueue();

        return () => unsubscribe();
    }, [isOnline]);

    const checkQueue = async () => {
        try {
            const queue = await queryLocal('sync_queue');
            setQueueCount(queue.length);

            if (isOnline && queue.length > 0 && !isSyncing) {
                await syncNow();
            }
        } catch (error) {
            console.error('Error checking queue', error);
        }
    };

    const syncNow = async () => {
        if (!isOnline || isSyncing) return;

        setIsSyncing(true);
        try {
            await fullSync();
            setLastSync(new Date().toISOString());
            await checkQueue(); // Re-vérifier s'il reste des éléments
        } catch (error) {
            console.error('Sync failed', error);
        } finally {
            setIsSyncing(false);
        }
    };

    return {
        isOnline,
        queueCount,
        isSyncing,
        lastSync,
        syncNow,
        checkQueue
    };
};
