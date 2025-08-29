import React, { useState } from "react";
import { StyleSheet, ScrollView, TouchableOpacity, View, Image, Alert, Modal } from "react-native";
import { useLocalSearchParams, useRouter, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Header } from "@/components/Header";
import { useRecipe, useDeleteRecipe } from "@/hooks/useRecipes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useUser } from "@/stores/authStore";
import { wp, hp } from "@/utils/responsive";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, loading, error } = useRecipe(id || "");
  const currentUser = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const { deleteRecipe, loading: deleteLoading } = useDeleteRecipe();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  const recipe = data?.recipe;
  const isOwnRecipe = currentUser?.id === recipe?.author?.id;

  const handleEditRecipe = () => {
    setShowMenu(false);
    router.push(`/create-recipe?edit=${id}`);
  };

  const handleDeleteRecipe = () => {
    setShowMenu(false);
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipe(id || "");
              Alert.alert("Success", "Recipe deleted successfully!");
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete recipe. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleShareRecipe = () => {
    setShowMenu(false);
    // TODO: Implement share functionality
    Alert.alert("Share", "Share functionality coming soon!");
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedText style={[styles.loadingText, { color: textColor }]}>Loading recipe...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !recipe) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedText style={[styles.errorText, { color: textColor }]}>Recipe not found</ThemedText>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: iconColor }]} onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.push('/(tabs)');
          }
        }}>
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <Header
        title={recipe.title}
        leftAccessory={{
          icon: "arrow-back",
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)');
            }
          },
        }}
        rightAccessory={
          isOwnRecipe ? {
            icon: "ellipsis-horizontal",
            onPress: () => setShowMenu(true),
          } : {
            icon: "heart-outline", // TODO: Update based on favorite status
            onPress: () => {
              // TODO: Toggle favorite
            },
          }
        }
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Recipe Image */}
        <View style={styles.imageContainer}>
          {recipe.image ? (
            <Image source={{ uri: recipe.image }} style={styles.image} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: backgroundColor === "#fff" ? "#f0f0f0" : "#404040" }]}>
              <Ionicons name="restaurant" size={wp(16)} color={iconColor} />
            </View>
          )}
        </View>

        {/* Recipe Info */}
        <View style={styles.content}>
          <ThemedText type="title" style={[styles.title, { color: textColor }]}>
            {recipe.title}
          </ThemedText>

          <ThemedText style={[styles.description, { color: textColor }]}>{recipe.description}</ThemedText>

          {/* Recipe Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metadataItem}>
              <Ionicons name="time-outline" size={wp(5)} color={iconColor} />
              <ThemedText style={[styles.metadataText, { color: textColor }]}>{recipe.cookTime} minutes</ThemedText>
            </View>

            <View style={styles.metadataItem}>
              <Ionicons name="people-outline" size={wp(5)} color={iconColor} />
              <ThemedText style={[styles.metadataText, { color: textColor }]}>{recipe.servings} servings</ThemedText>
            </View>

            <View style={styles.metadataItem}>
              <Ionicons name="restaurant-outline" size={wp(5)} color={iconColor} />
              <ThemedText style={[styles.metadataText, { color: textColor }]}>{recipe.difficulty}</ThemedText>
            </View>
          </View>

          {/* Cuisine */}
          {recipe.cuisine && (
            <View style={styles.cuisineContainer}>
              <ThemedText style={[styles.cuisineLabel, { color: iconColor }]}>Cuisine:</ThemedText>
              <ThemedText style={[styles.cuisineText, { color: textColor }]}>{recipe.cuisine}</ThemedText>
            </View>
          )}

          {/* Author */}
          {recipe.author && (
            <TouchableOpacity 
              style={styles.authorContainer} 
              onPress={() => router.push(`/user/${recipe.author!.id}`)}
            >
              <View style={styles.authorInfo}>
                {recipe.author.avatar ? (
                  <Image source={{ uri: recipe.author.avatar }} style={styles.authorAvatar} />
                ) : (
                  <View style={[styles.authorAvatarPlaceholder, { backgroundColor: iconColor }]}>
                    <Ionicons name="person" size={wp(4)} color="#fff" />
                  </View>
                )}
                <View style={styles.authorDetails}>
                  <ThemedText style={[styles.authorLabel, { color: iconColor }]}>Created by</ThemedText>
                  <ThemedText style={[styles.authorName, { color: textColor }]}>
                    {recipe.author.username}
                  </ThemedText>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={wp(4)} color={iconColor} />
            </TouchableOpacity>
          )}

          {/* Ingredients */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
              Ingredients
            </ThemedText>
            {recipe.ingredients.map((ingredient: any, index: number) => (
              <View key={index} style={styles.ingredientItem}>
                <View style={[styles.bullet, { backgroundColor: iconColor }]} />
                <ThemedText style={[styles.ingredientText, { color: textColor }]}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                  {ingredient.notes && ` (${ingredient.notes})`}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
              Instructions
            </ThemedText>
            {recipe.instructions.map((instruction: string, index: number) => (
              <View key={index} style={styles.instructionItem}>
                <View style={[styles.stepNumber, { backgroundColor: iconColor }]}>
                  <ThemedText style={styles.stepNumberText}>{index + 1}</ThemedText>
                </View>
                <ThemedText style={[styles.instructionText, { color: textColor }]}>{instruction}</ThemedText>
              </View>
            ))}
          </View>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                Tags
              </ThemedText>
              <View style={styles.tagsContainer}>
                {recipe.tags.map((tag: string, index: number) => (
                  <View key={index} style={[styles.tag, { backgroundColor: backgroundColor === "#fff" ? "#f0f0f0" : "#404040" }]}>
                    <ThemedText style={[styles.tagText, { color: textColor }]}>{tag}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Recipe Actions Menu */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <ThemedView style={[styles.menuContainer, { backgroundColor }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleEditRecipe}
            >
              <Ionicons name="pencil" size={wp(5)} color={iconColor} />
              <ThemedText style={[styles.menuItemText, { color: textColor }]}>
                Edit Recipe
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleShareRecipe}
            >
              <Ionicons name="share-outline" size={wp(5)} color={iconColor} />
              <ThemedText style={[styles.menuItemText, { color: textColor }]}>
                Share Recipe
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.deleteMenuItem]}
              onPress={handleDeleteRecipe}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <Ionicons name="hourglass-outline" size={wp(5)} color="#FF3B30" />
              ) : (
                <Ionicons name="trash-outline" size={wp(5)} color="#FF3B30" />
              )}
              <ThemedText style={[styles.menuItemText, { color: "#FF3B30" }]}>
                {deleteLoading ? "Deleting..." : "Delete Recipe"}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowMenu(false)}
            >
              <ThemedText style={[styles.cancelButtonText, { color: textColor }]}>
                Cancel
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: wp(6),
  },
  backButton: {
    padding: wp(2),
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: hp(31),
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: wp(4),
  },
  title: {
    marginBottom: hp(1),
  },
  description: {
    fontSize: wp(4),
    lineHeight: hp(3),
    marginBottom: hp(2),
    opacity: 0.8,
  },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: hp(3),
    paddingVertical: hp(2),
    backgroundColor: "#f8f9fa",
    borderRadius: wp(3),
  },
  metadataItem: {
    alignItems: "center",
    gap: hp(0.5),
  },
  metadataText: {
    fontSize: wp(3.5),
    fontWeight: "500",
  },
  cuisineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(3),
    gap: wp(2),
  },
  cuisineLabel: {
    fontSize: wp(3.5),
    fontWeight: "600",
  },
  cuisineText: {
    fontSize: wp(3.5),
    fontStyle: "italic",
  },
  section: {
    marginBottom: hp(3),
  },
  sectionTitle: {
    marginBottom: hp(1.5),
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(1),
    gap: wp(3),
  },
  bullet: {
    width: wp(1.5),
    height: wp(1.5),
    borderRadius: wp(0.75),
    marginTop: hp(1),
  },
  ingredientText: {
    flex: 1,
    fontSize: wp(4),
    lineHeight: hp(3),
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(2),
    gap: wp(3),
  },
  stepNumber: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(0.25),
  },
  stepNumberText: {
    color: "#fff",
    fontSize: wp(3),
    fontWeight: "600",
  },
  instructionText: {
    flex: 1,
    fontSize: wp(4),
    lineHeight: hp(3),
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
  },
  tag: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.75),
    borderRadius: wp(4),
  },
  tagText: {
    fontSize: wp(3),
    fontWeight: "500",
  },
  loadingText: {
    fontSize: wp(4),
    textAlign: "center",
    marginTop: hp(6),
  },
  errorText: {
    fontSize: wp(4),
    textAlign: "center",
    marginTop: hp(6),
  },
  backButtonText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "600",
    textAlign: "center",
    marginTop: hp(2),
    padding: hp(1.5),
    borderRadius: wp(2),
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp(3),
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
  },
  authorAvatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
  },
  authorAvatarPlaceholder: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignItems: "center",
    justifyContent: "center",
  },
  authorDetails: {
    flex: 1,
  },
  authorLabel: {
    fontSize: wp(3),
    marginBottom: hp(0.25),
  },
  authorName: {
    fontSize: wp(4),
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: wp(80),
    borderRadius: wp(3),
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
    marginBottom: hp(1),
    gap: wp(3),
  },
  menuItemText: {
    fontSize: wp(4),
    fontWeight: '500',
  },
  deleteMenuItem: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: hp(1),
    paddingTop: hp(2),
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: hp(2),
    marginTop: hp(1),
    borderRadius: wp(2),
  },
  cancelButtonText: {
    fontSize: wp(4),
    fontWeight: '600',
  },
});
