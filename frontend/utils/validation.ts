import { ValidationRule, ValidationRules, FormField, FormState } from '@/types/common';

// Validation functions
export const validators = {
  required: (value: string): string | undefined => {
    return value.trim() ? undefined : 'This field is required';
  },

  minLength: (min: number) => (value: string): string | undefined => {
    return value.length >= min ? undefined : `Must be at least ${min} characters`;
  },

  maxLength: (max: number) => (value: string): string | undefined => {
    return value.length <= max ? undefined : `Must be no more than ${max} characters`;
  },

  email: (value: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? undefined : 'Please enter a valid email address';
  },

  password: (value: string): string | undefined => {
    if (value.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    return undefined;
  },

  confirmPassword: (password: string) => (value: string): string | undefined => {
    return value === password ? undefined : 'Passwords do not match';
  },

  url: (value: string): string | undefined => {
    if (!value) return undefined; // Optional field
    try {
      new URL(value);
      return undefined;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  number: (value: string): string | undefined => {
    if (!value) return undefined; // Optional field
    return !isNaN(Number(value)) ? undefined : 'Please enter a valid number';
  },

  positiveNumber: (value: string): string | undefined => {
    if (!value) return undefined; // Optional field
    const num = Number(value);
    return !isNaN(num) && num > 0 ? undefined : 'Please enter a positive number';
  },

  range: (min: number, max: number) => (value: string): string | undefined => {
    if (!value) return undefined; // Optional field
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max 
      ? undefined 
      : `Please enter a number between ${min} and ${max}`;
  },
};

// Validate a single field
export const validateField = (value: string, rules: ValidationRule): string | undefined => {
  if (rules.required && !validators.required(value)) {
    return validators.required(value);
  }

  if (value && rules.minLength) {
    const error = validators.minLength(rules.minLength)(value);
    if (error) return error;
  }

  if (value && rules.maxLength) {
    const error = validators.maxLength(rules.maxLength)(value);
    if (error) return error;
  }

  if (value && rules.pattern) {
    const error = !rules.pattern.test(value) ? 'Invalid format' : undefined;
    if (error) return error;
  }

  if (value && rules.custom) {
    const error = rules.custom(value);
    if (error) return error;
  }

  return undefined;
};

// Validate entire form
export const validateForm = (formData: Record<string, string>, rules: ValidationRules): Record<string, string> => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach(fieldName => {
    const value = formData[fieldName] || '';
    const fieldRules = rules[fieldName];
    const error = validateField(value, fieldRules);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

// Check if form is valid
export const isFormValid = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length === 0;
};

// Update form field
export const updateFormField = (
  formState: FormState,
  fieldName: string,
  value: string,
  rules?: ValidationRules
): FormState => {
  const field = formState[fieldName] || { value: '', error: undefined, touched: false };
  
  const updatedField: FormField = {
    ...field,
    value,
    touched: true,
    error: rules ? validateField(value, rules[fieldName]) : field.error,
  };

  return {
    ...formState,
    [fieldName]: updatedField,
  };
};

// Initialize form state
export const initializeFormState = (initialValues: Record<string, string>): FormState => {
  const formState: FormState = {};
  
  Object.keys(initialValues).forEach(fieldName => {
    formState[fieldName] = {
      value: initialValues[fieldName] || '',
      error: undefined,
      touched: false,
    };
  });

  return formState;
};

// Get form values
export const getFormValues = (formState: FormState): Record<string, string> => {
  const values: Record<string, string> = {};
  
  Object.keys(formState).forEach(fieldName => {
    values[fieldName] = formState[fieldName].value;
  });

  return values;
};

// Get form errors
export const getFormErrors = (formState: FormState): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(formState).forEach(fieldName => {
    const field = formState[fieldName];
    if (field.error && field.touched) {
      errors[fieldName] = field.error;
    }
  });

  return errors;
};

// Check if form is dirty (has changes)
export const isFormDirty = (formState: FormState, initialValues: Record<string, string>): boolean => {
  return Object.keys(formState).some(fieldName => {
    const currentValue = formState[fieldName].value;
    const initialValue = initialValues[fieldName] || '';
    return currentValue !== initialValue;
  });
};

// Recipe-specific validation rules
export const recipeValidationRules: ValidationRules = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  ingredients: {
    required: true,
    custom: (value: string) => {
      const ingredients = value.split('\n').filter(ingredient => ingredient.trim());
      return ingredients.length > 0 ? undefined : 'At least one ingredient is required';
    },
  },
  instructions: {
    required: true,
    custom: (value: string) => {
      const instructions = value.split('\n').filter(instruction => instruction.trim());
      return instructions.length > 0 ? undefined : 'At least one instruction is required';
    },
  },
  cookingTime: {
    required: true,
    custom: validators.positiveNumber,
  },
  servings: {
    required: true,
    custom: validators.positiveNumber,
  },
  cuisine: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
};

// Auth-specific validation rules
export const authValidationRules: ValidationRules = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  email: {
    required: true,
    custom: validators.email,
  },
  password: {
    required: true,
    custom: validators.password,
  },
  confirmPassword: {
    required: true,
    custom: (value: string, formData?: Record<string, string>) => {
      const password = formData?.password || '';
      return validators.confirmPassword(password)(value);
    },
  },
};
