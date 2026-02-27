import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { initDatabase } from './src/services/database';
import AppNavigator from './src/navigation/AppNavigator';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  // Forcer le thème clair pour la librairie Paper
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#1f2937',
      primary: '#2563eb',
      onSurface: '#1f2937',
      inverseOnSurface: '#ffffff',
    },
  };

  useEffect(() => {
    async function setup() {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (e) {
        console.error("Failed to init DB", e);
      }
    }
    setup();
  }, []);

  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
