import React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';

const CustomInput = ({ label, value, onChangeText, error, secureTextEntry, keyboardType, style, right, placeholder }) => {
    return (
        <View style={[styles.container, style]}>
            <TextInput
                mode="outlined"
                label={label}
                value={value}
                onChangeText={onChangeText}
                error={!!error}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                style={styles.input}
                outlineColor="#e5e7eb"
                activeOutlineColor="#2563eb"
                textColor="#1f2937"
                right={right}
                placeholder={placeholder}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        width: '100%',
    },
    input: {
        backgroundColor: '#ffffff',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    }
});

export default CustomInput;
