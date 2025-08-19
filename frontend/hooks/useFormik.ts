import { useFormik as useFormikOriginal, FormikHelpers, FormikConfig, FormikErrors, FormikTouched } from 'formik';
import { useState, useCallback } from 'react';

interface UseFormikOptions<T> extends Omit<FormikConfig<T>, 'onSubmit'> {
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => Promise<void> | void;
  onSuccess?: (values: T) => void;
  onError?: (error: any) => void;
}

interface FormState<T> {
  values: T;
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

interface FormActions<T> {
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  setFieldError: (field: keyof T, message?: string) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  validateForm: () => Promise<FormikErrors<T>>;
}

export function useFormik<T extends Record<string, any>>(
  options: UseFormikOptions<T>
): [FormState<T>, FormActions<T>] {
  const [isDirty, setIsDirty] = useState(false);

  const handleSubmit = useCallback(
    async (values: T, formikHelpers: FormikHelpers<T>) => {
      try {
        await options.onSubmit(values, formikHelpers);
        options.onSuccess?.(values);
      } catch (error) {
        options.onError?.(error);
      }
    },
    [options]
  );

  const formik = useFormikOriginal({
    ...options,
    onSubmit: handleSubmit,
  });

  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      formik.setFieldValue(field as string, value);
      setIsDirty(true);
    },
    [formik]
  );

  const setFieldTouched = useCallback(
    (field: keyof T, touched: boolean = true) => {
      formik.setFieldTouched(field as string, touched);
    },
    [formik]
  );

  const setFieldError = useCallback(
    (field: keyof T, message?: string) => {
      formik.setFieldError(field as string, message);
    },
    [formik]
  );

  const resetForm = useCallback(() => {
    formik.resetForm();
    setIsDirty(false);
  }, [formik]);

  const submitForm = useCallback(async () => {
    await formik.submitForm();
  }, [formik]);

  const validateForm = useCallback(async () => {
    return await formik.validateForm();
  }, [formik]);

  const formState: FormState<T> = {
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    isSubmitting: formik.isSubmitting,
    isValid: formik.isValid,
    isDirty,
  };

  const formActions: FormActions<T> = {
    setFieldValue,
    setFieldTouched,
    setFieldError,
    resetForm,
    submitForm,
    validateForm,
  };

  return [formState, formActions];
}

// Hook for handling form field changes with validation
export function useFormField<T extends Record<string, any>>(
  formState: FormState<T>,
  formActions: FormActions<T>,
  fieldName: keyof T
) {
  const value = formState.values[fieldName];
  const error = formState.errors[fieldName];
  const touched = formState.touched[fieldName];
  const hasError = touched && error;

  const handleChange = useCallback(
    (newValue: any) => {
      formActions.setFieldValue(fieldName, newValue);
    },
    [formActions, fieldName]
  );

  const handleBlur = useCallback(() => {
    formActions.setFieldTouched(fieldName, true);
  }, [formActions, fieldName]);

  return {
    value,
    error,
    touched,
    hasError,
    handleChange,
    handleBlur,
  };
}

// Hook for form submission with loading state
export function useFormSubmission<T extends Record<string, any>>(
  formState: FormState<T>,
  formActions: FormActions<T>
) {
  const handleSubmit = useCallback(async () => {
    if (formState.isValid && !formState.isSubmitting) {
      await formActions.submitForm();
    }
  }, [formState.isValid, formState.isSubmitting, formActions]);

  return {
    handleSubmit,
    isSubmitting: formState.isSubmitting,
    canSubmit: formState.isValid && !formState.isSubmitting,
  };
}
