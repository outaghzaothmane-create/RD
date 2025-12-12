import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Keyboard, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BUSINESSES } from '../../constants/data';
import { supabase } from '../../lib/supabase';

export default function MessagesScreen() {
    const router = useRouter();

    const { id } = useLocalSearchParams(); // This is business_id
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [businessName, setBusinessName] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Responsive Hooks
    const tabBarHeight = useBottomTabBarHeight();
    const insets = useSafeAreaInsets();
    // Default fallback if hook is undefined (e.g. outside nav)
    const effectiveTabBarHeight = tabBarHeight || 50;

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const keyboardShowListener = Keyboard.addListener(
            showEvent,
            (e) => setKeyboardHeight(e.endCoordinates.height)
        );
        const keyboardHideListener = Keyboard.addListener(
            hideEvent,
            () => setKeyboardHeight(0)
        );

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    useEffect(() => {
        setupChat();
    }, [id]);

    const setupChat = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);

            if (id) {
                setActiveChat(id as string);

                // 1. Get Business Details
                const { data: biz } = await supabase.from('businesses').select('name').eq('id', id).single();
                if (biz) setBusinessName(biz.name);
                else {
                    const mock = BUSINESSES.find(b => b.id === id);
                    if (mock) setBusinessName(mock.name);
                }

                if (user) {
                    // 2. Find or Create Conversation
                    try {
                        let { data: conv, error } = await supabase
                            .from('conversations')
                            .select('id')
                            .eq('user_id', user.id)
                            .eq('business_id', id)
                            .single();

                        if (error && error.code !== 'PGRST116') throw error;

                        if (!conv) {
                            const { data: newConv, error: createError } = await supabase
                                .from('conversations')
                                .insert({ user_id: user.id, business_id: id })
                                .select()
                                .single();
                            if (createError) throw createError;
                            conv = newConv;
                        }

                        if (conv) {
                            setConversationId(conv.id);
                            subscribeToMessages(conv.id);
                            fetchMessages(conv.id);
                        }
                    } catch (dbError: any) {
                        console.log('Chat DB Error (falling back to local):', dbError.message);
                        // Fallback to local mock mode if DB fails
                        setConversationId('mock-conv-id');
                        setMessages([{ id: '1', content: `(Offline Mode) asking ${BUSINESSES.find(b => b.id === id)?.name || 'Business'}`, sender_id: 'system', created_at: new Date().toISOString() }]);
                    }
                } else {
                    // Guest Mode
                    setMessages([{ id: '1', content: `(Guest Mode) asking ${BUSINESSES.find(b => b.id === id)?.name || 'Business'}`, sender_id: 'system', created_at: new Date().toISOString() }]);
                }
            } else {
                setActiveChat(null);
                setMessages([]);
            }
        } catch (e) {
            console.error('Setup error:', e);
        }
    };

    const fetchMessages = async (convId: string) => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });
        if (data) setMessages(data);
    };

    const subscribeToMessages = (convId: string) => {
        const subscription = supabase
            .channel(`conversation:${convId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(subscription);
    };

    const sendMessage = async () => {
        if (!message.trim()) return;

        // Offline / Guest / Mock Handling
        if (!currentUser || conversationId === 'mock-conv-id') {
            const tempId = Date.now().toString();
            setMessages(prev => [...prev, { id: tempId, content: message, sender_id: currentUser?.id || 'guest', created_at: new Date().toISOString() }]);
            setMessage('');

            // Auto-reply
            setTimeout(() => {
                setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), content: "I'm a demo bot! (Database not connected yet)", sender_id: 'system', created_at: new Date().toISOString() }]);
            }, 1000);
            return;
        }

        if (!conversationId) return;

        try {
            const { error } = await supabase.from('messages').insert({
                conversation_id: conversationId,
                sender_id: currentUser.id,
                content: message,
            });

            if (error) throw error;
            setMessage('');
        } catch (e) {
            console.error('Error sending:', e);
            // Optimistic update fallback
            setMessages(prev => [...prev, { id: Date.now().toString(), content: message, sender_id: currentUser.id, created_at: new Date().toISOString(), error: true }]);
        }
    };

    if (activeChat) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50">
                {/* Chat Header */}
                <View className="px-4 py-3 bg-white border-b border-slate-200 flex-row items-center shadow-sm">
                    <TouchableOpacity onPress={() => {
                        setActiveChat(null);
                        router.setParams({ id: '' });
                    }} className="mr-3">
                        <ChevronLeft size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <View>
                        <Text className="font-bold text-lg text-slate-900">{businessName || 'Chat'}</Text>
                        <Text className="text-xs text-green-600 font-medium">{conversationId === 'mock-conv-id' ? 'Offline Demo' : 'Realtime'}</Text>
                    </View>
                </View>

                {/* Messages List */}
                <FlatList
                    data={messages}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
                    renderItem={({ item }) => {
                        const isMe = item.sender_id === currentUser?.id || item.sender_id === 'guest';
                        return (
                            <View className={`max-w-[80%] p-4 rounded-2xl ${isMe ? 'bg-violet-600 self-end rounded-tr-none' : 'bg-white border border-slate-200 self-start rounded-tl-none'}`}>
                                <Text className={`${isMe ? 'text-white' : 'text-slate-800'}`}>{item.content}</Text>
                                <Text className={`text-[10px] mt-1 ${isMe ? 'text-violet-200' : 'text-slate-400'}`}>
                                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        );
                    }}
                />

                {/* Input Area - Responsive Spacing */}
                <View
                    className="bg-white border-t border-slate-100 flex-row items-center gap-3 px-4 pt-4"
                    style={{
                        paddingBottom: keyboardHeight > 0
                            ? keyboardHeight + 10
                            : effectiveTabBarHeight - insets.bottom + 10
                    }}
                >
                    <TextInput
                        className="flex-1 bg-slate-100 rounded-full h-12 px-6 text-slate-900"
                        placeholder="Type a message..."
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity onPress={sendMessage} className="h-12 w-12 bg-violet-600 rounded-full items-center justify-center shadow-lg shadow-violet-200">
                        <Send size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Default List View (Empty state for now)
    return (
        <SafeAreaView className="flex-1 bg-slate-50 p-6">
            <Text className="text-2xl font-bold text-slate-900 mb-6">Messages</Text>
            <View className="flex-1 items-center justify-center opacity-50">
                <Text className="text-slate-400 text-center">Select a business from the home page to start chatting.</Text>
            </View>
        </SafeAreaView>
    );
}
