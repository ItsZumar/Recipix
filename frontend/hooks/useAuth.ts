import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

// GraphQL mutations
const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

export const useChangePassword = () => {
  const [changePasswordMutation, { loading }] = useMutation(CHANGE_PASSWORD_MUTATION);

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { data } = await changePasswordMutation({
        variables: {
          currentPassword,
          newPassword,
        },
      });

      if (data?.changePassword) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to change password' };
      }
    } catch (error: any) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to change password' 
      };
    }
  };

  return {
    changePassword,
    loading,
  };
};
