import { useRouter } from 'expo-router';
import { Briefcase, User } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoleSelectionScreen() {
    const router = useRouter();

    const handleRoleSelect = (role: 'business' | 'customer') => {
        // In a real app, we would store this preference
        if (role === 'customer') {
            router.replace('/(customer)/home');
        } else {
            // Placeholder for business flow
            alert('Business interface coming soon!');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
            <View className="items-center mb-12">
                <Text className="text-3xl font-bold text-slate-800 mb-2">Welcome</Text>
                <Text className="text-base text-slate-500 text-center">
                    Choose how you want to use the app
                </Text>
            </View>

            <View className="w-full space-y-4 gap-4">
                {/* Customer Card */}
                <TouchableOpacity
                    onPress={() => handleRoleSelect('customer')}
                    className="w-full bg-blue-50 p-6 rounded-3xl border border-blue-100 flex-row items-center space-x-4"
                    activeOpacity={0.8}
                >
                    <View className="bg-blue-500 h-14 w-14 rounded-2xl items-center justify-center">
                        <User color="white" size={28} />
                    </View>
                    <View className="flex-1 ml-4">
                        <Text className="text-xl font-semibold text-slate-800">I'm a Customer</Text>
                        <Text className="text-slate-500 text-sm mt-1">
                            Book appointments, tables & more
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Business Card */}
                <TouchableOpacity
                    onPress={() => handleRoleSelect('business')}
                    className="w-full bg-white p-6 rounded-3xl border-2 border-slate-100 flex-row items-center space-x-4 shadow-sm"
                    activeOpacity={0.8}
                >
                    <View className="bg-slate-800 h-14 w-14 rounded-2xl items-center justify-center">
                        <Briefcase color="white" size={28} />
                    </View>
                    <View className="flex-1 ml-4">
                        <Text className="text-xl font-semibold text-slate-800">I'm a Business</Text>
                        <Text className="text-slate-500 text-sm mt-1">
                            Manage bookings & communicate
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View className="mt-12">
                <Text className="text-slate-400 text-sm">
                    Powered by Universal Booking
                </Text>
            </View>
        </SafeAreaView>
    );
}
