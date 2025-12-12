import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

// Suppress deprecation warning from external libraries
LogBox.ignoreLogs([
  "SafeAreaView has been deprecated",
]);

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="business/dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="business/profile" options={{ headerShown: false }} />
        <Stack.Screen name="business/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
