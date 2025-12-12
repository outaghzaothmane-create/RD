import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Users } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BusinessDashboard() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <StatusBar style="dark" />
            <View className="p-6">
                <Text className="text-3xl font-bold text-slate-900 mb-2">Business Dashboard</Text>
                <Text className="text-slate-500 mb-8">Manage your operations here.</Text>

                <TouchableOpacity
                    className="bg-white p-5 rounded-2xl flex-row items-center shadow-sm border border-slate-100 active:bg-slate-50"
                    onPress={() => router.push('/business/users')}
                >
                    <View className="h-12 w-12 rounded-full bg-blue-100 items-center justify-center mr-4">
                        <Users size={24} color="#2563eb" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-slate-900">User Registry</Text>
                        <Text className="text-slate-500 text-sm">View all registered users</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
