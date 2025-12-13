import { useRouter } from 'expo-router';
import { MessageSquare } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BUSINESSES } from '../../constants/data';
import { supabase } from '../../lib/supabase';

export default function MessagesScreen() {
    const router = useRouter();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setConversations(data || []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchConversations();
    };

    const getBusiness = (businessId: string) => {
        return BUSINESSES.find(b => b.id === businessId);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="px-6 pt-6 pb-4">
                <Text className="text-3xl font-bold text-slate-900">Messages</Text>
            </View>

            <FlatList
                data={conversations}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />
                }
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <MessageSquare size={64} color="#cbd5e1" />
                        <Text className="text-xl font-semibold text-slate-900 mt-4">No conversations yet</Text>
                        <Text className="text-slate-500 mt-2 text-center">
                            Your messages will appear here
                        </Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const business = getBusiness(item.business_id);
                    return (
                        <TouchableOpacity
                            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-slate-100 flex-row items-center"
                            onPress={() => router.push(`/business/${item.business_id}`)}
                        >
                            {business?.image ? (
                                <Image
                                    source={{ uri: business.image }}
                                    className="w-14 h-14 rounded-full"
                                />
                            ) : (
                                <View className="w-14 h-14 rounded-full bg-slate-200 items-center justify-center">
                                    <MessageSquare size={24} color="#64748b" />
                                </View>
                            )}

                            <View className="flex-1 ml-4">
                                <Text className="text-lg font-bold text-slate-900">
                                    {business?.name || 'Business'}
                                </Text>
                                <Text className="text-sm text-slate-500 mt-1">
                                    Tap to view conversation...
                                </Text>
                            </View>

                            <Text className="text-xs text-slate-400">
                                {new Date(item.updated_at).toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
}
