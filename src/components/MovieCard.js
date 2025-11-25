
// src/components/MovieCard.js
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Star } from 'react-native-feather';
import { movieAPI } from '../services/api';
import { lightTheme, darkTheme } from '../styles/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const MovieCard = ({ movie, onPress }) => {
  const authState = useSelector(state => state?.auth);
  const isDarkMode = authState?.isDarkMode || false;
  const theme = isDarkMode ? darkTheme : lightTheme;

  const imageUrl = movieAPI.getImageUrl(movie?.poster_path);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text
          style={[styles.title, { color: theme.text }]}
          numberOfLines={2}
        >
          {movie?.title}
        </Text>
        <View style={styles.ratingContainer}>
          <Star
            width={14}
            height={14}
            fill="#FFD700"
            stroke="#FFD700"
          />
          <Text style={[styles.rating, { color: theme.textSecondary }]}>
            {movie?.vote_average?.toFixed(1)}
          </Text>
        </View>
        <Text style={[styles.year, { color: theme.textSecondary }]}>
          {movie?.release_date?.split('-')[0]}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    backgroundColor: '#333',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  year: {
    fontSize: 11,
  },
});

export default MovieCard;