import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const OfflineIndicator = () => {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    if (!isOffline) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Mode Hors Ligne</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ef4444',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default OfflineIndicator;
