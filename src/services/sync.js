import { supabase } from './supabase';
import { getDb, queryLocal, insertLocal, deleteLocal } from './database';

export const fullSync = async () => {
    try {
        const queue = await queryLocal('sync_queue');
        if (queue.length === 0) return;

        for (const item of queue) {
            const data = JSON.parse(item.data);

            if (item.action === 'create') {
                // Exclude local-only fields if needed, or rely on identical schema
                // Removing 'synced' field which is local only
                const { synced, ...uploadData } = data;

                const { error } = await supabase.from(item.table_name).insert(uploadData);
                if (!error) {
                    // Marquer comme synchronisé localement
                    await deleteLocal('sync_queue', item.id);
                } else {
                    console.error(`Error syncing record ${item.record_id} to ${item.table_name}`, error);
                }
            } else if (item.action === 'update') {
                const { synced, ...uploadData } = data;
                const { error } = await supabase.from(item.table_name).update(uploadData).eq('id', item.record_id);
                if (!error) {
                    await deleteLocal('sync_queue', item.id);
                }
            }
        }
    } catch (error) {
        console.error('Full sync process failed:', error);
    }
};
