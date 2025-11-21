
// src/screens/FavoritesScreen.js
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Heart } from 'react-native-feather';
import MovieCard from '../components/MovieCard';
import { lightTheme, darkTheme } from '../styles/theme';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const favorites = useSelector(state => state.favorites.items);
  const { isDarkMode } = useSelector(state => state.auth);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movieId: movie.id });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          My Favorites
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'}
        </Text>
      </View>

      {/* Content */}
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => handleMoviePress(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.content}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Heart stroke={theme.textSecondary} width={60} height={60} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Add movies to your favorites to see them here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default FavoritesScreen;