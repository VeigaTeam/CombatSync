import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, getApiError } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { isAuthenticated } from '@/lib/auth';
import type { LoginRequest } from '@/types';

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated: storeAuth, logout: storeLogout, setTokensAndUser, setUser, setLoading } = useAuthStore();

  // Fetch current user if we have a valid token
  const { isLoading: isFetchingUser } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => setUser(data),
    onError: () => {
      storeLogout();
    },
  } as Parameters<typeof useQuery>[0]);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      setTokensAndUser(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        data.user,
      );
      queryClient.setQueryData(['auth', 'me'], data.user);
      router.push('/dashboard');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      storeLogout();
      queryClient.clear();
      router.push('/login');
    },
  });

  return {
    user,
    isAuthenticated: storeAuth,
    isLoading: isFetchingUser,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ? getApiError(loginMutation.error) : null,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
