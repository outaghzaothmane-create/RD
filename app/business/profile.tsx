import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function BusinessProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'healthcare', // Default
        description: '',
        address: '',
        image_url: '',
        price_range: '$$',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Demo Mode
                setFormData({
                    name: 'Demo Clinic',
                    category: 'healthcare',
                    description: 'This is a demo business profile. You are in Guest Mode.',
                    address: '123 Demo St, Virtual City',
                    image_url: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&q=80',
                    price_range: '$$',
                });
                return;
            }

            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') {
                console.error('Error fetching profile:', error);
            }

            if (data) {
                setFormData({
                    name: data.name,
                    category: data.category,
                    description: data.description || '',
                    address: data.address || '',
                    image_url: data.image_url || '',
                    price_range: data.price_range || '$$',
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                Alert.alert('Demo Mode', 'Changes cannot be saved in Guest/Demo mode. Please log in to create a real business.');
                setSaving(false);
                return;
            }

            const { error } = await supabase
                .from('businesses')
                .upsert({
                    owner_id: user.id,
                    ...formData,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'owner_id' });

            if (error) throw error;

            Alert.alert('Success', 'Business profile saved successfully!');
            router.back();

        } catch (error: any) {
            if (error.code === '42P01' || error.message.includes('relation "public.businesses" does not exist')) {
                Alert.alert('Database Setup Required', 'The "businesses" table does not exist yet. Please run the SQL command in Supabase.');
            } else {
                Alert.alert('Error', error.message);
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#7c3aed" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
            <View className="px-6 py-4 border-b border-slate-100 bg-white flex-row justify-between items-center">
                <Text className="text-xl font-bold text-slate-900">Edit Profile</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-slate-500">Cancel</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-slate-700 mb-2">Business Name</Text>
                    <TextInput
                        className="bg-white border border-slate-200 rounded-xl p-4 text-base text-slate-900"
                        placeholder="e.g. Dr. House Clinic"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-semibold text-slate-700 mb-2">Category</Text>
                    <View className="flex-row gap-2 flex-wrap">
                        {['healthcare', 'dining', 'fitness', 'beauty', 'auto', 'pets'].map(cat => (
                            <TouchableOpacity
                                key={cat}
                                onPress={() => setFormData({ ...formData, category: cat })}
                                className={`px-4 py-2 rounded-full border ${formData.category === cat ? 'bg-violet-600 border-violet-600' : 'bg-white border-slate-200'}`}
                            >
                                <Text className={`capitalize ${formData.category === cat ? 'text-white' : 'text-slate-600'}`}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-semibold text-slate-700 mb-2">Description</Text>
                    <TextInput
                        className="bg-white border border-slate-200 rounded-xl p-4 text-base text-slate-900 min-h-[100px]"
                        placeholder="Tell customers about your business..."
                        multiline
                        textAlignVertical="top"
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-semibold text-slate-700 mb-2">Address</Text>
                    <TextInput
                        className="bg-white border border-slate-200 rounded-xl p-4 text-base text-slate-900"
                        placeholder="123 Main St, City"
                        value={formData.address}
                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-semibold text-slate-700 mb-2">Image URL</Text>
                    <TextInput
                        className="bg-white border border-slate-200 rounded-xl p-4 text-base text-slate-900"
                        placeholder="https://..."
                        value={formData.image_url}
                        autoCapitalize="none"
                        onChangeText={(text) => setFormData({ ...formData, image_url: text })}
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-sm font-semibold text-slate-700 mb-2">Price Range</Text>
                    <View className="flex-row gap-2">
                        {['$', '$$', '$$$', '$$$$'].map(price => (
                            <TouchableOpacity
                                key={price}
                                onPress={() => setFormData({ ...formData, price_range: price })}
                                className={`flex-1 items-center py-3 rounded-lg border ${formData.price_range === price ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-200'}`}
                            >
                                <Text className={`font-medium ${formData.price_range === price ? 'text-white' : 'text-slate-600'}`}>
                                    {price}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    className={`h-14 rounded-xl items-center justify-center ${saving ? 'bg-violet-400' : 'bg-violet-600'} shadow-lg shadow-violet-200`}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Save Profile</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
