import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Title, Card } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/shared/CustomInput';
import CustomButton from '../components/shared/CustomButton';
import OfflineIndicator from '../components/shared/OfflineIndicator';
import { getSessions } from '../services/sessionsService';
import { getParticipants } from '../services/participantsService';
import { createPersonne } from '../services/personnesService';

export default function EnqueteScreen({ navigation }) {
    const [sessions, setSessions] = useState([]);
    const [participants, setParticipants] = useState([]);

    const [sessionId, setSessionId] = useState('');
    const [participantId, setParticipantId] = useState('');
    const [nom, setNom] = useState('');
    const [prenoms, setPrenoms] = useState('');
    const [sexe, setSexe] = useState('Homme');
    const [situation, setSituation] = useState('Célibataire');
    const [ville, setVille] = useState('');
    const [telephone, setTelephone] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [occupation, setOccupation] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const s = await getSessions();
        const p = await getParticipants();
        setSessions(s || []);
        setParticipants(p || []);
        if (s && s.length > 0) setSessionId(s[0].id);
        if (p && p.length > 0) setParticipantId(p[0].id);
    };

    const handleSave = async (reset = false) => {
        if (!sessionId || !participantId || !nom || !prenoms) {
            Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
            return;
        }

        setLoading(true);
        try {
            await createPersonne({
                session_id: sessionId,
                participant_id: participantId,
                nom,
                prenoms,
                sexe,
                situation_matrimoniale: situation,
                ville_village: ville,
                numero_telephone: telephone,
                date_naissance: dateNaissance,
                occupation: occupation
            });

            Alert.alert('Succès', 'Enquête enregistrée avec succès');

            if (reset) {
                setNom('');
                setPrenoms('');
                setVille('');
                setTelephone('');
                setSituation('Célibataire');
                setDateNaissance('');
                setOccupation('');
            } else {
                navigation.goBack();
            }
        } catch (e) {
            Alert.alert('Erreur', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <OfflineIndicator />
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Contexte de l'enquête</Title>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={sessionId} onValueChange={setSessionId} style={{ color: '#1f2937' }}>
                                <Picker.Item label="-- Sélectionner une session --" value="" color="#1f2937" />
                                {sessions.map(s => <Picker.Item key={s.id} label={s.localite_activite} value={s.id} color="#1f2937" />)}
                            </Picker>
                        </View>
                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={participantId} onValueChange={setParticipantId} style={{ color: '#1f2937' }}>
                                <Picker.Item label="-- Messi Tribal --" value="" color="#1f2937" />
                                {participants.map(p => <Picker.Item key={p.id} label={p.nom} value={p.id} color="#1f2937" />)}
                            </Picker>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Informations de la personne</Title>
                        <CustomInput label="Nom *" value={nom} onChangeText={setNom} />
                        <CustomInput label="Prénoms *" value={prenoms} onChangeText={setPrenoms} />

                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={sexe} onValueChange={setSexe} style={{ color: '#1f2937' }}>
                                <Picker.Item label="Homme" value="Homme" color="#1f2937" />
                                <Picker.Item label="Femme" value="Femme" color="#1f2937" />
                            </Picker>
                        </View>

                        <View style={styles.pickerContainer}>
                            <Picker selectedValue={situation} onValueChange={setSituation} style={{ color: '#1f2937' }}>
                                <Picker.Item label="Célibataire" value="Célibataire" color="#1f2937" />
                                <Picker.Item label="Marié(e)" value="Marié(e)" color="#1f2937" />
                                <Picker.Item label="Divorcé(e)" value="Divorcé(e)" color="#1f2937" />
                                <Picker.Item label="Veuf(ve)" value="Veuf(ve)" color="#1f2937" />
                            </Picker>
                        </View>

                        <CustomInput label="Date de naissance (ex: 1990-01-01)" value={dateNaissance} onChangeText={setDateNaissance} />
                        <CustomInput label="Occupation / Profession" value={occupation} onChangeText={setOccupation} />
                        <CustomInput label="Ville / Village" value={ville} onChangeText={setVille} />
                        <CustomInput label="Téléphone" value={telephone} onChangeText={setTelephone} keyboardType="phone-pad" />

                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Enregistrer"
                                onPress={() => handleSave(false)}
                                loading={loading}
                                style={{ flex: 1, marginRight: 8 }}
                            />
                            <CustomButton
                                title="Sauver & Nouveau"
                                onPress={() => handleSave(true)}
                                mode="outlined"
                                loading={loading}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    scroll: { padding: 16, paddingBottom: 150 },
    card: { marginBottom: 16, backgroundColor: '#ffffff' },
    pickerContainer: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 4, marginVertical: 8, backgroundColor: '#fff' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }
});
