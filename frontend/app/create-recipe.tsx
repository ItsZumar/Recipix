import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView, Alert, Image } from "react-native";
import { useRouter, router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { pickImageFromGallery, takePhoto, getRecipeImageOptions } from "@/utils/imagePicker";

import { ThemedText } from "@/components/ThemedText";
import { Header } from "@/components/Header";
import { ScreenWrapper, useScreenColors } from "@/components/ScreenWrapper";
import { InputField, ListInputField, SelectionInput, DropdownInput } from "@/components/inputs";
import { Button } from "@/components/Button";
import { ActionModal, useActionModal, ModalAction } from "@/components/ActionModal";
import { useCreateRecipe, useUpdateRecipe, useRecipe } from "@/hooks/useRecipes";
import { useRecipeStore } from "@/stores/recipeStore";
import { wp, hp } from "@/utils/responsive";
import { CUISINE_OPTIONS, PLACEHOLDER_TEXTS } from "@/constants/appConstants";

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { backgroundColor, textColor, iconColor, tintColor } = useScreenColors();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const { visible, showModal, hideModal } = useActionModal();
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    subtitle: string;
    actions: ModalAction[];
  }>({
    title: '',
    subtitle: '',
    actions: [],
  });

  // Form state
  // Cuisine options from constants
  const cuisineOptions = CUISINE_OPTIONS;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "easy" as "easy" | "medium" | "hard",
    cuisine: "",
    image: "",
  });

  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { createRecipe, loading: createLoading } = useCreateRecipe();
  const { updateRecipe, loading: updateLoading } = useUpdateRecipe();
  const { addRecipe } = useRecipeStore();

  // Fetch recipe data if in edit mode
  const { data: recipeData, loading: recipeLoading } = useRecipe(edit || "");

  const isEditMode = !!edit;
  const loading = createLoading || updateLoading || recipeLoading;

  // Populate form with existing recipe data when in edit mode
  useEffect(() => {
    if (isEditMode && recipeData?.recipe) {
      const recipe = recipeData.recipe;
      setFormData({
        title: recipe.title || "",
        description: recipe.description || "",
        prepTime: recipe.prepTime?.toString() || "",
        cookTime: recipe.cookTime?.toString() || "",
        servings: recipe.servings?.toString() || "",
        difficulty: recipe.difficulty || "easy",
        cuisine: recipe.cuisine || "",
        image: recipe.image || "",
      });

      // Set ingredients (convert from object array to string array)
      const ingredientStrings = recipe.ingredients?.map((ing: any) => ing.name) || [""];
      setIngredients(ingredientStrings.length > 0 ? ingredientStrings : [""]);

      // Set instructions
      const instructionStrings = recipe.instructions || [""];
      setInstructions(instructionStrings.length > 0 ? instructionStrings : [""]);

      // Set tags
      const tagStrings = recipe.tags || [""];
      setTags(tagStrings.length > 0 ? tagStrings : [""]);

      // Set image
      if (recipe.image) {
        setSelectedImage(recipe.image);
      }
    }
  }, [isEditMode, recipeData]);

  const handlePickImageFromGallery = async () => {
    const result = await pickImageFromGallery(getRecipeImageOptions());
    if (result) {
      setSelectedImage(result.uri);
      handleInputChange("image", result.uri);
    }
  };

  const handleTakePhoto = async () => {
    const result = await takePhoto(getRecipeImageOptions());
    if (result) {
      setSelectedImage(result.uri);
      handleInputChange("image", result.uri);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Please enter a recipe title");
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter a recipe description");
      return false;
    }
    if (!formData.cookTime || isNaN(Number(formData.cookTime))) {
      Alert.alert("Error", "Please enter a valid cooking time in minutes");
      return false;
    }
    if (!formData.servings || isNaN(Number(formData.servings))) {
      Alert.alert("Error", "Please enter a valid number of servings");
      return false;
    }
    if (!formData.cuisine.trim()) {
      Alert.alert("Error", "Please select a cuisine type");
      return false;
    }
    if (ingredients.filter((item) => item.trim()).length === 0) {
      Alert.alert("Error", "Please add at least one ingredient");
      return false;
    }
    if (instructions.filter((item) => item.trim()).length === 0) {
      Alert.alert("Error", "Please add at least one instruction");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Transform ingredients to match backend schema
      const transformedIngredients = ingredients
        .filter((item) => item.trim())
        .map((ingredient) => ({
          name: ingredient.trim(),
          amount: 1, // Default amount
          unit: "piece", // Default unit
          notes: "",
        }));

      const recipeData = {
        ...formData,
        prepTime: formData.prepTime ? Number(formData.prepTime) : undefined,
        cookTime: Number(formData.cookTime),
        servings: Number(formData.servings),
        ingredients: transformedIngredients,
        instructions: instructions.filter((item) => item.trim()),
        tags: tags.filter((item) => item.trim()),
        isPublic: true, // Default to public
        isPublished: true, // Default to published
      };

      let result: any;
      if (isEditMode && edit) {
        // Update existing recipe
        result = await updateRecipe(edit, recipeData);
        if (result) {
          const actions: ModalAction[] = [
            {
              id: 'view',
              title: 'View Recipe',
              icon: 'eye',
              onPress: () => {
                hideModal();
                router.push(`/recipe/${result.id}`);
              },
              style: 'primary',
            },
            {
              id: 'continue',
              title: 'Continue Editing',
              icon: 'pencil',
              onPress: () => {
                hideModal();
              },
              style: 'default',
            },
          ];

          setModalConfig({
            title: 'Success!',
            subtitle: 'Your recipe has been updated successfully!',
            actions,
          });
          showModal();
        } else {
          const actions: ModalAction[] = [
            {
              id: 'ok',
              title: 'OK',
              onPress: () => hideModal(),
              style: 'default',
            },
          ];

          setModalConfig({
            title: 'Error',
            subtitle: 'Failed to update recipe. Please try again.',
            actions,
          });
          showModal();
        }
      } else {
        // Create new recipe
        result = await createRecipe(recipeData);
        if (result) {
          // Add to local store for immediate UI update
          addRecipe(result);

          const actions: ModalAction[] = [
            {
              id: 'view',
              title: 'View Recipe',
              icon: 'eye',
              onPress: () => {
                hideModal();
                router.push(`/recipe/${result.id}`);
              },
              style: 'primary',
            },
            {
              id: 'create-another',
              title: 'Create Another',
              icon: 'add',
              onPress: () => {
                hideModal();
                // Reset form
                setFormData({
                  title: "",
                  description: "",
                  prepTime: "",
                  cookTime: "",
                  servings: "",
                  difficulty: "easy",
                  cuisine: "",
                  image: "",
                });
                setIngredients([""]);
                setInstructions([""]);
                setTags([""]);
                setSelectedImage(null);
              },
              style: 'default',
            },
          ];

          setModalConfig({
            title: 'Success!',
            subtitle: 'Your recipe has been created successfully!',
            actions,
          });
          showModal();
        } else {
          const actions: ModalAction[] = [
            {
              id: 'ok',
              title: 'OK',
              onPress: () => hideModal(),
              style: 'default',
            },
          ];

          setModalConfig({
            title: 'Error',
            subtitle: 'Failed to create recipe. Please try again.',
            actions,
          });
          showModal();
        }
      }
    } catch (error) {
      console.error("Recipe operation error:", error);
      const actions: ModalAction[] = [
        {
          id: 'ok',
          title: 'OK',
          onPress: () => hideModal(),
          style: 'default',
        },
      ];

      setModalConfig({
        title: 'Error',
        subtitle: `An error occurred while ${isEditMode ? 'updating' : 'creating'} the recipe.`,
        actions,
      });
      showModal();
    }
  };

  // Prepare options for selection inputs
  const difficultyOptions = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  const cuisineDropdownOptions = cuisineOptions.map((cuisine) => ({
    value: cuisine,
    label: cuisine,
  }));

  return (
    <ScreenWrapper>
      {/* Header */}
      <Header
        title={isEditMode ? "Edit Recipe" : "Create Recipe"}
        leftAccessory={{
          icon: "arrow-back",
          onPress: () => {
            // Check if we can go back, otherwise navigate to tabs
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push("/(tabs)");
            }
          },
        }}
        rightAccessory={{
          text: isEditMode ? "Update" : "Save",
          onPress: handleSubmit,
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Basic Information */}
          <View style={styles.section}>
            <InputField
              label="Recipe Title"
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
              placeholder={PLACEHOLDER_TEXTS.RECIPE_TITLE}
              required
            />

            <InputField
              label="Description"
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              placeholder={PLACEHOLDER_TEXTS.RECIPE_DESCRIPTION}
              variant="textarea"
              required
            />

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.rowInputGroup, { marginRight: wp(1) }]}>
                <InputField
                  label="Prep Time (min)"
                  value={formData.prepTime}
                  onChangeText={(value) => handleInputChange("prepTime", value)}
                  placeholder="15"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, styles.rowInputGroup, { marginHorizontal: wp(1) }]}>
                <InputField
                  label="Cook Time (min)"
                  value={formData.cookTime}
                  onChangeText={(value) => handleInputChange("cookTime", value)}
                  placeholder="30"
                  keyboardType="numeric"
                  required
                />
              </View>

              <View style={[styles.inputGroup, styles.rowInputGroup, { marginLeft: wp(1) }]}>
                <InputField
                  label="Servings"
                  value={formData.servings}
                  onChangeText={(value) => handleInputChange("servings", value)}
                  placeholder="4"
                  keyboardType="numeric"
                  required
                />
              </View>
            </View>

            <SelectionInput
              label="Difficulty"
              value={formData.difficulty}
              onValueChange={(value) => handleInputChange("difficulty", value)}
              options={difficultyOptions}
              layout="horizontal"
            />

            <DropdownInput
              label="Cuisine"
              value={formData.cuisine}
              onValueChange={(value) => handleInputChange("cuisine", value)}
              options={cuisineDropdownOptions}
              placeholder="Select cuisine type"
              searchable={true}
              required={true}
            />

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: textColor }]}>Recipe Image</ThemedText>

              {selectedImage ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => {
                      setSelectedImage(null);
                      handleInputChange("image", "");
                    }}
                  >
                    <Ionicons name="close-circle" size={wp(6)} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imageOptionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.imageOptionButton,
                      { backgroundColor: backgroundColor === "#fff" ? "#FFF8F5" : "#2a2a2a", borderColor: iconColor },
                    ]}
                    onPress={handlePickImageFromGallery}
                  >
                    <Ionicons name="images-outline" size={wp(6)} color={iconColor} />
                    <ThemedText style={[styles.imageOptionText, { color: textColor }]}>Choose from Gallery</ThemedText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.imageOptionButton,
                      { backgroundColor: backgroundColor === "#fff" ? "#FFF8F5" : "#2a2a2a", borderColor: iconColor },
                    ]}
                    onPress={handleTakePhoto}
                  >
                    <Ionicons name="camera-outline" size={wp(6)} color={iconColor} />
                    <ThemedText style={[styles.imageOptionText, { color: textColor }]}>Take Photo</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Ingredients */}
          <ListInputField title="Ingredients" items={ingredients} onItemsChange={setIngredients} placeholder="Add ingredient" required />

          {/* Instructions */}
          <ListInputField
            title="Instructions"
            items={instructions}
            onItemsChange={setInstructions}
            placeholder="Add instruction step"
            variant="numbered"
            required
          />

          {/* Tags */}
          <ListInputField title="Tags" items={tags} onItemsChange={setTags} placeholder="Add tag" />

          {/* Submit Button */}
          <Button 
            title="Create Recipe"
            variant="primary" 
            size="large" 
            loading={loading} 
            disabled={loading} 
            onPress={handleSubmit} 
            style={styles.submitButton}
          />
        </View>
      </ScrollView>

      {/* Success/Error Modal */}
      <ActionModal
        visible={visible}
        onClose={hideModal}
        title={modalConfig.title}
        subtitle={modalConfig.subtitle}
        actions={modalConfig.actions}
        showCancelButton={false}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
  form: {
    padding: wp(4),
  },
  section: {
    marginBottom: hp(3),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: hp(2),
    flex: 1,
    justifyContent: "flex-start",
  },
  rowInputGroup: {
    flex: 1,
    minHeight: hp(12),
  },
  label: {
    fontSize: wp(3.5),
    fontWeight: "500",
    marginBottom: hp(0.5),
  },
  input: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    fontSize: wp(4),
    borderWidth: 1,
    borderColor: "transparent",
  },
  textArea: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    fontSize: wp(4),
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: hp(12),
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: wp(2),
    marginBottom: hp(1),
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: wp(3),
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    borderWidth: 1,
    alignItems: "center",
  },
  difficultyText: {
    fontSize: wp(3.5),
    fontWeight: "500",
  },
  cuisineContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp(2),
  },
  cuisineButton: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(2),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: wp(20),
  },
  cuisineText: {
    fontSize: wp(3.5),
    fontWeight: "500",
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  selectedImage: {
    width: "100%",
    height: hp(20),
    borderRadius: wp(2),
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: wp(2),
    right: wp(2),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: wp(3),
  },
  imagePickerButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: wp(2),
    padding: hp(4),
    alignItems: "center",
    justifyContent: "center",
    gap: wp(2),
  },
  imagePickerText: {
    fontSize: wp(3.5),
    fontWeight: "500",
    textAlign: "center",
  },
  imageOptionsContainer: {
    flexDirection: "row",
    gap: wp(3),
  },
  imageOptionButton: {
    flex: 1,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: wp(2),
    padding: hp(2.5),
    alignItems: "center",
    justifyContent: "center",
    gap: wp(1.5),
  },
  imageOptionText: {
    fontSize: wp(3.5),
    fontWeight: "500",
    textAlign: "center",
  },
  addButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    alignItems: "center",
    justifyContent: "center",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(1.5),
    gap: wp(2),
  },
  listInput: {
    flex: 1,
  },
  removeButton: {
    width: wp(8),
    height: wp(8),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(0.5),
  },
  stepNumber: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(0.5),
  },
  stepNumberText: {
    color: "#fff",
    fontSize: wp(3.5),
    fontWeight: "600",
  },
  submitButton: {
    marginTop: hp(2),
    marginBottom: hp(4),
  },
});
