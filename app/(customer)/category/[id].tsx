import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin } from 'lucide-react-native';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BUSINESSES, CATEGORIES } from '../../../constants/data';

const { width } = Dimensions.get('window');

export default function CategoryScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const category = CATEGORIES.find(c => c.id === id);
    const filteredBusinesses = BUSINESSES.filter(b => b.category === id);

    const renderBusinessItem = ({ item, index }: { item: typeof BUSINESSES[0], index: number }) => (
        <Animated.View
            entering={FadeInDown.delay(100 + index * 100).springify()}
            className="mb-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
            <View className="h-40 bg-slate-100 relative">
                <Image
                    source={{ uri: item.image }}
                    className="h-full w-full"
                    resizeMode="cover"
                />
                <View className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm flex-row items-center">
                    <Text className="text-[10px] font-bold text-slate-900">⭐ {item.rating}</Text>
                </View>
            </View>
            <View className="p-4">
                <View className="flex-row justify-between items-start mb-1">
                    <Text className="font-bold text-lg text-slate-900 tracking-tight flex-1 mr-2">{item.name}</Text>
                    <View className="bg-slate-50 px-2 py-1 rounded-md">
                        <Text className="text-slate-500 text-[10px] font-medium">{item.type}</Text>
                    </View>
                </View>

                <View className="flex-row items-center mt-2">
                    <MapPin size={14} color="#94a3b8" />
                    <Text className="text-slate-400 text-xs ml-1">1.2km away • Open Now</Text>
                </View>
            </View>
        </Animated.View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center border-b border-slate-100 bg-white">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="h-10 w-10 bg-slate-50 rounded-full items-center justify-center mr-4"
                >
                    <ChevronLeft size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-slate-900 tracking-tight">
                    {category?.name || 'Category'}
                </Text>
            </View>

            {/* List */}
            <FlatList
                data={filteredBusinesses}
                renderItem={renderBusinessItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Text className="text-slate-400 text-base">No businesses found in this category yet.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
