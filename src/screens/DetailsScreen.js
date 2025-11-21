
import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Heart, Calendar, Clock } from 'react-native-feather';
import { fetchMovieDetails } from '../store/moviesSlice';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { movieAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { lightTheme, darkTheme } from '../styles/theme';

const { width } = Dimensions.get('window');

const DetailsScreen = ({ route }) => {
  const { movieId } = route.params;
  const dispatch = useDispatch();
  const { selectedMovie } = useSelector(state => state.movies);
  const favorites = useSelector(state => state.favorites.items);
  const { isDarkMode } = useSelector(state => state.auth);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const isFavorite = favorites.some(item => item.id === movieId);

  useEffect(() => {
    dispatch(fetchMovieDetails(movieId));
  }, [movieId]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(movieId));
    } else {
      dispatch(addFavorite(selectedMovie));
    }
  };

  if (!selectedMovie) {
    return <LoadingSpinner />;
  }

  const imageUrl = movieAPI.getImageUrl(selectedMovie.poster_path);
  const backdropUrl = movieAPI.getImageUrl(selectedMovie.backdrop_path);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Backdrop Image */}
      <Image
        source={{ uri: backdropUrl }}
        style={styles.backdrop}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Poster and Basic Info */}
        <View style={styles.topSection}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.basicInfo}>
            <Text style={[styles.title, { color: theme.text }]}>
              {selectedMovie.title}
            </Text>
            
            <View style={styles.infoRow}>
              <Star width={16} height={16} fill="#FFD700" stroke="#FFD700" />
              <Text style={[styles.rating, { color: theme.text }]}>
                {selectedMovie.vote_average?.toFixed(1)} / 10
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Calendar width={16} height={16} stroke={theme.textSecondary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                {selectedMovie.release_date}
              </Text>
            </View>

            {selectedMovie.runtime && (
              <View style={styles.infoRow}>
                <Clock width={16} height={16} stroke={theme.textSecondary} />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                  {selectedMovie.runtime} min
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Favorite Button */}
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            {
              backgroundColor: isFavorite ? theme.primary : theme.card,
            },
          ]}
          onPress={handleFavoriteToggle}
        >
          <Heart
            width={20}
            height={20}
            fill={isFavorite ? '#FFF' : 'none'}
            stroke={isFavorite ? '#FFF' : theme.text}
          />
          <Text style={[styles.favoriteText, { color: isFavorite ? '#FFF' : theme.text }]}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>

        {/* Genres */}
        {selectedMovie.genres && selectedMovie.genres.length > 0 && (
          <View style={styles.genresContainer}>
            {selectedMovie.genres.map((genre) => (
              <View
                key={genre.id}
                style={[styles.genreChip, { backgroundColor: theme.card }]}
              >
                <Text style={[styles.genreText, { color: theme.text }]}>
                  {genre.name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Overview
          </Text>
          <Text style={[styles.overview, { color: theme.textSecondary }]}>
            {selectedMovie.overview}
          </Text>
        </View>

        {/* Additional Info */}
        {selectedMovie.tagline && (
          <View style={styles.section}>
            <Text style={[styles.tagline, { color: theme.primary }]}>
              "{selectedMovie.tagline}"
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    width: width,
    height: 250,
    backgroundColor: '#333',
  },
  content: {
    padding: 16,
  },
  topSection: {
    flexDirection: 'row',
    marginTop: -80,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  basicInfo: {
    flex: 1,
    marginLeft: 16,
    marginTop: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 6,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  favoriteText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  overview: {
    fontSize: 14,
    lineHeight: 22,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default DetailsScreen;