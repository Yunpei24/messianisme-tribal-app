import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import { useOffline } from '../hooks/useOffline';
import OfflineIndicator from '../components/shared/OfflineIndicator';
import CustomButton from '../components/shared/CustomButton';
import { getSessions } from '../services/sessionsService';
import { getParticipants } from '../services/participantsService';
import { getPersonnes } from '../services/personnesService';

export default function HomeScreen({ navigation }) {
    const { isOnline, queueCount, lastSync, syncNow, isSyncing } = useOffline();
    const [stats, setStats] = useState({ sessions: 0, participants: 0, personnes: 0 });

    useEffect(() => {
        loadStats();
        const unsubscribe = navigation.addListener('focus', () => {
            loadStats();
        });
        return unsubscribe;
    }, [navigation]);

    const loadStats = async () => {
        try {
            const sessions = await getSessions();
            const participants = await getParticipants();
            const personnes = await getPersonnes();
            setStats({
                sessions: sessions?.length || 0,
                participants: participants?.length || 0,
                personnes: personnes?.length || 0
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <View style={styles.container}>
            <OfflineIndicator />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Title style={styles.title}>Tableau de bord</Title>

                <View style={styles.statsContainer}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title>{stats.sessions}</Title>
                            <Paragraph>Sessions</Paragraph>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title>{stats.participants}</Title>
                            <Paragraph>Participants</Paragraph>
                        </Card.Content>
                    </Card>
                    <Card style={[styles.card, styles.fullWidthCard]}>
                        <Card.Content>
                            <Title>{stats.personnes}</Title>
                            <Paragraph>Personnes Témoignées</Paragraph>
                        </Card.Content>
                    </Card>
                </View>

                <Card style={styles.syncCard}>
                    <Card.Content>
                        <Title>État de la synchronisation</Title>
                        <Paragraph>Réseau: {isOnline ? 'En ligne' : 'Hors ligne'}</Paragraph>
                        <Paragraph>En attente: {queueCount} élément(s)</Paragraph>
                        {lastSync && <Paragraph>Dernière sync: {new Date(lastSync).toLocaleString()}</Paragraph>}
                        <CustomButton
                            title="Synchroniser"
                            onPress={syncNow}
                            loading={isSyncing}
                            disabled={!isOnline || isSyncing}
                            icon="sync"
                        />
                    </Card.Content>
                </Card>

                <View style={styles.actionsContainer}>
                    <CustomButton title="Nouvelle Session" onPress={() => navigation.navigate('Sessions')} />
                    <CustomButton title="Nouveau Participant" onPress={() => navigation.navigate('Participants')} mode="outlined" />
                    <CustomButton title="Faire une enquête" onPress={() => navigation.navigate('Enquête')} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    scroll: { padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1f2937' },
    statsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
    card: { width: '48%', marginBottom: 16, backgroundColor: '#ffffff' },
    fullWidthCard: { width: '100%' },
    syncCard: { marginBottom: 24, backgroundColor: '#e0e7ff' },
    actionsContainer: { marginTop: 8 }
});
