import { useRouter } from 'expo-router';
import { Calendar, Edit2, Trash2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function BookingsScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [editingBooking, setEditingBooking] = useState<any>(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    businesses (
                        name,
                        category,
                        image_url
                    )
                `)
                .eq('user_id', user.id)
                .order('booking_date', { ascending: true });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchBookings();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const handleDelete = (booking: any) => {
        Alert.alert(
            'Delete Booking',
            `Are you sure you want to cancel your booking at ${booking.businesses?.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Optimistic UI update - remove immediately
                            setBookings(prev => prev.filter(b => b.id !== booking.id));

                            const { error } = await supabase
                                .from('bookings')
                                .delete()
                                .eq('id', booking.id);

                            if (error) {
                                // If error, add it back
                                console.error('Delete error:', error);
                                setBookings(prev => [...prev, booking].sort((a, b) =>
                                    new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime()
                                ));
                                Alert.alert('Error', 'Failed to cancel booking. Please try again.');
                            } else {
                                Alert.alert('Success', 'Booking cancelled successfully');
                            }
                        } catch (error) {
                            console.error('Error deleting booking:', error);
                            Alert.alert('Error', 'Failed to cancel booking');
                            // Refresh to get actual state
                            fetchBookings();
                        }
                    }
                }
            ]
        );
    };

    const handleEdit = (booking: any) => {
        setEditingBooking(booking);
        const date = new Date(booking.booking_date);
        setNewDate(date.toISOString().split('T')[0]);
        setNewTime(date.toTimeString().slice(0, 5));
    };

    const fetchAvailableSlots = async (businessId: string, date: string) => {
        setLoadingSlots(true);
        try {
            const { data, error } = await supabase
                .rpc('get_available_slots', {
                    business_id: businessId,
                    date: date
                });

            if (error) {
                console.error('Error fetching slots:', error);
                setAvailableSlots([]);
            } else {
                setAvailableSlots(data || []);
            }
        } catch (error) {
            console.error('Error:', error);
            setAvailableSlots([]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const saveEdit = async () => {
        if (!newDate || !newTime) {
            Alert.alert('Error', 'Please select both date and time');
            return;
        }

        try {
            const newDateTime = `${newDate} ${newTime}:00`;
            const { error } = await supabase
                .from('bookings')
                .update({
                    booking_date: newDateTime,
                    status: 'pending'
                })
                .eq('id', editingBooking.id);

            if (error) throw error;

            Alert.alert('Success', 'Booking updated! Waiting for business confirmation.');
            setEditingBooking(null);
            fetchBookings();
        } catch (error) {
            console.error('Error updating booking:', error);
            Alert.alert('Error', 'Failed to update booking');
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-slate-50">
                <ActivityIndicator size="large" color="#7c3aed" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="px-6 pt-6 pb-4">
                <Text className="text-3xl font-bold text-slate-900">My Bookings</Text>
                <Text className="text-slate-500 mt-1">{bookings.length} upcoming appointments</Text>
            </View>

            <FlatList
                data={bookings}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />
                }
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Calendar size={64} color="#cbd5e1" />
                        <Text className="text-xl font-semibold text-slate-900 mt-4">No bookings yet</Text>
                        <Text className="text-slate-500 mt-2 text-center">
                            Your upcoming appointments will appear here
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View className="bg-white rounded-2xl mb-4 shadow-sm border border-slate-100 overflow-hidden">
                        <TouchableOpacity
                            className="p-4"
                            onPress={() => router.push(`/business/${item.business_id}`)}
                        >
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-slate-900">
                                        {item.businesses?.name || 'Business'}
                                    </Text>
                                    <Text className="text-sm text-slate-500 mt-1">
                                        {item.service_name}
                                    </Text>
                                </View>
                                <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                                    <Text className="text-xs font-semibold capitalize">{item.status}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center">
                                <Calendar size={16} color="#7c3aed" />
                                <Text className="text-slate-600 ml-2">
                                    {formatDate(item.booking_date)}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <View className="flex-row border-t border-slate-100">
                            <TouchableOpacity
                                className="flex-1 flex-row items-center justify-center py-3 border-r border-slate-100"
                                onPress={() => handleEdit(item)}
                            >
                                <Edit2 size={16} color="#7c3aed" />
                                <Text className="text-violet-600 font-semibold ml-2">Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 flex-row items-center justify-center py-3"
                                onPress={() => handleDelete(item)}
                            >
                                <Trash2 size={16} color="#ef4444" />
                                <Text className="text-red-500 font-semibold ml-2">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />

            <Modal
                visible={editingBooking !== null}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setEditingBooking(null)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <ScrollView className="bg-white rounded-t-3xl p-6">
                        <Text className="text-2xl font-bold text-slate-900 mb-4">Edit Booking</Text>

                        <Text className="text-lg font-semibold text-slate-900 mb-2">Select New Date</Text>
                        <RNCalendar
                            onDayPress={(day) => {
                                setNewDate(day.dateString);
                                if (editingBooking?.business_id) {
                                    fetchAvailableSlots(editingBooking.business_id, day.dateString);
                                }
                            }}
                            markedDates={{
                                [newDate]: { selected: true, selectedColor: '#7c3aed' }
                            }}
                            minDate={new Date().toISOString().split('T')[0]}
                            theme={{
                                selectedDayBackgroundColor: '#7c3aed',
                                todayTextColor: '#7c3aed',
                                arrowColor: '#7c3aed',
                            }}
                        />

                        <Text className="text-lg font-semibold text-slate-900 mt-4 mb-2">Select New Time</Text>

                        {loadingSlots ? (
                            <View className="py-8">
                                <ActivityIndicator size="small" color="#7c3aed" />
                            </View>
                        ) : availableSlots.length > 0 ? (
                            <View className="flex-row flex-wrap gap-2">
                                {availableSlots.map((slot: any) => (
                                    <TouchableOpacity
                                        key={slot.time}
                                        className={`px-4 py-3 rounded-xl border ${newTime === slot.time
                                            ? 'bg-violet-600 border-violet-600'
                                            : 'bg-white border-slate-200'
                                            }`}
                                        onPress={() => setNewTime(slot.time)}
                                    >
                                        <Text className={`font-semibold ${newTime === slot.time ? 'text-white' : 'text-slate-900'
                                            }`}>
                                            {slot.time}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ) : newDate ? (
                            <Text className="text-slate-500 text-center py-4">
                                No available slots for this date
                            </Text>
                        ) : (
                            <Text className="text-slate-500 text-center py-4">
                                Please select a date first
                            </Text>
                        )}

                        <View className="flex-row gap-3 mt-6">
                            <TouchableOpacity
                                className="flex-1 bg-slate-100 rounded-xl py-4 items-center"
                                onPress={() => setEditingBooking(null)}
                            >
                                <Text className="font-semibold text-slate-700">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-violet-600 rounded-xl py-4 items-center"
                                onPress={saveEdit}
                            >
                                <Text className="font-semibold text-white">Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
