import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Briefcase, ChevronRight, Chrome, Facebook, User } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

type Role = 'customer' | 'business';

export default function LoginScreen() {
    const router = useRouter();
    const [role, setRole] = useState<Role>('customer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoadingSocial, setIsLoadingSocial] = useState<string | null>(null);

    const handleLogin = () => {
        if (role === 'customer') {
            router.replace('/customer/home');
        } else {
            router.replace('/business/dashboard'); // Placeholder as requested
        }
    };

    const handleSocialLogin = (provider: string) => {
        setIsLoadingSocial(provider);
        setTimeout(() => {
            setIsLoadingSocial(null);
            router.replace('/customer/home');
        }, 1000);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>Welcome to</Text>
                    <Text style={styles.title}>RDV</Text>
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

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Enter App</Text>
                        <ChevronRight size={20} color="#FFFFFF" />
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
                            disabled={!!isLoadingSocial}
                        >
                            {isLoadingSocial === 'google' ? (
                                <ActivityIndicator color="#0f172a" />
                            ) : (
                                <>
                                    <Chrome size={20} color="#0f172a" />
                                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.socialButton, styles.facebookButton]}
                            onPress={() => handleSocialLogin('facebook')}
                            disabled={!!isLoadingSocial}
                        >
                            {isLoadingSocial === 'facebook' ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Facebook size={20} color="#FFFFFF" />
                                    <Text style={[styles.socialButtonText, styles.facebookText]}>Continue with Facebook</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
        marginBottom: 40,
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
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        gap: 16,
    },
    roleCard: {
        flex: 1,
        height: 120,
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
        marginTop: 12,
        fontSize: 16,
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
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
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
