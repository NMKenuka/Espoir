
// src/navigation/AppNavigator.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';

// Import screens
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetailsScreen from '../screens/DetailsScreen';

// Import actions
import { loadUser, setTheme } from '../store/authSlice';
import { loadFavorites } from '../store/favoritesSlice';
import { storageService } from '../services/storage';
import { lightTheme, darkTheme } from '../styles/theme';
import { Platform } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const isDarkMode = useSelector(state => state.auth.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.border,
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
      }}
    >
 <Tab.Screen
  name="HomeTab"
  component={HomeScreen}
  options={{
    tabBarLabel: 'Home',
    tabBarIcon: ({ color, size }) => (
      <Feather name="home" size={size} color={color} />
    ),
  }}
/>
<Tab.Screen
  name="SearchTab"
  component={SearchScreen}
  options={{
    tabBarLabel: 'Search',
    tabBarIcon: ({ color, size }) => (
      <Feather name="search" size={size} color={color} />
    ),
  }}
/>
<Tab.Screen
  name="FavoritesTab"
  component={FavoritesScreen}
  options={{
    tabBarLabel: 'Favorites',
    tabBarIcon: ({ color, size }) => (
      <Feather name="heart" size={size} color={color} />
    ),
  }}
/>
<Tab.Screen
  name="ProfileTab"
  component={ProfileScreen}
  options={{
    tabBarLabel: 'Profile',
    tabBarIcon: ({ color, size }) => (
      <Feather name="user" size={size} color={color} />
    ),
  }}
/>
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const loading = useSelector(state => state.auth.loading);
  const isDarkMode = useSelector(state => state.auth.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    // Load saved user and theme on app start
    const initializeApp = async () => {
      const savedTheme = await storageService.getTheme();
      dispatch(setTheme(savedTheme));
      dispatch(loadUser());
      dispatch(loadFavorites());
    };
    initializeApp();
  }, [dispatch]);

  if (loading) {
    return null; // Or a splash screen
  }

  

  return (
    <NavigationContainer
      theme={{
        dark: isDarkMode,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.card,
          text: theme.text,
          border: theme.border,
          notification: theme.primary,
        },
        // Provide fonts so components expecting `theme.fonts.medium`/`regular` don't crash
        fonts: {
          regular: { fontFamily: Platform.OS === 'android' ? 'sans-serif' : 'System' },
          medium: { fontFamily: Platform.OS === 'android' ? 'sans-serif-medium' : 'System' },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              options={{ title: 'Movie Details' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}