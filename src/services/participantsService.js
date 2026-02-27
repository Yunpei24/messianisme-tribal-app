import { supabase } from './supabase';
import { insertLocal, queryLocal, addToSyncQueue, updateLocal, deleteLocal } from './database';
import NetInfo from '@react-native-community/netinfo';
import { generateUUID } from '../utils/uuid';

const REMOTE_TABLE = 'participants';
const LOCAL_TABLE = 'local_participants';

const handleOfflineCreate = async (data, id) => {
    await insertLocal(LOCAL_TABLE, { ...data, synced: 0 });
    await addToSyncQueue(REMOTE_TABLE, id, 'create', data);
};

export const createParticipant = async (data) => {
    const isOnline = (await NetInfo.fetch()).isConnected;
    const id = data.id || generateUUID();
    const participantData = { ...data, id };

    if (isOnline) {
        const { data: participant, error } = await supabase
            .from(REMOTE_TABLE)
            .insert(participantData)
            .select()
            .single();

        if (error) {
            await handleOfflineCreate(participantData, id);
            return participantData;
        }

        await insertLocal(LOCAL_TABLE, { ...participant, synced: 1 });
        return participant;
    } else {
        await handleOfflineCreate(participantData, id);
        return participantData;
    }
};

export const getParticipants = async () => {
    const isOnline = (await NetInfo.fetch()).isConnected;

    if (isOnline) {
        const { data, error } = await supabase
            .from(REMOTE_TABLE)
            .select('*')
            .order('nom', { ascending: true });

        if (!error && data) {
            for (const item of data) {
                await insertLocal(LOCAL_TABLE, { ...item, synced: 1 });
            }
            return data;
        }
    }

    return await queryLocal(LOCAL_TABLE, {}, 'ORDER BY nom ASC');
};

export const updateParticipant = async (id, data) => {
    const isOnline = (await NetInfo.fetch()).isConnected;

    if (isOnline) {
        const { error } = await supabase.from(REMOTE_TABLE).update(data).eq('id', id);
        if (!error) {
            await updateLocal(LOCAL_TABLE, id, { ...data, synced: 1 });
            return true;
        }
    }

    await updateLocal(LOCAL_TABLE, id, { ...data, synced: 0 });
    await addToSyncQueue(REMOTE_TABLE, id, 'update', data);
    return true;
};

export const deleteParticipant = async (id) => {
    const isOnline = (await NetInfo.fetch()).isConnected;

    if (isOnline) {
        const { error } = await supabase.from(REMOTE_TABLE).delete().eq('id', id);
        if (!error) {
            await deleteLocal(LOCAL_TABLE, id);
            return true;
        }
    }

    await deleteLocal(LOCAL_TABLE, id);
    await addToSyncQueue(REMOTE_TABLE, id, 'delete', { id });
    return true;
};
