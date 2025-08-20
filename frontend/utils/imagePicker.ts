import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface ImagePickerOptions {
  aspect?: [number, number];
  quality?: number;
  allowsEditing?: boolean;
  mediaTypes?: ImagePicker.MediaTypeOptions;
}

export interface ImagePickerResult {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
}

const defaultOptions: ImagePickerOptions = {
  aspect: [16, 9],
  quality: 0.8,
  allowsEditing: true,
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
};

/**
 * Pick an image from the device gallery
 */
export const pickImageFromGallery = async (
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult | null> => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return null;
    }

    // Launch image picker with merged options
    const pickerOptions = { ...defaultOptions, ...options };
    const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type,
      };
    }

    return null;
  } catch (error) {
    console.error('Error picking image from gallery:', error);
    Alert.alert('Error', 'Failed to pick image. Please try again.');
    return null;
  }
};

/**
 * Take a photo using the device camera
 */
export const takePhoto = async (
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult | null> => {
  try {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera permissions to make this work!');
      return null;
    }

    // Launch camera with merged options
    const pickerOptions = { ...defaultOptions, ...options };
    const result = await ImagePicker.launchCameraAsync(pickerOptions);

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        type: asset.type,
      };
    }

    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Error', 'Failed to take photo. Please try again.');
    return null;
  }
};

/**
 * Show image picker options (gallery or camera)
 */
export const showImagePickerOptions = async (
  options: ImagePickerOptions = {}
): Promise<ImagePickerResult | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await pickImageFromGallery(options);
            resolve(result);
          },
        },
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await takePhoto(options);
            resolve(result);
          },
        },
      ]
    );
  });
};

/**
 * Get image picker options for profile pictures (square aspect ratio)
 */
export const getProfileImageOptions = (): ImagePickerOptions => ({
  aspect: [1, 1], // Square for profile pictures
  quality: 0.8,
  allowsEditing: true,
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
});

/**
 * Get image picker options for recipe images (landscape aspect ratio)
 */
export const getRecipeImageOptions = (): ImagePickerOptions => ({
  aspect: [16, 9], // Landscape for recipe images
  quality: 0.8,
  allowsEditing: true,
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
});
