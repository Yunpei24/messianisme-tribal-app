import { supabase } from './supabase';
import { insertLocal, queryLocal, addToSyncQueue } from './database';
import NetInfo from '@react-native-community/netinfo';
import { generateUUID } from '../utils/uuid';

const REMOTE_TABLE = 'personnes_temoignees';
const LOCAL_TABLE = 'local_personnes';

const handleOfflineCreate = async (data, id) => {
    await insertLocal(LOCAL_TABLE, { ...data, synced: 0 });
    await addToSyncQueue(REMOTE_TABLE, id, 'create', data);
};

export const createPersonne = async (data) => {
    const isOnline = (await NetInfo.fetch()).isConnected;
    const id = data.id || generateUUID();
    const personneData = { ...data, id };

    if (!personneData.session_id || !personneData.participant_id) {
        throw new Error('Une session et un participant sont requis');
    }

    if (isOnline) {
        const { data: personne, error } = await supabase
            .from(REMOTE_TABLE)
            .insert(personneData)
            .select()
            .single();

        if (error) {
            const { local_id, ...validData } = personneData;
            await handleOfflineCreate(validData, id);
            return personneData;
        }

        const { local_id, ...validPersonne } = personne;
        await insertLocal(LOCAL_TABLE, { ...validPersonne, synced: 1 });
        return personne;
    } else {
        const { local_id, ...validData } = personneData;
        await handleOfflineCreate(validData, id);
        return personneData;
    }
};

export const getPersonnes = async (filters = {}) => {
    const isOnline = (await NetInfo.fetch()).isConnected;

    if (isOnline) {
        let query = supabase.from(REMOTE_TABLE).select('*');

        if (filters.session_id) query = query.eq('session_id', filters.session_id);
        if (filters.participant_id) query = query.eq('participant_id', filters.participant_id);

        const { data, error } = await query.order('created_at', { ascending: false });

        if (!error && data) {
            for (const item of data) {
                const { local_id, ...validItem } = item;
                await insertLocal(LOCAL_TABLE, { ...validItem, synced: 1 });
            }
            return data;
        }
    }

    return await queryLocal(LOCAL_TABLE, filters, 'ORDER BY created_at DESC');
};
