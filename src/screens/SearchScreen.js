// src/screens/SearchScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Search, X } from 'react-native-feather';
import { searchMovies, clearSearch } from '../store/moviesSlice';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { lightTheme, darkTheme } from '../styles/theme';

const SearchScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
    const moviesState = useSelector(state => state?.movies);
    const searchResults = moviesState?.searchResults || [];
    const searchLoading = moviesState?.searchLoading || false;
  
    const authState = useSelector(state => state?.auth);
    const isDarkMode = authState?.isDarkMode || false;
    const theme = isDarkMode ? darkTheme : lightTheme;

  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(searchMovies(query));
    }
  };

  const handleClear = () => {
    setQuery('');
    dispatch(clearSearch());
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movieId: movie.id });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Search Movies
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Search stroke={theme.textSecondary} width={20} height={20} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search for movies..."
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <X stroke={theme.textSecondary} width={20} height={20} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: theme.primary }]}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {searchLoading ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Searching...
            </Text>
          </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={() => handleMoviePress(item)}
            />
          )}
            keyExtractor={(item) => item.id?.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.content}
        />
      ) : query.length > 0 ? (
        <View style={styles.emptyContainer}>
          <Search stroke={theme.textSecondary} width={60} height={60} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No results found for "{query}"
          </Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Search stroke={theme.textSecondary} width={60} height={60} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Search for your favorite movies
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
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  searchButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default SearchScreen;