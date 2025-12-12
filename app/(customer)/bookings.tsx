import { Text, View } from 'react-native';

export default function BookingsScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-slate-50">
            <Text className="text-xl font-bold text-slate-900">My Bookings</Text>
            <Text className="text-slate-500 mt-2">Upcoming appointments will appear here.</Text>
        </View>
    );
}
