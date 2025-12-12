import { Text, View } from 'react-native';

export default function ProfileScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-slate-50">
            <Text className="text-xl font-bold text-slate-900">Profile</Text>
            <Text className="text-slate-500 mt-2">Manage your account settings.</Text>
        </View>
    );
}
