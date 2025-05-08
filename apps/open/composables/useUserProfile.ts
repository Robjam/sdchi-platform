interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  picture?: string;
}

export const useUserProfile = () => {
  const profile = ref<UserProfile | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const fetchProfile = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const data = await $fetch<UserProfile>('/api/user/profile');
      profile.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'プロフィールの取得に失敗しました';
      console.error('Failed to fetch user profile:', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch profile on composable initialization
  onMounted(() => {
    fetchProfile();
  });

  return {
    profile: readonly(profile),
    loading: readonly(loading),
    error: readonly(error),
    refetch: fetchProfile,
  };
};