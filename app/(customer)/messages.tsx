import { Text, View } from 'react-native';

export default function MessagesScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-slate-50">
            <Text className="text-xl font-bold text-slate-900">Messages</Text>
            <Text className="text-slate-500 mt-2">Chat with businesses here.</Text>
        </View>
    );
}
