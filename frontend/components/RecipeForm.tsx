import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { FormField } from './FormField';
import { useFormik, useFormSubmission } from '@/hooks/useFormik';
import { recipeSchema } from '@/utils/validationSchemas';

interface RecipeFormValues {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  cookingTime: string;
  servings: string;
  cuisine: string;
}

interface RecipeFormProps {
  onSubmit: (values: RecipeFormValues) => Promise<void>;
  initialValues?: Partial<RecipeFormValues>;
  submitButtonText?: string;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  onSubmit,
  initialValues = {},
  submitButtonText = 'Create Recipe',
}) => {
  const [formState, formActions] = useFormik<RecipeFormValues>({
    initialValues: {
      title: '',
      description: '',
      ingredients: '',
      instructions: '',
      cookingTime: '',
      servings: '',
      cuisine: '',
      ...initialValues,
    },
    validationSchema: recipeSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const { handleSubmit, isSubmitting, canSubmit } = useFormSubmission(formState, formActions);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <FormField
          label="Recipe Title"
          value={formState.values.title}
          onChangeText={(text) => formActions.setFieldValue('title', text)}
          onBlur={() => formActions.setFieldTouched('title')}
          error={formState.errors.title}
          touched={formState.touched.title}
          placeholder="Enter recipe title"
          required
        />

        <FormField
          label="Description"
          value={formState.values.description}
          onChangeText={(text) => formActions.setFieldValue('description', text)}
          onBlur={() => formActions.setFieldTouched('description')}
          error={formState.errors.description}
          touched={formState.touched.description}
          placeholder="Describe your recipe"
          multiline
          numberOfLines={3}
          required
        />

        <FormField
          label="Ingredients"
          value={formState.values.ingredients}
          onChangeText={(text) => formActions.setFieldValue('ingredients', text)}
          onBlur={() => formActions.setFieldTouched('ingredients')}
          error={formState.errors.ingredients}
          touched={formState.touched.ingredients}
          placeholder="Enter ingredients (one per line)"
          multiline
          numberOfLines={4}
          required
        />

        <FormField
          label="Instructions"
          value={formState.values.instructions}
          onChangeText={(text) => formActions.setFieldValue('instructions', text)}
          onBlur={() => formActions.setFieldTouched('instructions')}
          error={formState.errors.instructions}
          touched={formState.touched.instructions}
          placeholder="Enter cooking instructions (one per line)"
          multiline
          numberOfLines={4}
          required
        />

        <FormField
          label="Cooking Time (minutes)"
          value={formState.values.cookingTime}
          onChangeText={(text) => formActions.setFieldValue('cookingTime', text)}
          onBlur={() => formActions.setFieldTouched('cookingTime')}
          error={formState.errors.cookingTime}
          touched={formState.touched.cookingTime}
          placeholder="30"
          keyboardType="numeric"
          required
        />

        <FormField
          label="Servings"
          value={formState.values.servings}
          onChangeText={(text) => formActions.setFieldValue('servings', text)}
          onBlur={() => formActions.setFieldTouched('servings')}
          error={formState.errors.servings}
          touched={formState.touched.servings}
          placeholder="4"
          keyboardType="numeric"
          required
        />

        <FormField
          label="Cuisine"
          value={formState.values.cuisine}
          onChangeText={(text) => formActions.setFieldValue('cuisine', text)}
          onBlur={() => formActions.setFieldTouched('cuisine')}
          error={formState.errors.cuisine}
          touched={formState.touched.cuisine}
          placeholder="e.g., Italian, Mexican, Indian"
          required
        />

        <TouchableOpacity
          style={[styles.button, (!canSubmit || isSubmitting) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          <ThemedText style={styles.buttonText}>
            {isSubmitting ? 'Creating...' : submitButtonText}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
