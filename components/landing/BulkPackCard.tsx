
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme, spacing, borderRadius, typography } from '@/styles/commonStyles';

interface BulkPackCardProps {
  title: string;
  reports: string;
  price: string;
  perReport: string;
  description: string;
  onPress: () => void;
}

export function BulkPackCard({
  title,
  reports,
  price,
  perReport,
  description,
  onPress,
}: BulkPackCardProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.reports, { color: colors.primary }]}>{reports}</Text>
      <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
      <Text style={[styles.perReport, { color: colors.textSecondary }]}>
        {perReport}
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 220,
  },
  title: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  reports: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  perReport: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.caption,
    textAlign: 'center',
  },
});
