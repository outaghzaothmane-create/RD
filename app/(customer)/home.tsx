import { Link, useRouter } from 'expo-router';
import { Filter, MapPin, Search, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BUSINESSES, CATEGORIES } from '../../constants/data';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

export default function CustomerHomeScreen() {
    const router = useRouter();
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBusinesses();
    }, []);

    // Real-time filtering
    useEffect(() => {
        filterBusinesses();
    }, [searchQuery, selectedCategory, businesses]);

    const fetchBusinesses = async () => {
        try {
            const { data, error } = await supabase
                .from('businesses')
                .select('*');

            if (error) {
                console.log('Supabase error (using mock data):', error.message);
                setBusinesses(BUSINESSES);
            } else if (data && data.length > 0) {
                setBusinesses(data);
            } else {
                setBusinesses(BUSINESSES);
            }
        } catch (e) {
            console.log('Error fetching, using fallback:', e);
            setBusinesses(BUSINESSES);
        } finally {
            setLoading(false);
        }
    };

    const filterBusinesses = () => {
        let filtered = [...businesses];

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(b => b.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                b.name.toLowerCase().includes(query) ||
                b.category.toLowerCase().includes(query) ||
                (b.description && b.description.toLowerCase().includes(query))
            );
        }

        setFilteredBusinesses(filtered);
    };

    const handleCategoryPress = (categoryId: string) => {
        if (selectedCategory === categoryId) {
            // Deselect if already selected
            setSelectedCategory(null);
        } else {
            setSelectedCategory(categoryId);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSelectedCategory(null);
    };

    const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== null;

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Header Section */}
                <Animated.View entering={FadeInDown.delay(100).springify()} className="px-6 pt-4 mb-6">
                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-slate-500 text-base font-medium mb-1">Good Morning,</Text>
                            <Text className="text-slate-900 text-3xl font-bold tracking-tight">Othmane</Text>
                        </View>
                        <TouchableOpacity className="h-10 w-10 rounded-full bg-white shadow-sm items-center justify-center border border-slate-100 overflow-hidden">
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                                className="h-full w-full"
                            />
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Category Filter Chips - Horizontal Scroll */}
                <Animated.View entering={FadeInDown.delay(150).springify()} className="mb-4">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="px-6"
                        contentContainerStyle={{ gap: 8 }}
                    >
                        {/* All Categories Chip */}
                        <TouchableOpacity
                            onPress={() => setSelectedCategory(null)}
                            className={`px-5 py-2.5 rounded-full border flex-row items-center ${selectedCategory === null
                                    ? 'bg-violet-600 border-violet-600'
                                    : 'bg-white border-slate-200'
                                }`}
                        >
                            <Filter size={16} color={selectedCategory === null ? 'white' : '#64748b'} />
                            <Text className={`ml-2 font-semibold ${selectedCategory === null ? 'text-white' : 'text-slate-600'
                                }`}>
                                All
                            </Text>
                        </TouchableOpacity>

                        {/* Category Chips */}
                        {CATEGORIES.map((category) => {
                            const Icon = category.icon;
                            const isSelected = selectedCategory === category.id;

                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    onPress={() => handleCategoryPress(category.id)}
                                    className={`px-5 py-2.5 rounded-full border flex-row items-center ${isSelected
                                            ? 'bg-violet-600 border-violet-600'
                                            : 'bg-white border-slate-200'
                                        }`}
                                >
                                    <Icon size={16} color={isSelected ? 'white' : category.iconColor} />
                                    <Text className={`ml-2 font-semibold ${isSelected ? 'text-white' : 'text-slate-600'
                                        }`}>
                                        {category.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </Animated.View>

                {/* Search Bar - "Floating Pill" */}
                <Animated.View entering={FadeInDown.delay(200).springify()} className="px-6 mb-8">
                    <View className="flex-row items-center bg-white rounded-full px-6 py-4 shadow-lg shadow-slate-200/50 border-[0.5px] border-slate-100">
                        <Search size={22} color="#7c3aed" strokeWidth={2.5} />
                        <TextInput
                            placeholder="Find a restaurant, doctor..."
                            className="flex-1 ml-4 text-base text-slate-900 font-medium"
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.trim() !== '' && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <X size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <View className="flex-row items-center mt-3 px-2">
                            <Text className="text-slate-500 text-sm">
                                {filteredBusinesses.length} result{filteredBusinesses.length !== 1 ? 's' : ''}
                            </Text>
                            <TouchableOpacity onPress={clearSearch} className="ml-auto">
                                <Text className="text-violet-600 font-semibold text-sm">Clear All</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                {/* Results Section */}
                {!hasActiveFilters ? (
                    <>
                        {/* Categories Grid - Only show when no filters */}
                        <View className="px-6 mb-4">
                            <Text className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Explore Categories</Text>

                            <View className="flex-row flex-wrap justify-between">
                                {CATEGORIES.map((category, index) => {
                                    const isLarge = category.size === 'large';

                                    return (
                                        <Animated.View
                                            key={category.id}
                                            entering={FadeInDown.delay(300 + index * 100).springify()}
                                            className={`${isLarge ? 'w-full mb-4' : 'w-[48%] mb-4'} `}
                                        >
                                            <TouchableOpacity
                                                onPress={() => handleCategoryPress(category.id)}
                                                className={`
                                                    rounded-3xl p-5 bg-white shadow-sm border border-slate-100
                                                    ${isLarge ? 'h-48' : 'h-40 justify-between'}
                                                    overflow-hidden relative
                                                `}
                                                activeOpacity={0.9}
                                            >
                                                {/* Background Image for Large Card */}
                                                {isLarge && category.image && (
                                                    <>
                                                        <Image
                                                            source={{ uri: category.image }}
                                                            className="absolute inset-0 w-full h-full opacity-20"
                                                            resizeMode="cover"
                                                        />
                                                        <View className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent" />
                                                    </>
                                                )}

                                                <View className="flex-1 justify-between relative z-10">
                                                    <View className={`h-12 w-12 rounded-full items-center justify-center bg-slate-50 border border-slate-100`}>
                                                        <category.icon size={22} color={category.iconColor} />
                                                    </View>

                                                    <View>
                                                        <Text className="text-lg font-bold text-slate-900 tracking-tight">{category.name}</Text>
                                                        <Text className="text-slate-400 text-xs font-medium">
                                                            {businesses.filter(b => b.category === category.id).length} Places
                                                        </Text>
                                                    </View>
                                                </View>

                                                {/* Decorative Arrow */}
                                                <View className="absolute top-5 right-5 z-10">
                                                    <View className="h-8 w-8 rounded-full bg-slate-50 items-center justify-center">
                                                        <Text className="text-slate-300 transform -rotate-45 text-xs">➜</Text>
                                                    </View>
                                                </View>

                                            </TouchableOpacity>
                                        </Animated.View>
                                    )
                                })}
                            </View>
                        </View>

                        {/* Popular Section */}
                        <View className="px-6">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-bold text-slate-900 tracking-tight">Popular Near You</Text>
                                <Text className="text-violet-600 font-semibold text-sm">See All</Text>
                            </View>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6 pb-20">
                                {businesses.slice(0, 5).map((business, index) => (
                                    <Animated.View
                                        key={business.id}
                                        entering={FadeInDown.delay(600 + index * 100).springify()}
                                        className="mr-5 w-72 bg-white rounded-3xl shadow-md shadow-slate-200/50 border border-slate-100"
                                    >
                                        <Link href={`/business/${business.id}`} asChild>
                                            <TouchableOpacity activeOpacity={0.9}>
                                                <View className="h-40 bg-slate-200 rounded-t-3xl relative overflow-hidden">
                                                    <Image
                                                        source={{ uri: business.image_url || 'https://via.placeholder.com/400' }}
                                                        className="h-full w-full"
                                                        resizeMode="cover"
                                                    />
                                                    <View className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm flex-row items-center">
                                                        <Text className="text-[10px] font-bold text-slate-900">⭐ {business.rating || 'N/A'}</Text>
                                                    </View>
                                                </View>
                                                <View className="p-4">
                                                    <Text className="font-bold text-base text-slate-900 tracking-tight mb-1" numberOfLines={1}>{business.name}</Text>
                                                    <View className="flex-row items-center mb-2">
                                                        <Text className="text-slate-500 text-xs font-medium capitalize">{business.category} • {business.price_range || '$$'}</Text>
                                                    </View>

                                                    <View className="flex-row items-center">
                                                        <MapPin size={12} color="#94a3b8" />
                                                        <Text className="text-slate-400 text-[10px] ml-1" numberOfLines={1}>{business.address || 'Location N/A'}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </Link>
                                    </Animated.View>
                                ))}
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    /* Filtered Results Grid */
                    <View className="px-6">
                        <Text className="text-lg font-bold text-slate-900 mb-4 tracking-tight">
                            {selectedCategory ? CATEGORIES.find(c => c.id === selectedCategory)?.name : 'Search Results'}
                        </Text>

                        {filteredBusinesses.length > 0 ? (
                            <View className="gap-4 pb-20">
                                {filteredBusinesses.map((business, index) => (
                                    <Animated.View
                                        key={business.id}
                                        entering={FadeInDown.delay(index * 50).springify()}
                                    >
                                        <Link href={`/business/${business.id}`} asChild>
                                            <TouchableOpacity
                                                className="bg-white rounded-3xl overflow-hidden shadow-md shadow-slate-200/50 border border-slate-100"
                                                activeOpacity={0.9}
                                            >
                                                <View className="flex-row">
                                                    <View className="w-32 h-32 bg-slate-200">
                                                        <Image
                                                            source={{ uri: business.image_url || 'https://via.placeholder.com/400' }}
                                                            className="w-full h-full"
                                                            resizeMode="cover"
                                                        />
                                                    </View>
                                                    <View className="flex-1 p-4 justify-between">
                                                        <View>
                                                            <Text className="font-bold text-base text-slate-900 mb-1" numberOfLines={1}>
                                                                {business.name}
                                                            </Text>
                                                            <Text className="text-slate-500 text-xs font-medium capitalize mb-2">
                                                                {business.category} • {business.price_range || '$$'}
                                                            </Text>
                                                        </View>
                                                        <View className="flex-row items-center justify-between">
                                                            <View className="flex-row items-center">
                                                                <MapPin size={12} color="#94a3b8" />
                                                                <Text className="text-slate-400 text-[10px] ml-1" numberOfLines={1}>
                                                                    2.5 km away
                                                                </Text>
                                                            </View>
                                                            <View className="bg-yellow-50 px-2 py-1 rounded-lg">
                                                                <Text className="text-[10px] font-bold text-slate-900">
                                                                    ⭐ {business.rating || 'N/A'}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </Link>
                                    </Animated.View>
                                ))}
                            </View>
                        ) : (
                            /* Empty State */
                            <Animated.View
                                entering={FadeInDown.delay(200).springify()}
                                className="items-center py-16"
                            >
                                <View className="h-20 w-20 rounded-full bg-slate-100 items-center justify-center mb-4">
                                    <Search size={32} color="#94a3b8" />
                                </View>
                                <Text className="text-slate-900 font-bold text-lg mb-2">No Results Found</Text>
                                <Text className="text-slate-500 text-center mb-6 px-8">
                                    We couldn't find any businesses matching your search.
                                </Text>
                                <TouchableOpacity onPress={clearSearch} className="bg-violet-600 px-6 py-3 rounded-full">
                                    <Text className="text-white font-bold">Clear Filters</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
