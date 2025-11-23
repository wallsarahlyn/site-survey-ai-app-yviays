
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Href } from 'expo-router';

export interface TabBarItem {
  name: string;
  route: Href;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export default function FloatingTabBar({
  tabs,
  position = 'bottom-right'
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const animatedValue = useSharedValue(0);

  const activeTabIndex = React.useMemo(() => {
    let bestMatch = -1;
    let bestMatchScore = 0;

    tabs.forEach((tab, index) => {
      let score = 0;

      if (pathname === tab.route) {
        score = 100;
      } else if (pathname.startsWith(tab.route as string)) {
        score = 80;
      } else if (pathname.includes(tab.name)) {
        score = 60;
      } else if (tab.route.includes('/(tabs)/') && pathname.includes(tab.route.split('/(tabs)/')[1])) {
        score = 40;
      }

      if (score > bestMatchScore) {
        bestMatchScore = score;
        bestMatch = index;
      }
    });

    return bestMatch >= 0 ? bestMatch : 0;
  }, [pathname, tabs]);

  React.useEffect(() => {
    if (activeTabIndex >= 0) {
      animatedValue.value = withSpring(activeTabIndex, {
        damping: 20,
        stiffness: 120,
        mass: 1,
      });
    }
  }, [activeTabIndex, animatedValue]);

  const handleTabPress = (route: Href) => {
    router.push(route);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const tabHeight = 60;
    return {
      transform: [
        {
          translateY: interpolate(
            animatedValue.value,
            [0, tabs.length - 1],
            [0, tabHeight * (tabs.length - 1)]
          ),
        },
      ],
    };
  });

  const getPositionStyles = () => {
    const baseStyles = {
      position: 'absolute' as const,
      zIndex: 1000,
    };

    switch (position) {
      case 'bottom-right':
        return { ...baseStyles, bottom: 16, right: 16 };
      case 'bottom-left':
        return { ...baseStyles, bottom: 16, left: 16 };
      case 'top-right':
        return { ...baseStyles, top: Platform.OS === 'android' ? 64 : 60, right: 16 };
      case 'top-left':
        return { ...baseStyles, top: Platform.OS === 'android' ? 64 : 60, left: 16 };
      default:
        return { ...baseStyles, bottom: 16, right: 16 };
    }
  };

  const dynamicStyles = {
    blurContainer: {
      ...styles.blurContainer,
      borderWidth: 1,
      borderColor: theme.dark
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.08)',
      ...Platform.select({
        ios: {
          backgroundColor: theme.dark
            ? 'rgba(30, 41, 59, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
        },
        android: {
          backgroundColor: theme.dark
            ? 'rgba(30, 41, 59, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
        },
        web: {
          backgroundColor: theme.dark
            ? 'rgba(30, 41, 59, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
        },
      }),
    },
    background: {
      ...styles.background,
    },
    indicator: {
      ...styles.indicator,
      backgroundColor: theme.dark
        ? 'rgba(255, 87, 34, 0.15)'
        : 'rgba(255, 87, 34, 0.1)',
    },
  };

  return (
    <View style={[styles.container, getPositionStyles()]}>
      <BlurView
        intensity={Platform.OS === 'ios' ? 80 : 0}
        style={[dynamicStyles.blurContainer]}
      >
        <View style={dynamicStyles.background} />
        <Animated.View style={[dynamicStyles.indicator, indicatorStyle]} />
        <View style={styles.tabsContainer}>
          {tabs.map((tab, index) => {
            const isActive = activeTabIndex === index;

            return (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tabContent}>
                    <IconSymbol
                      android_material_icon_name={tab.icon}
                      ios_icon_name={tab.icon}
                      size={24}
                      color={isActive ? '#FF5722' : (theme.dark ? '#94A3B8' : '#64748B')}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        { color: theme.dark ? '#94A3B8' : '#64748B' },
                        isActive && { color: '#FF5722', fontWeight: '600' },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  indicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    height: 60,
    borderRadius: 16,
  },
  tabsContainer: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    height: 60,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
