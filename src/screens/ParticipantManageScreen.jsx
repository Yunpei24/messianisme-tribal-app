import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Title, Card, IconButton, Divider } from 'react-native-paper';
import CustomInput from '../components/shared/CustomInput';
import CustomButton from '../components/shared/CustomButton';
import OfflineIndicator from '../components/shared/OfflineIndicator';
import { getParticipants, createParticipant, updateParticipant, deleteParticipant } from '../services/participantsService';

export default function ParticipantManageScreen() {
    const [participants, setParticipants] = useState([]);
    const [nom, setNom] = useState('');
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadParticipants();
    }, []);

    const loadParticipants = async () => {
        const data = await getParticipants();
        setParticipants(data || []);
    };

    const handleSave = async () => {
        if (!nom) {
            Alert.alert('Erreur', 'Le nom est requis');
            return;
        }
        setLoading(true);
        try {
            if (editId) {
                await updateParticipant(editId, { nom });
                setEditId(null);
            } else {
                await createParticipant({ nom });
            }
            setNom('');
            await loadParticipants();
        } catch (e) {
            Alert.alert('Erreur', e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setNom(item.nom);
        setEditId(item.id);
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Confirmation",
            "Voulez-vous vraiment supprimer ce participant ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        await deleteParticipant(id);
                        await loadParticipants();
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Title
                title={item.nom}
                right={(props) => (
                    <View style={{ flexDirection: 'row' }}>
                        <IconButton {...props} icon="pencil" onPress={() => handleEdit(item)} />
                        <IconButton {...props} icon="delete" onPress={() => handleDelete(item.id)} />
                    </View>
                )}
            />
        </Card>
    );

    return (
        <View style={styles.container}>
            <OfflineIndicator />
            <FlatList
                data={participants}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListHeaderComponent={
                    <View style={styles.formContainer}>
                        <Title>{editId ? "Modifier Participant" : "Nouveau Participant"}</Title>
                        <CustomInput label="Nom (ex: Famille Saboué)" value={nom} onChangeText={setNom} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CustomButton style={{ flex: 1, marginRight: editId ? 8 : 0 }} title={editId ? "Mettre à jour" : "Ajouter"} onPress={handleSave} loading={loading} />
                            {editId && (
                                <CustomButton style={{ flex: 1 }} mode="outlined" title="Annuler" onPress={() => { setEditId(null); setNom(''); }} />
                            )}
                        </View>
                        <Divider style={styles.divider} />
                        <Title style={{ marginTop: 16 }}>Liste des Participants</Title>
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
