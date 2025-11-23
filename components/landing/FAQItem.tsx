
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme, spacing, borderRadius, typography } from '@/styles/commonStyles';

interface FAQItemProps {
  question: string;
  answer: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function FAQItem({ question, answer, isExpanded, onToggle }: FAQItemProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.question, { color: colors.text }]}>{question}</Text>
        <IconSymbol
          ios_icon_name={isExpanded ? 'chevron.up' : 'chevron.down'}
          android_material_icon_name={isExpanded ? 'expand_less' : 'expand_more'}
          size={24}
          color={colors.textSecondary}
        />
      </View>
      {isExpanded && (
        <Text style={[styles.answer, { color: colors.textSecondary }]}>{answer}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  answer: {
    ...typography.body,
    marginTop: spacing.md,
    lineHeight: 24,
  },
});
