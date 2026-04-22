import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Colors, FontSize } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';
import type { RootStackParamList, MainTabParamList } from '../types';

import AuthScreen from '../screens/auth/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import AIChatScreen from '../screens/AIChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import ReserveScreen from '../screens/ReserveScreen';
import OwnerPanelScreen from '../screens/OwnerPanelScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} /> }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" label="Explore" focused={focused} /> }}
      />
      <Tab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="✨" label="AI" focused={focused} /> }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedPlaceholder}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="❤️" label="Saved" focused={focused} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

function SavedPlaceholder() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderEmoji}>❤️</Text>
      <Text style={styles.placeholderText}>Saved restaurants</Text>
      <Text style={styles.placeholderSub}>Coming soon</Text>
    </View>
  );
}

export default function AppNavigator() {
  const { user, appUser, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const isOwner = appUser?.role === 'owner';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen
              name="MainTabs"
              component={isOwner ? OwnerPanelScreen : MainTabs}
            />
            <Stack.Screen
              name="RestaurantDetail"
              component={RestaurantDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Reserve"
              component={ReserveScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg },
  tabBar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 8,
  },
  tabItem: { alignItems: 'center', paddingTop: 8, minWidth: 44 },
  tabEmoji: { fontSize: 22 },
  tabLabel: { fontSize: FontSize.xs, marginTop: 2, color: Colors.hint },
  tabLabelActive: { color: Colors.primary, fontWeight: '600' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg },
  placeholderEmoji: { fontSize: 48, marginBottom: 12 },
  placeholderText: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text },
  placeholderSub: { fontSize: FontSize.sm, color: Colors.sub, marginTop: 4 },
});
