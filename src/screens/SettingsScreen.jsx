import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Title, Card, Paragraph } from 'react-native-paper';
import CustomButton from '../components/shared/CustomButton';
import { useOffline } from '../hooks/useOffline';
import { getDb } from '../services/database';
import OfflineIndicator from '../components/shared/OfflineIndicator';

export default function SettingsScreen() {
    const { syncNow, isSyncing, lastSync, queueCount } = useOffline();

    const handleClearCache = async () => {
        Alert.alert(
            "Vider le cache",
            "Attention, cela supprimera toutes les données locales non synchronisées. Continuer ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Vider", style: "destructive",
                    onPress: async () => {
                        const db = getDb();
                        if (db) {
                            await db.execAsync(`
                                DELETE FROM local_personnes;
                                DELETE FROM local_participants;
                                DELETE FROM local_sessions;
                                DELETE FROM sync_queue;
                            `);
                            Alert.alert('Succès', 'Cache vidé');
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <OfflineIndicator />
            <View style={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Synchronisation</Title>
                        <Paragraph>Éléments en attente: {queueCount}</Paragraph>
                        {lastSync && <Paragraph>Dernière sync: {new Date(lastSync).toLocaleString()}</Paragraph>}
                        <CustomButton title="Forcer la synchronisation" onPress={syncNow} loading={isSyncing} />
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Base de données locale</Title>
                        <Paragraph>En cas de problème technique uniquement.</Paragraph>
                        <CustomButton title="Vider le cache local" mode="outlined" onPress={handleClearCache} />
                    </Card.Content>
                </Card>

                <View style={{ alignItems: 'center', marginTop: 24 }}>
                    <Paragraph style={{ color: 'gray' }}>Messianisme Tribal MVP v1.0</Paragraph>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    content: { padding: 16 },
    card: { marginBottom: 16, backgroundColor: '#ffffff' }
});
