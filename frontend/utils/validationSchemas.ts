import * as Yup from 'yup';

// Registration form validation schema
export const registrationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be no more than 30 characters')
    .matches(/^[a-zA-Z0-9_\s]+$/, 'Username can only contain letters, numbers, underscores, and spaces')
    .required('Username is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/^(?=.*\d)/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

// Login form validation schema
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required'),
});

// Recipe form validation schema
export const recipeSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be no more than 200 characters')
    .required('Title is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be no more than 1000 characters')
    .required('Description is required'),
  ingredients: Yup.string()
    .min(1, 'At least one ingredient is required')
    .required('Ingredients are required'),
  instructions: Yup.string()
    .min(1, 'At least one instruction is required')
    .required('Instructions are required'),
  cookTime: Yup.number()
    .positive('Cooking time must be positive')
    .integer('Cooking time must be a whole number')
    .required('Cooking time is required'),
  prepTime: Yup.number()
    .positive('Prep time must be positive')
    .integer('Prep time must be a whole number')
    .optional(),
  servings: Yup.number()
    .positive('Servings must be positive')
    .integer('Servings must be a whole number')
    .required('Servings is required'),
  cuisine: Yup.string()
    .min(2, 'Cuisine must be at least 2 characters')
    .max(50, 'Cuisine must be no more than 50 characters')
    .required('Cuisine is required'),
});

// Profile update validation schema
export const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .max(50, 'First name must be no more than 50 characters'),
  lastName: Yup.string()
    .max(50, 'Last name must be no more than 50 characters'),
  bio: Yup.string()
    .max(500, 'Bio must be no more than 500 characters'),
});

// Password change validation schema
export const passwordChangeSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/^(?=.*\d)/, 'Password must contain at least one number')
    .required('New password is required'),
  confirmNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

// Change password validation schema (simplified version)
export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});
