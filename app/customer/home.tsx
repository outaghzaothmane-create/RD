import { StatusBar } from 'expo-status-bar';
import { Car, Cross, Dumbbell, LogOut, MapPin, PawPrint, Search, Sparkles, Utensils } from 'lucide-react-native';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const CATEGORIES = [
    { id: '1', name: 'Health', icon: Cross, bg: '#fee2e2', color: '#ef4444' }, // Pastel Red
    { id: '2', name: 'Food', icon: Utensils, bg: '#ffedd5', color: '#f97316' }, // Pastel Orange
    { id: '3', name: 'Beauty', icon: Sparkles, bg: '#fce7f3', color: '#ec4899' }, // Pastel Pink
    { id: '4', name: 'Gym', icon: Dumbbell, bg: '#dbeafe', color: '#3b82f6' }, // Pastel Blue
    { id: '5', name: 'Auto', icon: Car, bg: '#f1f5f9', color: '#64748b' }, // Pastel Grey
    { id: '6', name: 'Pets', icon: PawPrint, bg: '#fef08a', color: '#eab308' }, // Pastel Yellow
];

import { useRouter } from 'expo-router';

export default function CustomerHome() {
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: () => router.replace('/auth/login')
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.name}>Othmane</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={styles.locationPill}>
                            <MapPin size={16} color="#1e3a8a" />
                            <Text style={styles.locationText}>Casablanca, MA</Text>
                        </View>
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                            <LogOut size={24} color="#ef4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Search size={20} color="#94a3b8" />
                        <TextInput
                            placeholder="Search for services..."
                            placeholderTextColor="#94a3b8"
                            style={styles.searchInput}
                        />
                    </View>
                </View>

                {/* Bento Grid */}
                <Text style={styles.sectionTitle}>Explore Categories</Text>
                <View style={styles.grid}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.card, { backgroundColor: cat.bg }]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.6)' }]}>
                                <cat.icon size={28} color={cat.color} />
                            </View>
                            <Text style={[styles.cardTitle, { color: cat.color }]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    greeting: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 4,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    locationPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
    logoutButton: {
        padding: 4,
    },
    searchContainer: {
        marginBottom: 32,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        height: 56,
        borderRadius: 28,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        gap: 12,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#0f172a',
        height: '100%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    card: {
        width: (width - 48 - 16) / 2, // (Screen width - padding - gap) / 2
        height: 160,
        borderRadius: 24,
        padding: 20,
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
