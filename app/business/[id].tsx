import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Clock, MapPin, Star } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BUSINESSES } from '../../constants/data';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

export default function BusinessProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [business, setBusiness] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchBusiness();
    }, [id]);

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
            // Final fallback check
            const mockBusiness = BUSINESSES.find(b => b.id === id);
            if (mockBusiness) setBusiness(mockBusiness);
        } finally {
            setLoading(false);
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

    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
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
                    <View className="gap-4">
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
                </View>
            </ScrollView>

            {/* Sticky Action Bar */}
            <View className="absolute bottom-0 w-full bg-white border-t border-slate-100 px-6 pt-4 pb-8 flex-row gap-4 shadow-lg shadow-black/5">
                <TouchableOpacity className="flex-1 h-14 bg-white border border-slate-200 rounded-2xl items-center justify-center" onPress={() => router.push({ pathname: '/(customer)/messages', params: { id: business.id } })}>
                    <Text className="text-slate-900 font-bold text-base">Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-[2] h-14 bg-violet-600 rounded-2xl items-center justify-center shadow-lg shadow-violet-200">
                    <Text className="text-white font-bold text-base">Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
