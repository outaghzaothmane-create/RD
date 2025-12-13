import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Clock, MapPin, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BUSINESSES } from '../../constants/data';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

type Service = {
    name: string;
    duration: number;
    price: number;
};

type TimeSlot = {
    time: string;
    available: boolean;
};

export default function BusinessProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [business, setBusiness] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Booking wizard state
    const [bookingStep, setBookingStep] = useState(0); // 0: closed, 1: service, 2: date/time, 3: confirm
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        if (id) fetchBusiness();
    }, [id]);

    useEffect(() => {
        if (selectedDate && bookingStep === 2) {
            fetchAvailableSlots();
        }
    }, [selectedDate]);

    const fetchBusiness = async () => {
        try {
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.log('Supabase error (using mock data):', error.message);
                const mockBusiness = BUSINESSES.find(b => b.id === id);
                if (mockBusiness) {
                    setBusiness(mockBusiness);
                } else {
                    throw error;
                }
            } else {
                setBusiness(data);
            }
        } catch (error) {
            console.error('Error fetching business:', error);
            const mockBusiness = BUSINESSES.find(b => b.id === id);
            if (mockBusiness) setBusiness(mockBusiness);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        setLoadingSlots(true);
        try {
            const { data, error } = await supabase
                .rpc('get_available_slots', {
                    p_business_id: id,
                    p_date: selectedDate
                });

            if (error) {
                console.log('Error fetching slots (using mock):', error);
                // Mock slots for demo
                const mockSlots: TimeSlot[] = [
                    { time: '09:00', available: true },
                    { time: '10:00', available: true },
                    { time: '11:00', available: true },
                    { time: '14:00', available: true },
                    { time: '15:00', available: true },
                    { time: '16:00', available: true }
                ];
                setAvailableSlots(mockSlots);
            } else {
                setAvailableSlots(data || []);
            }
        } catch (error) {
            console.error('Error:', error);
            // Fallback mock slots
            setAvailableSlots([
                { time: '09:00', available: true },
                { time: '10:00', available: true },
                { time: '14:00', available: true }
            ]);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setBookingStep(2);
    };

    const handleDateSelect = (day: any) => {
        setSelectedDate(day.dateString);
        setSelectedTime(''); // Reset time when date changes
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const handleConfirmBooking = async () => {
        if (!selectedService || !selectedDate || !selectedTime) {
            Alert.alert('Error', 'Please select all booking details');
            return;
        }

        setBookingLoading(true);
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                Alert.alert('Error', 'You must be logged in to book');
                setBookingLoading(false);
                return;
            }

            // Create booking timestamp
            const bookingDateTime = `${selectedDate} ${selectedTime}:00`;

            // Insert booking
            const { data: booking, error: bookingError } = await supabase
                .from('bookings')
                .insert({
                    user_id: user.id,
                    business_id: id,
                    service_name: selectedService.name,
                    booking_date: bookingDateTime,
                    status: 'pending'
                })
                .select()
                .single();

            if (bookingError) throw bookingError;

            // Create or get conversation
            const { data: conversation, error: convError } = await supabase
                .from('conversations')
                .upsert({
                    user_id: user.id,
                    business_id: id
                }, { onConflict: 'user_id,business_id' })
                .select()
                .single();

            if (convError) throw convError;

            // Send system message
            const message = `🎉 New booking request!\n\nService: ${selectedService.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\n\nPlease confirm or reschedule.`;

            await supabase
                .from('messages')
                .insert({
                    conversation_id: conversation.id,
                    sender_id: user.id,
                    content: message
                });

            // Success - navigate to messages
            Alert.alert(
                'Booking Requested!',
                'Your booking request has been sent. The business will confirm shortly.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Reset wizard and stay on business screen
                            setBookingStep(0);
                            setSelectedService(null);
                            setSelectedDate('');
                            setSelectedTime('');
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Booking error:', error);

            // Check if it's a missing table error
            if (error.code === 'PGRST205' || error.message?.includes('not find the table')) {
                Alert.alert(
                    'Database Setup Required',
                    'The booking system needs to be configured in Supabase first.\n\n1. Open Supabase Dashboard\n2. Go to SQL Editor\n3. Run the migration from booking_system.sql\n\nSee BUSINESS_OWNER_GUIDE.md for detailed instructions.',
                    [
                        { text: 'Got it', style: 'cancel' }
                    ]
                );
            } else {
                Alert.alert('Error', error.message || 'Failed to create booking');
            }
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
                <ActivityIndicator size="large" color="#7c3aed" />
            </SafeAreaView>
        );
    }

    if (!business) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-slate-500 mb-4">Business not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-violet-600 font-bold">Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const services = business.services || [
        { name: 'Standard Service', duration: 60, price: 100 }
    ];

    // Get today's date for calendar minimum date
    const today = new Date().toISOString().split('T')[0];

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bookingStep === 0 ? 120 : 20 }}>
                {/* Hero Image */}
                <Animated.View entering={FadeInUp.duration(600)} className="w-full h-80 relative">
                    <Image
                        source={{ uri: business.image_url || 'https://via.placeholder.com/600' }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Header Controls */}
                    <SafeAreaView className="absolute top-0 w-full flex-row justify-between px-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center">
                            <Ionicons name="heart-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </SafeAreaView>

                    {/* Basic Info Overlay */}
                    <View className="absolute bottom-6 left-6 right-6">
                        <View className="flex-row items-center mb-2">
                            <View className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                <Text className="text-white text-xs font-semibold uppercase">{business.category}</Text>
                            </View>
                            <View className="ml-3 flex-row items-center bg-yellow-400/90 px-2 py-1 rounded-lg">
                                <Star size={12} color="black" fill="black" />
                                <Text className="text-black text-xs font-bold ml-1">{business.rating || 'N/A'}</Text>
                            </View>
                        </View>
                        <Text className="text-white text-3xl font-bold tracking-tight shadow-sm">{business.name}</Text>
                    </View>
                </Animated.View>

                {/* Content */}
                <View className="px-6 py-8 bg-slate-50 -mt-6 rounded-t-3xl min-h-screen">

                    {/* About Section */}
                    <View className="mb-8">
                        <Text className="text-lg font-bold text-slate-900 mb-3">About</Text>
                        <Text className="text-slate-500 leading-6 text-base">
                            {business.description || 'No description available for this business.'}
                        </Text>
                    </View>

                    {/* Details Cards */}
                    <View className="gap-4 mb-8">
                        <View className="bg-white p-4 rounded-xl flex-row items-start border border-slate-100 shadow-sm">
                            <View className="h-10 w-10 bg-violet-50 rounded-full items-center justify-center mr-4">
                                <MapPin size={20} color="#7c3aed" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-slate-900 mb-1">Address</Text>
                                <Text className="text-slate-500 text-sm leading-5">{business.address || 'Address not available'}</Text>
                            </View>
                        </View>

                        <View className="bg-white p-4 rounded-xl flex-row items-center border border-slate-100 shadow-sm">
                            <View className="h-10 w-10 bg-orange-50 rounded-full items-center justify-center mr-4">
                                <Clock size={20} color="#f97316" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-slate-900 mb-1">Hours</Text>
                                <Text className="text-green-600 text-sm font-medium">Open Now • Closes 6 PM</Text>
                            </View>
                        </View>
                    </View>

                    {/* Booking Wizard */}
                    {bookingStep > 0 && (
                        <View className="bg-white rounded-3xl p-6 border border-violet-100 mb-6">
                            {/* Progress Steps */}
                            <View className="flex-row items-center mb-6">
                                {[1, 2, 3].map((step) => (
                                    <View key={step} className="flex-1 flex-row items-center">
                                        <View className={`h-8 w-8 rounded-full items-center justify-center ${bookingStep >= step ? 'bg-violet-600' : 'bg-slate-200'}`}>
                                            {bookingStep > step ? (
                                                <Check size={16} color="white" />
                                            ) : (
                                                <Text className={`font-bold ${bookingStep >= step ? 'text-white' : 'text-slate-400'}`}>{step}</Text>
                                            )}
                                        </View>
                                        {step < 3 && <View className={`flex-1 h-1 mx-2 ${bookingStep > step ? 'bg-violet-600' : 'bg-slate-200'}`} />}
                                    </View>
                                ))}
                            </View>

                            {/* Step 1: Service Selection */}
                            {bookingStep === 1 && (
                                <View>
                                    <Text className="text-xl font-bold text-slate-900 mb-4">Select a Service</Text>
                                    {services.map((service: Service, index: number) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => handleServiceSelect(service)}
                                            className="bg-slate-50 p-4 rounded-2xl mb-3 border border-slate-100 active:bg-violet-50"
                                        >
                                            <Text className="text-base font-bold text-slate-900 mb-1">{service.name}</Text>
                                            <View className="flex-row items-center">
                                                <Text className="text-slate-500 text-sm">{service.duration} min</Text>
                                                <Text className="text-slate-400 mx-2">•</Text>
                                                <Text className="text-violet-600 font-bold text-sm">
                                                    {service.price === 0 ? 'Free' : `$${service.price}`}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {/* Step 2: Date & Time Selection */}
                            {bookingStep === 2 && (
                                <View>
                                    <View className="flex-row items-center justify-between mb-4">
                                        <Text className="text-xl font-bold text-slate-900">Select Date & Time</Text>
                                        <TouchableOpacity onPress={() => setBookingStep(1)}>
                                            <Text className="text-violet-600 font-semibold">Change Service</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Selected Service Summary */}
                                    <View className="bg-violet-50 p-3 rounded-xl mb-4">
                                        <Text className="text-violet-900 font-bold">{selectedService?.name}</Text>
                                        <Text className="text-violet-600 text-sm">{selectedService?.duration} min • ${selectedService?.price}</Text>
                                    </View>

                                    {/* Calendar */}
                                    <RNCalendar
                                        minDate={today}
                                        onDayPress={handleDateSelect}
                                        markedDates={{
                                            [selectedDate]: { selected: true, selectedColor: '#7c3aed' }
                                        }}
                                        theme={{
                                            todayTextColor: '#7c3aed',
                                            arrowColor: '#7c3aed',
                                            monthTextColor: '#0f172a',
                                            textMonthFontWeight: 'bold'
                                        }}
                                    />

                                    {/* Time Slots */}
                                    {selectedDate && (
                                        <View className="mt-6">
                                            <Text className="text-base font-bold text-slate-900 mb-3">Available Times</Text>
                                            {loadingSlots ? (
                                                <ActivityIndicator color="#7c3aed" />
                                            ) : availableSlots.length > 0 ? (
                                                <View className="flex-row flex-wrap gap-2">
                                                    {availableSlots.map((slot, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            onPress={() => handleTimeSelect(slot.time)}
                                                            className={`px-4 py-3 rounded-xl border ${selectedTime === slot.time
                                                                ? 'bg-violet-600 border-violet-600'
                                                                : 'bg-white border-slate-200'
                                                                }`}
                                                        >
                                                            <Text className={`font-semibold ${selectedTime === slot.time ? 'text-white' : 'text-slate-700'
                                                                }`}>
                                                                {slot.time}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            ) : (
                                                <Text className="text-slate-400 text-center py-4">No available slots for this date</Text>
                                            )}
                                        </View>
                                    )}

                                    {/* Next Button */}
                                    {selectedDate && selectedTime && (
                                        <TouchableOpacity
                                            onPress={() => setBookingStep(3)}
                                            className="bg-violet-600 p-4 rounded-2xl mt-6"
                                        >
                                            <Text className="text-white font-bold text-center text-base">Continue</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}

                            {/* Step 3: Confirmation */}
                            {bookingStep === 3 && (
                                <View>
                                    <Text className="text-xl font-bold text-slate-900 mb-4">Confirm Booking</Text>

                                    <View className="bg-slate-50 p-4 rounded-2xl mb-6 space-y-3">
                                        <View>
                                            <Text className="text-slate-500 text-xs mb-1">Business</Text>
                                            <Text className="text-slate-900 font-bold">{business.name}</Text>
                                        </View>
                                        <View className="h-px bg-slate-200 my-2" />
                                        <View>
                                            <Text className="text-slate-500 text-xs mb-1">Service</Text>
                                            <Text className="text-slate-900 font-bold">{selectedService?.name}</Text>
                                            <Text className="text-slate-600 text-sm">{selectedService?.duration} min • ${selectedService?.price}</Text>
                                        </View>
                                        <View className="h-px bg-slate-200 my-2" />
                                        <View>
                                            <Text className="text-slate-500 text-xs mb-1">Date & Time</Text>
                                            <Text className="text-slate-900 font-bold">{selectedDate} at {selectedTime}</Text>
                                        </View>
                                    </View>

                                    <View className="flex-row gap-3">
                                        <TouchableOpacity
                                            onPress={() => setBookingStep(2)}
                                            className="flex-1 bg-slate-100 p-4 rounded-2xl"
                                        >
                                            <Text className="text-slate-700 font-bold text-center">Back</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={handleConfirmBooking}
                                            disabled={bookingLoading}
                                            className="flex-[2] bg-violet-600 p-4 rounded-2xl"
                                        >
                                            {bookingLoading ? (
                                                <ActivityIndicator color="white" />
                                            ) : (
                                                <Text className="text-white font-bold text-center">Confirm Booking</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Sticky Action Bar - Only show when wizard is closed */}
            {bookingStep === 0 && (
                <View className="absolute bottom-0 w-full bg-white border-t border-slate-100 px-6 pt-4 pb-8 flex-row gap-4 shadow-lg shadow-black/5">
                    <TouchableOpacity
                        className="flex-1 h-14 bg-slate-100 border border-slate-200 rounded-2xl items-center justify-center"
                        onPress={() => Alert.alert('Messages', 'Your booking has been saved! You can view messages in the Messages tab.')}
                    >
                        <Text className="text-slate-500 font-bold text-base">Chat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="flex-[2] h-14 bg-violet-600 rounded-2xl items-center justify-center shadow-lg shadow-violet-200"
                        onPress={() => setBookingStep(1)}
                    >
                        <Text className="text-white font-bold text-base">Book Now</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
