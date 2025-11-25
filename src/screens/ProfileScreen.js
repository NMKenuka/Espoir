import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, toggleTheme } from '../store/authSlice';
import { lightTheme, darkTheme } from '../styles/theme';

const ProfileScreen = () => {
  const dispatch = useDispatch();
    const authState = useSelector(state => state?.auth);
    const user = authState?.user;
    const isDarkMode = authState?.isDarkMode || false;
    const theme = isDarkMode ? darkTheme : lightTheme;

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.card }]}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={[styles.username, { color: theme.text }]}>
          {user?.username || 'User'}
        </Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>
          {user?.email || 'email@example.com'}
        </Text>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Settings
        </Text>

        {/* Theme Toggle */}
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={handleToggleTheme}
        >
          <View style={styles.settingContent}>
            <View style={styles.iconContainer}>
              <Text style={[styles.iconText, { color: theme.primary }]}>
                {isDarkMode ? '☀️' : '🌙'}
              </Text>
            </View>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
                {isDarkMode ? 'On' : 'Off'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: '#E50914' }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>← Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 30,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProfileScreen;
