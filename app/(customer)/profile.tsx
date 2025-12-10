import { Text, View } from 'react-native';

export default function ProfileScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl font-bold text-slate-800">Profile</Text>
            <Text className="text-slate-500 mt-2">Manage your account settings.</Text>
        </View>
    );
}
