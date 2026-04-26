import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { colors } from '../constants/theme';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import AIChatScreen from '../screens/AIChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import OwnerPanelScreen from '../screens/OwnerPanelScreen';

export type RootStackParamList = {
  Main: undefined;
  RestaurantDetail: { restaurantId: string };
  Login: undefined;
  OwnerPanel: undefined;
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  AI: undefined;
  Saved: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function SavedScreen() {
  return null;
}

function TabIcon({ label, active }: { label: string; active: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠', Explore: '🔍', AI: '✨', Saved: '❤️', Profile: '👤',
  };
  return <Text style={{ fontSize: 20 }}>{icons[label] ?? '●'}</Text>;
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} active={focused} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="AI" component={AIChatScreen} />
      <Tab.Screen name="Saved" component={SavedScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
        <Stack.Screen name="OwnerPanel" component={OwnerPanelScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
