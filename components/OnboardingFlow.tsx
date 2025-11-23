
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { IconSymbol } from './IconSymbol';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconAndroid: string;
  color: string;
  tips: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: '1',
    title: 'Welcome to InspectAI',
    description: 'Your AI-powered roof inspection assistant for field professionals',
    icon: 'house.fill',
    iconAndroid: 'home',
    color: '#2563EB',
    tips: [
      'Capture high-quality roof photos',
      'Get instant AI analysis',
      'Generate professional reports',
      'Work offline in the field',
    ],
  },
  {
    id: '2',
    title: 'Start an Inspection',
    description: 'Begin by entering the property address and capturing photos',
    icon: 'camera.fill',
    iconAndroid: 'photo_camera',
    color: '#10B981',
    tips: [
      'Enter property address first',
      'Take 6-12 photos from different angles',
      'Capture all roof facets',
      'Include close-ups of damage',
    ],
  },
  {
    id: '3',
    title: 'Photo Guidelines',
    description: 'Follow these tips for best results',
    icon: 'photo.on.rectangle',
    iconAndroid: 'photo_library',
    color: '#F59E0B',
    tips: [
      'Frame the ridge in center',
      'Avoid shadows when possible',
      'Capture in good lighting',
      'Hold camera steady',
      'Tap to retake if blurry',
    ],
  },
  {
    id: '4',
    title: 'Roof Drawing Tool',
    description: 'Create precise measurements with our drawing tool',
    icon: 'pencil.and.ruler.fill',
    iconAndroid: 'architecture',
    color: '#8B5CF6',
    tips: [
      'Tap to place polygon points',
      'Draw each roof facet',
      'Auto-calculates area & pitch',
      'Pinch to zoom for precision',
      'Undo/redo available',
    ],
  },
  {
    id: '5',
    title: 'Field Mode',
    description: 'Optimized for outdoor use in bright sunlight',
    icon: 'sun.max.fill',
    iconAndroid: 'wb_sunny',
    color: '#FF6B00',
    tips: [
      'High contrast UI',
      'Large tap targets',
      'Dark theme for glare',
      'Toggle in Profile tab',
      'Works offline',
    ],
  },
];

export default function OnboardingFlow() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const { setHasCompletedOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (currentStep < onboardingSteps.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({ x: (currentStep + 1) * width, animated: true });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleComplete();
  };

  const handleComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setHasCompletedOnboarding(true);
    router.replace('/(tabs)/(home)/dashboard');
  };

  const handleDotPress = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep(index);
    scrollViewRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const step = onboardingSteps[currentStep];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
      >
        {onboardingSteps.map((stepItem, index) => (
          <View key={stepItem.id} style={[styles.stepContainer, { width }]}>
            <Animated.View style={[styles.content, { opacity: index === currentStep ? fadeAnim : 0.3 }]}>
              <View style={[styles.iconContainer, { backgroundColor: stepItem.color + '20' }]}>
                <IconSymbol
                  ios_icon_name={stepItem.icon}
                  android_material_icon_name={stepItem.iconAndroid}
                  size={80}
                  color={stepItem.color}
                />
              </View>

              <Text style={[styles.title, { color: colors.text }]}>{stepItem.title}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {stepItem.description}
              </Text>

              <View style={styles.tipsContainer}>
                {stepItem.tips.map((tip, tipIndex) => (
                  <View key={tipIndex} style={[styles.tipItem, { backgroundColor: colors.cardBackground }]}>
                    <View style={[styles.tipBullet, { backgroundColor: stepItem.color }]} />
                    <Text style={[styles.tipText, { color: colors.text }]}>{tip}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      {/* Progress Dots */}
      <View style={styles.dotsContainer}>
        {onboardingSteps.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleDotPress(index)}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentStep ? step.color : colors.border,
                width: index === currentStep ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentStep < onboardingSteps.length - 1 ? (
          <>
            <TouchableOpacity
              style={[styles.skipButton, { borderColor: colors.border }]}
              onPress={handleSkip}
            >
              <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: step.color }]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <IconSymbol
                ios_icon_name="arrow.right"
                android_material_icon_name="arrow_forward"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.completeButton, { backgroundColor: step.color }]}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>Get Started</Text>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check_circle"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  tipsContainer: {
    width: '100%',
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  tipBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tipText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  navigationContainer: {
    flexDirection: 'row',
    paddingHorizontal: 32,
    paddingBottom: 48,
    gap: 12,
  },
  skipButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  completeButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});
