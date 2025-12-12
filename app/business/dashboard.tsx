import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function BusinessDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [business, setBusiness] = useState<any>(null);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from('businesses')
                    .select('*')
                    .eq('owner_id', user.id)
                    .single();
                setBusiness(data);
            } else {
                // Demo Mode Fallback
                setBusiness({
                    name: 'Demo Clinic (Guest)',
                    // other fields aren't strictly needed for the dashboard summary
                });
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-slate-50">
                <ActivityIndicator size="large" color="#7c3aed" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50 p-6">
            <View className="flex-row justify-between items-center mb-8">
                <Text className="text-2xl font-bold text-slate-900">Business Dashboard</Text>
                <TouchableOpacity onPress={() => {
                    supabase.auth.signOut();
                    router.replace('/auth/login');
                }}>
                    <Text className="text-red-500 font-medium">Log Out</Text>
                </TouchableOpacity>
            </View>

            <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
                <Text className="text-slate-500 font-medium mb-1">Your Business</Text>
                <Text className="text-3xl font-bold text-slate-900 mb-4">{business?.name || 'No Business Listed'}</Text>

                <Link href="/business/profile" asChild>
                    <TouchableOpacity className="bg-slate-900 h-12 rounded-xl items-center justify-center">
                        <Text className="text-white font-bold">{business ? 'Edit Profile' : 'Create Profile'}</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            {business && (
                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1 bg-violet-600 p-5 rounded-3xl shadow-lg shadow-violet-200">
                        <Text className="text-white/80 font-medium mb-1">Total Views</Text>
                        <Text className="text-white text-3xl font-bold">1,248</Text>
                    </View>
                    <View className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                        <Text className="text-slate-500 font-medium mb-1">Bookings</Text>
                        <Text className="text-slate-900 text-3xl font-bold">84</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
