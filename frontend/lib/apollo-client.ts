import { ApolloClient, InMemoryCache, NormalizedCacheObject, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types for authentication
export interface AuthToken {
  token: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

// Get the correct backend URL based on platform
const getBackendUrl = () => {
  if (__DEV__) {
    // In development, use different URLs for different platforms
    const { Platform } = require("react-native");
    let url: string;
    if (Platform.OS === "android") {
      url = "http://192.168.1.4:4000/graphql"; // Android emulator
    } else if (Platform.OS === "ios") {
      url = "http://localhost:4000/graphql"; // iOS simulator
    } else {
      url = "http://localhost:4000/graphql"; // Web
    }
    console.log(`🔗 Apollo Client connecting to: ${url} (Platform: ${Platform.OS})`);
    return url;
  }
  return "http://localhost:4000/graphql"; // Production
};

// Create HTTP link
const httpLink = createHttpLink({
  uri: getBackendUrl(),
  fetchOptions: {
    timeout: 5000, // 5 second timeout - fail faster
  },
});

// Auth link to add token to requests
const authLink = setContext(async (_, { headers }): Promise<{ headers: Record<string, string> }> => {
  // Get the authentication token from Zustand store
  const { useAuthStore } = await import("@/stores/authStore");
  const token = useAuthStore.getState().token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error link for debugging
const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (networkError) {
    console.error("Apollo Network Error:", networkError);
    console.error("Backend URL:", getBackendUrl());
  }
  if (graphQLErrors) {
    console.error("Apollo GraphQL Errors:", graphQLErrors);
  }
});

// Create Apollo Client
export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
