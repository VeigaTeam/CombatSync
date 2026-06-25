import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('access_token').then((token) => {
      setIsAuthenticated(!!token);
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return isAuthenticated ? (
    <Redirect href="/(tabs)/agenda" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
