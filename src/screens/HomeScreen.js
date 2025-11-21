
// src/screens/HomeScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchTrending, fetchPopular } from '../store/moviesSlice';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { lightTheme, darkTheme } from '../styles/theme';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { trending, popular, loading } = useSelector(state => state.movies);
  const { user, isDarkMode } = useSelector(state => state.auth);
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = () => {
    dispatch(fetchTrending());
    dispatch(fetchPopular());
  };

  const handleMoviePress = (movie) => {
    navigation.navigate('Details', { movieId: movie.id });
  };

  const renderSection = (title, data) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        {title}
      </Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => handleMoviePress(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </View>
  );

  if (loading && trending.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Text style={[styles.headerTitle, { color: theme.primary }]}>
          StreamBox
        </Text>
        <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>
          Welcome, {user?.username}!
        </Text>
      </View>

      {/* Content */}
      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <>
            {renderSection('Trending Now', trending.slice(0, 10))}
            {renderSection('Popular Movies', popular.slice(0, 10))}
          </>
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadMovies}
            tintColor={theme.primary}
          />
        }
        contentContainerStyle={styles.content}
      />
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
  welcomeText: {
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default HomeScreen;