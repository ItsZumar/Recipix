import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { InputField } from './InputField';
import { useScreenColors } from './ScreenWrapper';
import { wp, hp } from '@/utils/responsive';
import { User } from '@/types/graphql';

const SEARCH_USERS = gql`
  query SearchUsers($query: String!, $limit: Int, $offset: Int) {
    searchUsers(query: $query, limit: $limit, offset: $offset) {
      id
      username
      firstName
      lastName
      avatar
      bio
      recipesCount
      followersCount
      followingCount
      isFollowing
    }
  }
`;

interface UserSearchProps {
  onUserSelect?: (user: User) => void;
  placeholder?: string;
  showResults?: boolean;
}

export const UserSearch: React.FC<UserSearchProps> = ({
  onUserSelect,
  placeholder = "Search users...",
  showResults = true,
}) => {
  const router = useRouter();
  const { textColor, iconColor, tintColor, backgroundColor } = useScreenColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchUsers, { data, loading, error }] = useLazyQuery(SEARCH_USERS);

  const users = data?.searchUsers || [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length >= 2) {
      searchUsers({
        variables: {
          query: query.trim(),
          limit: 20,
          offset: 0,
        },
      });
    }
  };

  const handleUserPress = (user: User) => {
    if (onUserSelect) {
      onUserSelect(user);
    } else {
      router.push(`/user/${user.id}`);
    }
  };

  const renderUserItem = ({ item: user }: { item: User }) => (
    <TouchableOpacity
      style={[styles.userItem, { borderColor: iconColor }]}
      onPress={() => handleUserPress(user)}
    >
      <View style={styles.userInfo}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
        ) : (
          <View style={[styles.userAvatarPlaceholder, { backgroundColor: iconColor }]}>
            <Ionicons name="person" size={wp(4)} color="#fff" />
          </View>
        )}
        
        <View style={styles.userDetails}>
          <ThemedText style={[styles.username, { color: textColor }]}>
            {user.username}
          </ThemedText>
          {user.firstName && user.lastName && (
            <ThemedText style={[styles.fullName, { color: textColor }]}>
              {user.firstName} {user.lastName}
            </ThemedText>
          )}
          {user.bio && (
            <ThemedText style={[styles.bio, { color: textColor }]} numberOfLines={1}>
              {user.bio}
            </ThemedText>
          )}
          <View style={styles.userStats}>
            <ThemedText style={[styles.statText, { color: iconColor }]}>
              {user.recipesCount || 0} recipes
            </ThemedText>
            <ThemedText style={[styles.statText, { color: iconColor }]}>
              {user.followersCount || 0} followers
            </ThemedText>
          </View>
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={wp(4)} color={iconColor} />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <InputField
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder={placeholder}
        leftIcon="search"
        containerStyle={styles.searchContainer}
      />
      
      {showResults && searchQuery.trim().length >= 2 && (
        <ThemedView style={styles.resultsContainer}>
          {loading ? (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={tintColor} />
              <ThemedText style={[styles.loadingText, { color: textColor }]}>
                Searching...
              </ThemedText>
            </ThemedView>
          ) : error ? (
            <ThemedView style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={wp(6)} color="#FF3B30" />
              <ThemedText style={[styles.errorText, { color: textColor }]}>
                Failed to search users
              </ThemedText>
            </ThemedView>
          ) : users.length > 0 ? (
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={renderUserItem}
              showsVerticalScrollIndicator={false}
              style={styles.usersList}
            />
          ) : searchQuery.trim().length >= 2 ? (
            <ThemedView style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={wp(8)} color={iconColor} />
              <ThemedText style={[styles.emptyText, { color: textColor }]}>
                No users found
              </ThemedText>
              <ThemedText style={[styles.emptySubtext, { color: textColor }]}>
                Try a different search term
              </ThemedText>
            </ThemedView>
          ) : null}
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    marginBottom: hp(2),
  },
  resultsContainer: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(4),
    gap: wp(2),
  },
  loadingText: {
    fontSize: wp(3.5),
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(4),
    gap: wp(2),
  },
  errorText: {
    fontSize: wp(3.5),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(6),
    gap: wp(2),
  },
  emptyText: {
    fontSize: wp(4),
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: wp(3.5),
    opacity: 0.7,
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    borderBottomWidth: 1,
    marginBottom: hp(1),
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: wp(3),
  },
  userAvatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
  },
  userAvatarPlaceholder: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: wp(4),
    fontWeight: '600',
    marginBottom: hp(0.25),
  },
  fullName: {
    fontSize: wp(3.5),
    marginBottom: hp(0.25),
  },
  bio: {
    fontSize: wp(3),
    marginBottom: hp(0.5),
    opacity: 0.8,
  },
  userStats: {
    flexDirection: 'row',
    gap: wp(3),
  },
  statText: {
    fontSize: wp(2.5),
  },
});
