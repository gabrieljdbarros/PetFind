import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BannerConexao from '../src/components/BannerConexao';
import { FavoritosProvider } from '../src/context/FavoritosContext';
import { SessionProvider, useSession } from '../src/context/SessionContext';


function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLogado, carregando } = useSession();

  useEffect(() => {
    if (carregando) return;
    if (!isLogado) {
      router.replace('/login');
    }
  }, [isLogado, carregando]);

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2F80ED" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <FavoritosProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <BannerConexao />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="adotar" />
              <Stack.Screen name="ajudar" />
              <Stack.Screen name="cadastrar-pet" />
              <Stack.Screen name="solicitacao-adocao" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="pet/[id]" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </FavoritosProvider>
      </SessionProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
