import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

type Profile = {
    id: string;
    email: string;
    full_name: string | null;
};

export default function UsersListScreen() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*');

            if (error) {
                throw error;
            }

            if (data) {
                setUsers(data);
            }
        } catch (error: any) {
            Alert.alert('Error fetching users', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const renderItem = ({ item }: { item: Profile }) => (
        <View className="bg-white p-4 rounded-xl mb-3 flex-row items-center shadow-sm border border-slate-100">
            <View className="h-12 w-12 rounded-full bg-indigo-100 items-center justify-center mr-4">
                <Text className="text-lg font-bold text-indigo-700">{(item.email || '?')[0].toUpperCase()}</Text>
            </View>
            <View>
                <Text className="text-base font-semibold text-slate-900">{item.email}</Text>
                <Text className="text-xs text-slate-400 mt-0.5">ID: {item.id.slice(0, 8)}...</Text>
                {item.full_name && <Text className="text-sm text-slate-500 mt-0.5">{item.full_name}</Text>}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="p-5 bg-white border-b border-slate-200">
                <Text className="text-2xl font-bold text-slate-900">User Registry</Text>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center p-5">
                    <ActivityIndicator size="large" color="#1e3a8a" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerClassName="p-5"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center p-5">
                            <Text className="text-base text-slate-500">No users found.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

