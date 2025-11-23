
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme, spacing, borderRadius, typography } from '@/styles/commonStyles';

interface WhoItsForCardProps {
  title: string;
  description: string;
  icon: string;
}

export function WhoItsForCard({ title, description, icon }: WhoItsForCardProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    minHeight: 220,
    borderWidth: 1,
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
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
});
