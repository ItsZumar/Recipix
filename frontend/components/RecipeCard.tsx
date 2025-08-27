import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Recipe } from '@/types/graphql';
import { wp, hp } from '@/utils/responsive';
import { useRouter } from 'expo-router';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorited?: boolean;
  showFavoriteButton?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onPress, 
  onFavoritePress, 
  isFavorited = false, 
  showFavoriteButton = false 
}) => {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return iconColor;
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'leaf';
      case 'medium':
        return 'flame';
      case 'hard':
        return 'trophy';
      default:
        return 'restaurant';
    }
  };

  // Handle missing or invalid recipe data
  if (!recipe) {
    return null;
  }



  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {recipe.image ? (
          <Image source={{ uri: recipe.image }} style={styles.image} />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: backgroundColor === '#fff' ? '#f0f0f0' : '#404040' }]}>
            <Ionicons name="restaurant" size={wp(8)} color={iconColor} />
          </View>
        )}
        <View style={styles.overlay}>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(recipe.difficulty) }]}>
            <Ionicons name={getDifficultyIcon(recipe.difficulty) as any} size={wp(3)} color="#fff" />
            <ThemedText style={styles.difficultyText}>{recipe.difficulty}</ThemedText>
          </View>
          
          {showFavoriteButton && onFavoritePress && (
            <TouchableOpacity
              style={[styles.favoriteButton, { backgroundColor: isFavorited ? '#FF3B30' : 'rgba(0, 0, 0, 0.5)' }]}
              onPress={onFavoritePress}
            >
              <Ionicons 
                name={isFavorited ? "heart" : "heart-outline"} 
                size={wp(4)} 
                color="#fff" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {recipe.title}
        </ThemedText>
        
        <ThemedText style={[styles.description, { color: iconColor }]} numberOfLines={2}>
          {recipe.description}
        </ThemedText>
        
        <View style={styles.metadata}>
          <View style={styles.metadataItem}>
            <Ionicons name="time-outline" size={wp(3.5)} color={iconColor} />
            <ThemedText style={[styles.metadataText, { color: iconColor }]}>
              {recipe.cookTime} min
            </ThemedText>
          </View>
          
          <View style={styles.metadataItem}>
            <Ionicons name="people-outline" size={wp(3.5)} color={iconColor} />
            <ThemedText style={[styles.metadataText, { color: iconColor }]}>
              {recipe.servings} servings
            </ThemedText>
          </View>
        </View>
        
        {recipe.cuisine && (
          <View style={styles.cuisineContainer}>
            <ThemedText style={[styles.cuisineText, { color: iconColor }]}>
              {recipe.cuisine}
            </ThemedText>
          </View>
        )}
        

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: wp(4),
    marginHorizontal: wp(2),
    marginVertical: hp(0.5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: hp(20),
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: hp(1.5),
    right: wp(3),
    flexDirection: 'row',
    gap: wp(2),
  },
  favoriteButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(3),
    gap: wp(1),
  },
  difficultyText: {
    color: '#fff',
    fontSize: wp(2.5),
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  content: {
    padding: wp(4),
  },
  title: {
    fontSize: wp(4),
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  description: {
    fontSize: wp(3.5),
    marginBottom: hp(1.5),
    lineHeight: hp(2.5),
  },
  metadata: {
    flexDirection: 'row',
    gap: wp(4),
    marginBottom: hp(1),
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  metadataText: {
    fontSize: wp(3),
  },
  cuisineContainer: {
    alignSelf: 'flex-start',
  },
  cuisineText: {
    fontSize: wp(3),
    fontStyle: 'italic',
  },

});
