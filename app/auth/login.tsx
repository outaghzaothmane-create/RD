import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Briefcase, ChevronRight, Chrome, Facebook, User } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

type Role = 'customer' | 'business';

export default function LoginScreen() {
    const router = useRouter();
    const [role, setRole] = useState<Role>('customer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        try {
            if (isSignUp) {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: email.split('@')[0], // Default name from email
                            role: role, // Store role in metadata
                        }
                    }
                });

                if (error) throw error;

                if (data.session) {
                    router.replace(role === 'customer' ? '/(customer)/home' : '/business/dashboard');
                } else {
                    Alert.alert(
                        'Verification Needed',
                        'We sent you a confirmation email.\n\nSince you are on mobile, please check your email and click the link. If it doesn\'t open the app, try signing up via the Web version (localhost:8081) on your computer.'
                    );
                }

            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                // Simple redirection for now
                if (role === 'customer') {
                    router.replace('/(customer)/home');
                } else {
                    router.replace('/business/dashboard');
                }
            }
        } catch (error: any) {
            Alert.alert('Authentication Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        Alert.alert('Notice', 'Social login coming soon');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Welcome to</Text>
                    <Text style={styles.title}>RDV</Text>
                    <Text style={styles.modeText}>{isSignUp ? 'Create an account' : 'Log in to continue'}</Text>
                </View>

                {/* Role Toggle */}
                <View style={styles.roleContainer}>
                    <TouchableOpacity
                        style={[styles.roleCard, role === 'customer' && styles.roleCardActive]}
                        onPress={() => setRole('customer')}
                    >
                        <User size={32} color={role === 'customer' ? '#FFFFFF' : '#64748b'} />
                        <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>Customer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.roleCard, role === 'business' && styles.roleCardActive]}
                        onPress={() => setRole('business')}
                    >
                        <Briefcase size={32} color={role === 'business' ? '#FFFFFF' : '#64748b'} />
                        <Text style={[styles.roleText, role === 'business' && styles.roleTextActive]}>Business</Text>
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="name@example.com"
                            placeholderTextColor="#94a3b8"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#94a3b8"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>{isSignUp ? 'Sign Up' : 'Log In'}</Text>
                                <ChevronRight size={20} color="#FFFFFF" />
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setIsSignUp(!isSignUp)}
                    >
                        <Text style={styles.toggleText}>
                            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
                        </Text>
                    </TouchableOpacity>

                    {/* Social Login */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity
                            style={[styles.socialButton, styles.googleButton]}
                            onPress={() => handleSocialLogin('google')}
                        >
                            <Chrome size={20} color="#0f172a" />
                            <Text style={styles.socialButtonText}>Continue with Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.socialButton, styles.facebookButton]}
                            onPress={() => handleSocialLogin('facebook')}
                        >
                            <Facebook size={20} color="#FFFFFF" />
                            <Text style={[styles.socialButtonText, styles.facebookText]}>Continue with Facebook</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Demo Mode Actions */}
                <View style={{ marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#e2e8f0' }}>
                    <Text style={{ textAlign: 'center', color: '#64748b', marginBottom: 12, fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Developer Options
                    </Text>
                    <View style={{ gap: 12 }}>
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: '#f1f5f9', borderStyle: 'dashed' }]}
                            onPress={() => router.replace('/(customer)/home')}
                        >
                            <User size={20} color="#475569" />
                            <Text style={[styles.socialButtonText, { color: '#475569' }]}>Explore as Guest (Customer)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: '#f1f5f9', borderStyle: 'dashed' }]}
                            onPress={async () => {
                                await supabase.auth.signOut();
                                router.replace('/business/dashboard');
                            }}
                        >
                            <Briefcase size={20} color="#475569" />
                            <Text style={[styles.socialButtonText, { color: '#475569' }]}>Demo Business Dashboard</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 20,
        color: '#64748b',
        marginBottom: 4,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 8,
    },
    modeText: {
        fontSize: 16,
        color: '#94a3b8',
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        gap: 16,
    },
    roleCard: {
        flex: 1,
        height: 100,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e2e8f0',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
    },
    roleCardActive: {
        backgroundColor: '#1e3a8a',
        borderColor: '#1e3a8a',
        transform: [{ scale: 1.02 }],
    },
    roleText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    roleTextActive: {
        color: '#FFFFFF',
    },
    formContainer: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#ffffff',
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#0f172a',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    button: {
        height: 56,
        backgroundColor: '#1e3a8a',
        borderRadius: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#1e3a8a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
        gap: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    toggleButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    toggleText: {
        color: '#1e3a8a',
        fontSize: 14,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#94a3b8',
        fontSize: 14,
        fontWeight: '600',
    },
    socialContainer: {
        gap: 16,
    },
    socialButton: {
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
    },
    googleButton: {
        // Default styles match Google
    },
    facebookButton: {
        backgroundColor: '#1877F2',
        borderColor: '#1877F2',
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
    },
    facebookText: {
        color: '#ffffff',
    },
});
