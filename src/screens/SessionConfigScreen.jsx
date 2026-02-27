import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Title, Card, Paragraph, IconButton, Divider } from 'react-native-paper';
import CustomInput from '../components/shared/CustomInput';
import CustomButton from '../components/shared/CustomButton';
import OfflineIndicator from '../components/shared/OfflineIndicator';
import { getSessions, createSession, updateSession, deleteSession } from '../services/sessionsService';

export default function SessionConfigScreen() {
    const [sessions, setSessions] = useState([]);
    const [localite, setLocalite] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        const data = await getSessions();
        setSessions(data || []);
    };

    const handleSave = async () => {
        if (!localite || !dateDebut || !dateFin) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }
        setLoading(true);
        try {
            if (editId) {
                await updateSession(editId, {
                    localite_activite: localite,
                    date_debut: dateDebut,
                    date_fin: dateFin,
                });
                setEditId(null);
                Alert.alert('Succès', 'Session mise à jour avec succès');
            } else {
                await createSession({
                    localite_activite: localite,
                    date_debut: dateDebut,
                    date_fin: dateFin,
                });
                Alert.alert('Succès', 'Session créée avec succès');
            }
            setLocalite('');
            setDateDebut('');
            setDateFin('');
            await loadSessions();
        } catch (e) {
            Alert.alert('Erreur', e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setLocalite(item.localite_activite);
        setDateDebut(item.date_debut);
        setDateFin(item.date_fin);
        setEditId(item.id);
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment supprimer cette session ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        await deleteSession(id);
                        await loadSessions();
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>{item.localite_activite}</Title>
                <Paragraph>Du: {item.date_debut} Au: {item.date_fin}</Paragraph>
            </Card.Content>
            <Card.Actions>
                <IconButton icon="account-plus" onPress={() => Alert.alert('Information', "La liaison se fait automatiquement lorsque vous sélectionnez ce participant pendant une Nouvelle Enquête dans l'onglet Enquête.")} />
                <IconButton icon="pencil" onPress={() => handleEdit(item)} />
                <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
            </Card.Actions>
        </Card>
    );

    return (
        <View style={styles.container}>
            <OfflineIndicator />
            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={renderItem}
                ListHeaderComponent={
                    <View style={styles.formContainer}>
                        <Title>{editId ? "Modifier Session" : "Nouvelle Session"}</Title>
                        <CustomInput label="Localité de l'activité" value={localite} onChangeText={setLocalite} />
                        <CustomInput label="Date de début (YYYY-MM-DD)" value={dateDebut} onChangeText={setDateDebut} />
                        <CustomInput label="Date de fin (YYYY-MM-DD)" value={dateFin} onChangeText={setDateFin} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                            <CustomButton style={{ flex: 1, marginRight: editId ? 8 : 0 }} title={editId ? "Mettre à jour" : "Créer Session"} onPress={handleSave} loading={loading} />
                            {editId && (
                                <CustomButton style={{ flex: 1 }} mode="outlined" title="Annuler" onPress={() => {
                                    setEditId(null);
                                    setLocalite('');
                                    setDateDebut('');
                                    setDateFin('');
                                }} />
                            )}
                        </View>
                        <Divider style={styles.divider} />
                        <Title style={{ marginTop: 16 }}>Sessions existantes</Title>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    formContainer: { padding: 16, backgroundColor: '#ffffff', marginBottom: 16 },
    divider: { marginVertical: 16 },
    card: { marginHorizontal: 16, marginVertical: 8, backgroundColor: '#ffffff' }
});
