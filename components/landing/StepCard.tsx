
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme, spacing, borderRadius, typography } from '@/styles/commonStyles';

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  icon: string;
}

export function StepCard({ stepNumber, title, description, icon }: StepCardProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={[styles.numberBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.numberText}>{stepNumber}</Text>
      </View>
      <IconSymbol
        ios_icon_name={icon}
        android_material_icon_name={icon}
        size={48}
        color={colors.primary}
      />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    minHeight: 280,
    borderWidth: 1,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  title: {
    ...typography.h3,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
});
