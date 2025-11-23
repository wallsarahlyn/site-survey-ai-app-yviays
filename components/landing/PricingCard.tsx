
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme, spacing, borderRadius, typography } from '@/styles/commonStyles';

const { width: screenWidth } = Dimensions.get('window');
const isMobile = screenWidth < 768;

interface PricingCardProps {
  title: string;
  price: string;
  tagline: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  onPress: () => void;
}

export function PricingCard({
  title,
  price,
  tagline,
  features,
  buttonText,
  isPopular,
  onPress,
}: PricingCardProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <View style={[
      styles.card,
      { backgroundColor: colors.cardBackground, borderColor: isPopular ? colors.primary : colors.border },
      isPopular && styles.popularCard,
    ]}>
      {isPopular && (
        <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.popularBadgeText}>Most Popular</Text>
        </View>
      )}
      
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.price, { color: colors.primary }]}>{price}</Text>
      <Text style={[styles.tagline, { color: colors.textSecondary }]}>
        {tagline}
      </Text>
      
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <React.Fragment key={index}>
            <View style={styles.featureRow}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    minHeight: 500,
  },
  popularCard: {
    borderWidth: 3,
    transform: isMobile ? [] : [{ scale: 1.05 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  price: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  tagline: {
    ...typography.caption,
    marginBottom: spacing.lg,
  },
  featuresContainer: {
    flex: 1,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.body,
    flex: 1,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
