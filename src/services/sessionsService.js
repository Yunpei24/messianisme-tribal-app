import { supabase } from './supabase';
import { insertLocal, queryLocal, updateLocal, deleteLocal, addToSyncQueue } from './database';
import NetInfo from '@react-native-community/netinfo';
import { generateUUID } from '../utils/uuid';

const REMOTE_TABLE = 'sessions_messianisme';
const LOCAL_TABLE = 'local_sessions';

const handleOfflineCreate = async (data, id) => {
    await insertLocal(LOCAL_TABLE, { ...data, synced: 0 });
    await addToSyncQueue(REMOTE_TABLE, id, 'create', data);
};

export const createSession = async (data) => {
    const isOnline = (await NetInfo.fetch()).isConnected;
    const id = data.id || generateUUID();
    const sessionData = { ...data, id };

    if (isOnline) {
        const { data: session, error } = await supabase
            .from(REMOTE_TABLE)
            .insert(sessionData)
            .select()
            .single();

        if (error) {
            await handleOfflineCreate(sessionData, id);
            return sessionData;
        }

        await insertLocal(LOCAL_TABLE, { ...session, synced: 1 });
        return session;
    } else {
        await handleOfflineCreate(sessionData, id);
        return sessionData;
    }
};

export const getSessions = async () => {
    const isOnline = (await NetInfo.fetch()).isConnected;

    if (isOnline) {
        const { data, error } = await supabase
            .from(REMOTE_TABLE)
            .select('*')
            .order('date_debut', { ascending: false });

        if (!error && data) {
            for (const item of data) {
                await insertLocal(LOCAL_TABLE, { ...item, synced: 1 });
            }
            return data;
        }
    }

    return await queryLocal(LOCAL_TABLE, {}, 'ORDER BY date_debut DESC');
};

export const updateSession = async (id, data) => {
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

export const deleteSession = async (id) => {
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
