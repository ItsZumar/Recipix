import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { FOLLOW_USER, UNFOLLOW_USER, GET_USER_WITH_FOLLOW_DATA } from '@/lib/graphql/follow';
import { FollowUserResponse, UnfollowUserResponse, GetUserWithFollowDataResponse } from '@/types/graphql';

export const useFollow = (userId: string) => {
  const client = useApolloClient();
  const [followUser, { loading: followLoading }] = useMutation<FollowUserResponse>(FOLLOW_USER);
  const [unfollowUser, { loading: unfollowLoading }] = useMutation<UnfollowUserResponse>(UNFOLLOW_USER);

  const { data: userData, loading: userLoading } = useQuery<GetUserWithFollowDataResponse>(
    GET_USER_WITH_FOLLOW_DATA,
    {
      variables: { userId },
      skip: !userId,
    }
  );

  const user = userData?.user;
  const isFollowing = user?.isFollowing || false;

  const handleFollow = async () => {
    try {
      await followUser({
        variables: { userId },
        update: (cache, { data }) => {
          if (data?.followUser) {
            // Update the user's follow status in cache
            cache.modify({
              id: cache.identify({ __typename: 'User', id: userId }),
              fields: {
                isFollowing: () => true,
                followersCount: (existing = 0) => existing + 1,
              },
            });
          }
        },
      });
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser({
        variables: { userId },
        update: (cache, { data }) => {
          if (data?.unfollowUser) {
            // Update the user's follow status in cache
            cache.modify({
              id: cache.identify({ __typename: 'User', id: userId }),
              fields: {
                isFollowing: () => false,
                followersCount: (existing = 0) => Math.max(0, existing - 1),
              },
            });
          }
        },
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  };

  const toggleFollow = async () => {
    if (isFollowing) {
      await handleUnfollow();
    } else {
      await handleFollow();
    }
  };

  return {
    user,
    isFollowing,
    isLoading: followLoading || unfollowLoading || userLoading,
    followUser: handleFollow,
    unfollowUser: handleUnfollow,
    toggleFollow,
  };
};
