import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const CustomButton = ({ mode = 'contained', title, onPress, style, loading, disabled, icon }) => {
    return (
        <Button
            mode={mode}
            onPress={onPress}
            style={[styles.button, style]}
            loading={loading}
            disabled={disabled}
            icon={icon}
            buttonColor={mode === 'contained' ? '#2563eb' : undefined}
            textColor={mode !== 'contained' ? '#2563eb' : 'white'}
        >
            {title}
        </Button>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 8,
        borderRadius: 8,
    }
});

export default CustomButton;
