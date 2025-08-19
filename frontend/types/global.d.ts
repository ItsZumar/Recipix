// Global TypeScript declarations for Recipix

declare global {
  // Extend React Native types
  namespace ReactNative {
    interface ViewStyle {
      // Add custom style properties if needed
    }
    
    interface TextStyle {
      // Add custom text style properties if needed
    }
  }

  // Global environment variables
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      EXPO_PUBLIC_API_URL?: string;
      EXPO_PUBLIC_GRAPHQL_URL?: string;
    }
  }

  // Global utility types
  type Nullable<T> = T | null;
  type Optional<T> = T | undefined;
  type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
  };

  // Global constants
  const __DEV__: boolean;
  const __PROD__: boolean;
}

// Module declarations
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

declare module '*.jpeg' {
  const value: any;
  export default value;
}

declare module '*.gif' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// Expo Router types
declare module 'expo-router' {
  export interface LinkProps {
    href: string;
    asChild?: boolean;
    children: React.ReactNode;
  }
}

// Apollo Client types
declare module '@apollo/client' {
  export interface DefaultContext {
    headers?: Record<string, string>;
  }
}

export {};
