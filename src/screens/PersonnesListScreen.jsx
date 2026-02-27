import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Title, Card, Paragraph, Portal, Modal } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import OfflineIndicator from '../components/shared/OfflineIndicator';
import CustomButton from '../components/shared/CustomButton';
import { getPersonnes } from '../services/personnesService';
import { getSessions } from '../services/sessionsService';
import { getParticipants } from '../services/participantsService';

export default function PersonnesListScreen({ navigation }) {
    const [personnes, setPersonnes] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [participants, setParticipants] = useState([]);

    const [filterSession, setFilterSession] = useState('');
    const [filterParticipant, setFilterParticipant] = useState('');

    const [selectedPersonne, setSelectedPersonne] = useState(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadData();
        });
        loadData();
        return unsubscribe;
    }, [navigation]);

    const loadData = async () => {
        const [s, p] = await Promise.all([getSessions(), getParticipants()]);
        setSessions(s || []);
        setParticipants(p || []);
        fetchPersonnes(filterSession, filterParticipant);
    };

    const fetchPersonnes = async (sessionId, participantId) => {
        const filters = {};
        if (sessionId) filters.session_id = sessionId;
        if (participantId) filters.participant_id = participantId;
        const data = await getPersonnes(filters);
        setPersonnes(data || []);
    };

    const handleFilterChange = (type, value) => {
        if (type === 'session') {
            setFilterSession(value);
            fetchPersonnes(value, filterParticipant);
        } else {
            setFilterParticipant(value);
            fetchPersonnes(filterSession, value);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedPersonne(item)}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title>{item.nom} {item.prenoms}</Title>
                    <Paragraph>{item.sexe} - {item.situation_matrimoniale}</Paragraph>
                    {item.ville_village ? <Paragraph>Ville: {item.ville_village}</Paragraph> : null}
                    <Paragraph style={{ color: '#8b5cf6', marginTop: 8, fontWeight: 'bold' }}>Voir les détails →</Paragraph>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <OfflineIndicator />

            <View style={styles.filterSection}>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={filterSession} onValueChange={(val) => handleFilterChange('session', val)} style={{ color: '#1f2937' }}>
                        <Picker.Item label="-- Toutes les sessions --" value="" color="#1f2937" />
                        {sessions.map(s => <Picker.Item key={s.id} label={s.localite_activite} value={s.id} color="#1f2937" />)}
                    </Picker>
                </View>
                <View style={styles.pickerContainer}>
                    <Picker selectedValue={filterParticipant} onValueChange={(val) => handleFilterChange('participant', val)} style={{ color: '#1f2937' }}>
                        <Picker.Item label="-- Tous les enquêteurs --" value="" color="#1f2937" />
                        {participants.map(p => <Picker.Item key={p.id} label={p.nom} value={p.id} color="#1f2937" />)}
                    </Picker>
                </View>
            </View>

            <FlatList
                data={personnes}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
                ListHeaderComponent={<Title style={{ marginBottom: 16 }}>Enquêtes réalisées ({personnes.length})</Title>}
                ListEmptyComponent={<Paragraph>Aucune enquête pour le moment.</Paragraph>}
            />

            <Portal>
                <Modal visible={!!selectedPersonne} onDismiss={() => setSelectedPersonne(null)} contentContainerStyle={styles.modal}>
                    {selectedPersonne && (
                        <View>
                            <Title style={{ marginBottom: 16 }}>{selectedPersonne.nom} {selectedPersonne.prenoms}</Title>
                            <Paragraph>Sexe: {selectedPersonne.sexe}</Paragraph>
                            {selectedPersonne.date_naissance ? <Paragraph>Né(e) le: {selectedPersonne.date_naissance}</Paragraph> : null}
                            <Paragraph>Situation: {selectedPersonne.situation_matrimoniale}</Paragraph>
                            {selectedPersonne.occupation ? <Paragraph>Profession: {selectedPersonne.occupation}</Paragraph> : null}
                            {selectedPersonne.ville_village ? <Paragraph>Ville/Village: {selectedPersonne.ville_village}</Paragraph> : null}
                            {selectedPersonne.numero_telephone ? <Paragraph>Téléphone: {selectedPersonne.numero_telephone}</Paragraph> : null}

                            <CustomButton title="Fermer" onPress={() => setSelectedPersonne(null)} style={{ marginTop: 20 }} />
                        </View>
                    )}
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    card: { marginBottom: 16, backgroundColor: '#ffffff' },
    filterSection: { padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    pickerContainer: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4, marginVertical: 4, backgroundColor: '#fff' },
    modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 }
});
