import { Dumbbell, Scissors, Search, Sparkles, Stethoscope, Utensils } from 'lucide-react-native';
import { Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const categories = [
    {
        id: 'food',
        name: 'Food & Drink',
        icon: Utensils,
        color: 'bg-orange-100',
        iconColor: '#f97316', // orange-500
        size: 'large', // Spans full width or large block
    },
    {
        id: 'health',
        name: 'Health',
        icon: Stethoscope,
        color: 'bg-emerald-100',
        iconColor: '#10b981', // emerald-500
        size: 'small',
    },
    {
        id: 'beauty',
        name: 'Beauty',
        icon: Sparkles,
        color: 'bg-purple-100',
        iconColor: '#a855f7', // purple-500
        size: 'small',
    },
    {
        id: 'salon',
        name: 'Salon',
        icon: Scissors,
        color: 'bg-pink-100',
        iconColor: '#ec4899', // pink-500
        size: 'small',
    },
    {
        id: 'fitness',
        name: 'Fitness',
        icon: Dumbbell,
        color: 'bg-blue-100',
        iconColor: '#3b82f6', // blue-500
        size: 'small',
    },
];

export default function CustomerHomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white pt-2">
            <ScrollView showsVerticalScrollIndicator={false} className="px-5">

                {/* Header */}
                <View className="flex-row justify-between items-center mb-6 mt-2">
                    <View>
                        <Text className="text-slate-500 text-sm font-medium">Location</Text>
                        <Text className="text-slate-800 text-lg font-bold">New York, USA</Text>
                    </View>
                    <View className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center">
                        <Text className="text-lg">👤</Text>
                    </View>
                </View>

                {/* Global Search Pill */}
                <View className="flex-row items-center bg-slate-50 rounded-full px-5 py-4 mb-8 shadow-sm">
                    <Search size={20} color="#94a3b8" />
                    <TextInput
                        placeholder="Search for restaurants, doctors..."
                        className="flex-1 ml-3 text-base text-slate-700"
                        placeholderTextColor="#94a3b8"
                    />
                </View>

                {/* Categories Grid (Bento Style) */}
                <Text className="text-2xl font-bold text-slate-800 mb-4">Explore</Text>

                <View className="flex-row flex-wrap justify-between">
                    {categories.map((category, index) => {
                        const isLarge = category.size === 'large';

                        return (
                            <TouchableOpacity
                                key={category.id}
                                className={`
                    mb-4 rounded-3xl p-5 justify-between
                    ${category.color}
                    ${isLarge ? 'w-full h-40 flex-row items-center' : 'w-[48%] h-40'}
                  `}
                                activeOpacity={0.9}
                            >
                                <View className={`${isLarge ? 'flex-1' : ''}`}>
                                    <View className="bg-white/60 h-10 w-10 rounded-full items-center justify-center mb-3 self-start">
                                        <category.icon size={22} color={category.iconColor} />
                                    </View>
                                    <Text className="text-xl font-bold text-slate-800">{category.name}</Text>
                                    {isLarge && (
                                        <Text className="text-slate-600 mt-1">Book tables at top rated restaurants near you.</Text>
                                    )}
                                </View>

                                {isLarge && (
                                    <View className="bg-white/40 h-24 w-24 rounded-full items-center justify-center -mr-8">
                                        <Utensils size={40} color={category.iconColor} style={{ opacity: 0.5 }} />
                                    </View>
                                )}

                            </TouchableOpacity>
                        )
                    })}
                </View>

                {/* Featured Section (Placeholder) */}
                <Text className="text-xl font-bold text-slate-800 mt-2 mb-4">Popular Near You</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 pb-8">
                    {[1, 2, 3].map((item) => (
                        <View key={item} className="mr-4 w-64 bg-white border border-slate-100 rounded-2xl p-3 shadow-sm">
                            <View className="h-32 bg-slate-200 rounded-xl mb-3" />
                            <Text className="font-bold text-lg text-slate-800">Business Name {item}</Text>
                            <Text className="text-slate-500">Subtitle or category</Text>
                        </View>
                    ))}
                </ScrollView>

            </ScrollView>
        </SafeAreaView>
    );
}
