import { useRouter } from 'expo-router';
import { Camera, LogOut, Mail, Phone, Save, User } from 'lucide-react-native'; // Using standard icons
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [session, setSession] = useState<any>(null);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace('/auth/login');
                return;
            }
            setSession(user);

            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, phone_number, avatar_url')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error(error);
            }

            if (data) {
                setFullName(data.full_name || '');
                setPhone(data.phone_number || '');
                setAvatarUrl(data.avatar_url || '');
            }
        } catch (e) {
            console.error('Error fetching profile:', e);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        if (!session?.id) return;
        setSaving(true);
        try {
            const updates = {
                id: session.id,
                full_name: fullName,
                phone_number: phone,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) throw error;
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) Alert.alert('Error', error.message);
        router.replace('/auth/login');
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-slate-50">
                <ActivityIndicator size="large" color="#7c3aed" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <Text className="text-3xl font-bold text-slate-900 mb-8">My Profile</Text>

                {/* Avatar Section */}
                <View className="items-center mb-8">
                    <View className="h-28 w-28 bg-violet-100 rounded-full items-center justify-center mb-3 relative border-4 border-white shadow-sm overflow-hidden">
                        {avatarUrl ? (
                            <Image source={{ uri: avatarUrl }} className="h-full w-full" />
                        ) : (
                            <User size={48} color="#7c3aed" />
                        )}
                        <TouchableOpacity className="absolute bottom-0 right-0 bg-violet-600 p-2 rounded-full border-2 border-white">
                            {/* Placeholder for real image upload */}
                            <Camera size={14} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-sm text-slate-500">Tap to change avatar</Text>
                </View>

                {/* Form Fields */}
                <View className="gap-4 mb-8">
                    <View>
                        <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">Full Name</Text>
                        <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-14">
                            <User size={20} color="#94a3b8" />
                            <TextInput
                                className="flex-1 ml-3 text-slate-900 font-medium"
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Enter your full name"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">Phone Number</Text>
                        <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-14">
                            <Phone size={20} color="#94a3b8" />
                            <TextInput
                                className="flex-1 ml-3 text-slate-900 font-medium"
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="+1 (555) 000-0000"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-slate-700 mb-2 ml-1">Email (Read Only)</Text>
                        <View className="flex-row items-center bg-slate-100 border border-slate-200 rounded-2xl px-4 h-14">
                            <Mail size={20} color="#94a3b8" />
                            <Text className="flex-1 ml-3 text-slate-500 font-medium">{session?.email}</Text>
                        </View>
                    </View>
                </View>

                {/* Debug Info */}
                <View className="mt-8 p-4 bg-slate-100 rounded-xl mb-10">
                    <Text className="text-xs font-bold text-slate-500 mb-1">DEBUG INFO:</Text>
                    <Text className="text-xs text-slate-400">Project URL: {process.env.EXPO_PUBLIC_SUPABASE_URL}</Text>
                    <Text className="text-xs text-slate-400 mt-1">If this URL does not match your current Supabase Dashboard URL, you are editing the wrong database.</Text>
                </View>

                {/* Actions */}
                <View className="gap-4">
                    <TouchableOpacity
                        onPress={updateProfile}
                        disabled={saving}
                        className={`bg-violet-600 h-14 rounded-2xl flex-row items-center justify-center shadow-lg shadow-violet-200 ${saving ? 'opacity-70' : ''}`}
                    >
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Save size={20} color="white" className="mr-2" />
                                <Text className="text-white font-bold text-lg">Save Changes</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSignOut}
                        className="bg-white border border-slate-200 h-14 rounded-2xl flex-row items-center justify-center mt-2"
                    >
                        <LogOut size={20} color="#ef4444" className="mr-2" />
                        <Text className="text-red-500 font-bold text-lg">Sign Out</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
