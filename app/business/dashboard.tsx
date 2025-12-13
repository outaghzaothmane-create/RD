import { Link, useRouter } from 'expo-router';
import { Calendar, ExternalLink, RefreshCcw } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function BusinessDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [business, setBusiness] = useState<any>(null);
    const [stats, setStats] = useState<any[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [newCustomersCount, setNewCustomersCount] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // 1. Get Business
                const { data: biz } = await supabase
                    .from('businesses')
                    .select('*')
                    .eq('owner_id', user.id)
                    .single();

                if (biz) {
                    setBusiness(biz);

                    // 2. Get Weekly Stats (RPC)
                    const { data: weeklyStats, error: statsError } = await supabase
                        .rpc('get_weekly_stats', { curr_business_id: biz.id });

                    if (weeklyStats) setStats(weeklyStats);
                    if (statsError) console.error('Stats Error:', statsError);

                    // 3. Get Recent Bookings
                    const { data: bookings } = await supabase
                        .from('bookings')
                        .select('*, profiles(display_name)')
                        .eq('business_id', biz.id)
                        .order('created_at', { ascending: false })
                        .limit(5);

                    setRecentBookings(bookings || []);

                    // 4. Calculate "New Customers" (Simple logic: bookings created this week)
                    // In a real app, you'd check if it's their FIRST booking. 
                    // Here we just count total bookings this week as a proxy for activity.
                    const count = weeklyStats?.reduce((acc: number, curr: any) => acc + (curr.booking_count || 0), 0) || 0;
                    setNewCustomersCount(count); // Using total weekly bookings as the metric for now
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const addToGoogleCalendar = (booking: any) => {
        const startTime = new Date(booking.start_time);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Assume 1 hour

        // Format dates as YYYYMMDDTHHmmssZ
        const format = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const url = `https://www.google.com/calendar/render?action=TEMPLATE` +
            `&text=${encodeURIComponent(booking.service_name || 'Service Booking')}` +
            `&dates=${format(startTime)}/${format(endTime)}` +
            `&details=${encodeURIComponent('Booking with ' + (booking.profiles?.display_name || 'Customer'))}` +
            `&location=${encodeURIComponent(business?.address || '')}`;

        Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open calendar'));
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-slate-50">
                <ActivityIndicator size="large" color="#7c3aed" />
            </View>
        );
    }

    if (!business) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 p-6 justify-center items-center">
                <Text className="text-xl font-bold text-slate-900 mb-4">No Business Found</Text>
                <Text className="text-slate-500 text-center mb-6">Please create a business profile to access the dashboard.</Text>
                <Link href="/business/profile" asChild>
                    <TouchableOpacity className="bg-violet-600 px-6 py-3 rounded-full">
                        <Text className="text-white font-bold">Create Business</Text>
                    </TouchableOpacity>
                </Link>
            </SafeAreaView>
        )
    }

    const maxStat = Math.max(...stats.map(s => s.booking_count), 5); // Minimum 5 for scale

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
                {/* Header */}
                <View className="flex-row justify-between items-center mb-8">
                    <View>
                        <Text className="text-2xl font-bold text-slate-900">Dashboard</Text>
                        <Text className="text-slate-500">{business.name}</Text>
                    </View>
                    <TouchableOpacity onPress={loadData} className="p-2 bg-slate-200 rounded-full">
                        <RefreshCcw size={20} color="#64748b" />
                    </TouchableOpacity>
                </View>

                {/* Summary Cards */}
                <View className="flex-row gap-4 mb-6">
                    <View className="flex-1 bg-violet-600 p-5 rounded-3xl shadow-lg shadow-violet-200">
                        <Text className="text-white/80 font-medium mb-1">New Bookings</Text>
                        <Text className="text-white text-3xl font-bold">{newCustomersCount}</Text>
                        <Text className="text-violet-200 text-xs mt-1">This Week</Text>
                    </View>
                    <View className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                        <Text className="text-slate-500 font-medium mb-1">Total Views</Text>
                        <Text className="text-slate-900 text-3xl font-bold">1,248</Text>
                        <Text className="text-green-600 text-xs mt-1">↑ 12% vs last week</Text>
                    </View>
                </View>

                {/* Chart Section */}
                <View className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
                    <Text className="text-lg font-bold text-slate-900 mb-6">Bookings Activity</Text>
                    <View className="flex-row justify-between items-end h-40">
                        {stats.map((stat, index) => {
                            const heightPercentage = (stat.booking_count / maxStat) * 100;
                            return (
                                <View key={index} className="items-center flex-1">
                                    <View
                                        className="w-8 bg-violet-100 rounded-t-lg rounded-b-sm relative"
                                        style={{ height: `${heightPercentage}%`, minHeight: 20 }}
                                    >
                                        {stat.booking_count > 0 && (
                                            <View className="absolute -top-6 w-full items-center">
                                                <Text className="text-xs font-bold text-violet-600">{stat.booking_count}</Text>
                                            </View>
                                        )}
                                        <View className="absolute bottom-0 w-full h-full bg-violet-500 opacity-20 rounded-t-lg" />
                                        <View className="absolute bottom-0 w-full bg-violet-600 rounded-t-lg" style={{ height: '100%', opacity: 0.8 }} />
                                    </View>
                                    <Text className="text-[10px] text-slate-400 mt-2 font-medium">{stat.date_label}</Text>
                                </View>
                            );
                        })}
                        {stats.length === 0 && (
                            <View className="w-full h-full items-center justify-center">
                                <Text className="text-slate-400">No data available</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Recent Info & Actions */}
                <View className="mb-6">
                    <Text className="text-lg font-bold text-slate-900 mb-4">Recent Bookings</Text>
                    {recentBookings.length === 0 ? (
                        <View className="bg-white p-6 rounded-2xl border border-slate-100 items-center border-dashed">
                            <Text className="text-slate-400">No bookings yet.</Text>
                        </View>
                    ) : (
                        recentBookings.map((booking) => (
                            <TouchableOpacity
                                key={booking.id}
                                className="bg-white p-4 rounded-2xl border border-slate-100 mb-3 flex-row items-center justify-between"
                                onPress={() => addToGoogleCalendar(booking)}
                            >
                                <View>
                                    <Text className="font-bold text-slate-900">{booking.service_name}</Text>
                                    <Text className="text-slate-500 text-xs">
                                        {booking.profiles?.display_name || 'Customer'} • {new Date(booking.start_time).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Text className={`text-xs font-bold px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {booking.status}
                                    </Text>
                                    <View className="h-8 w-8 bg-slate-100 rounded-full items-center justify-center">
                                        <Calendar size={14} color="#64748b" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <Link href="/business/profile" asChild>
                    <TouchableOpacity className="bg-slate-900 h-14 rounded-2xl items-center justify-center flex-row gap-2">
                        <Text className="text-white font-bold font-lg">Manage Profile</Text>
                        <ExternalLink size={18} color="white" />
                    </TouchableOpacity>
                </Link>

            </ScrollView>
        </SafeAreaView>
    );
}
