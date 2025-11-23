
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme, spacing, borderRadius, typography } from '@/styles/commonStyles';

interface SampleReportCardProps {
  title: string;
  description: string;
  reportType: 'basic' | 'pro' | 'premium';
  icon: string;
  onPress: () => void;
}

export function SampleReportCard({ title, description, icon, onPress }: SampleReportCardProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
        <IconSymbol
          ios_icon_name={icon}
          android_material_icon_name={icon}
          size={40}
          color={colors.primary}
        />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>
      <View style={[styles.button, { backgroundColor: colors.primary }]}>
        <Text style={styles.buttonText}>View Sample</Text>
        <IconSymbol
          ios_icon_name="arrow.right"
          android_material_icon_name="arrow_forward"
          size={16}
          color="#FFFFFF"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    minHeight: 280,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    lineHeight: 22,
    marginBottom: spacing.lg,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
