import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

// Screens imports (we will create them next)
import HomeScreen from '../screens/HomeScreen';
import SessionConfigScreen from '../screens/SessionConfigScreen';
import ParticipantManageScreen from '../screens/ParticipantManageScreen';
import EnqueteScreen from '../screens/EnqueteScreen';
import PersonnesListScreen from '../screens/PersonnesListScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Accueil') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Sessions') {
                        iconName = focused ? 'calendar-multiple' : 'calendar-multiple';
                    } else if (route.name === 'Participants') {
                        iconName = focused ? 'account-group' : 'account-group-outline';
                    } else if (route.name === 'Enquête') {
                        iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
                    } else if (route.name === 'Liste') {
                        iconName = focused ? 'format-list-bulleted' : 'format-list-bulleted';
                    } else if (route.name === 'Paramètres') {
                        iconName = focused ? 'cog' : 'cog-outline';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: 'gray',
                headerShown: true, // Show header automatically based on tab
            })}
        >
            <Tab.Screen name="Accueil" component={HomeScreen} />
            <Tab.Screen name="Sessions" component={SessionConfigScreen} />
            <Tab.Screen name="Participants" component={ParticipantManageScreen} />
            <Tab.Screen name="Enquête" component={EnqueteScreen} />
            <Tab.Screen name="Liste" component={PersonnesListScreen} />
            <Tab.Screen name="Paramètres" component={SettingsScreen} />
        </Tab.Navigator>
    );
}
