import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Calendar, Home, MessageSquare, User } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const TabIcon = ({
    isFocused,
    IconComponent,
    onPress,
    onLongPress,
    routeKey,
    options
}: {
    isFocused: boolean,
    IconComponent: any,
    onPress: () => void,
    onLongPress: () => void,
    routeKey: string,
    options: any
}) => {
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (isFocused) {
            scale.value = withSpring(1.2, { damping: 12, stiffness: 200 });
            translateY.value = withSpring(-4, { damping: 12, stiffness: 200 });
        } else {
            scale.value = withTiming(1, { duration: 200 });
            translateY.value = withTiming(0, { duration: 200 });
        }
    }, [isFocused]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }, { translateY: translateY.value }],
        };
    });

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            activeOpacity={0.8}
        >
            <Animated.View style={[animatedStyle, styles.iconContainer, isFocused && styles.activeIconContainer]}>
                <IconComponent
                    size={24}
                    color={isFocused ? '#7c3aed' : '#94a3b8'} // violet-600 : slate-400
                />
                {isFocused && <View style={styles.activeDot} />}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    return (
        <View style={styles.container}>
            <BlurView intensity={80} tint="light" style={styles.blurContainer}>
                <View style={styles.contentContainer}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        let IconComponent = Home;
                        if (route.name === 'bookings') IconComponent = Calendar;
                        if (route.name === 'messages') IconComponent = MessageSquare;
                        if (route.name === 'profile') IconComponent = User;

                        return (
                            <TabIcon
                                key={route.key}
                                isFocused={isFocused}
                                IconComponent={IconComponent}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                routeKey={route.key}
                                options={options}
                            />
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        borderRadius: 100,
        overflow: 'hidden', // Required for BlurView to respect border radius
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)', // Subtle border
    },
    blurContainer: {
        width: '100%',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 15,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    activeIconContainer: {
        backgroundColor: 'rgba(124, 58, 237, 0.1)', // Light violet bg
    },
    activeDot: {
        position: 'absolute',
        bottom: -8,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#7c3aed', // violet-600
    },
});
