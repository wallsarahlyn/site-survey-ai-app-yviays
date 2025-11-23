
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { ServiceQuote } from '@/types/inspection';
import { IconSymbol } from './IconSymbol';

interface QuoteDisplayProps {
  quote: ServiceQuote;
}

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return colors.error;
      case 'medium': return colors.accent;
      case 'low': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Service Quote</Text>
        <Text style={styles.subtitle}>Estimated costs based on AI analysis</Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Estimate</Text>
        <Text style={styles.totalValue}>${quote.totalEstimate.toLocaleString()}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="house.fill" 
            android_material_icon_name="roofing" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.sectionTitle}>Roofing Services</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Material Cost</Text>
            <Text style={styles.quoteValue}>${quote.roofing.materialCost.toLocaleString()}</Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Labor Cost</Text>
            <Text style={styles.quoteValue}>${quote.roofing.laborCost.toLocaleString()}</Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Timeline</Text>
            <Text style={styles.quoteValue}>{quote.roofing.timeline}</Text>
          </View>
          <View style={[styles.quoteRow, styles.totalRow]}>
            <Text style={styles.quoteTotalLabel}>Roofing Total</Text>
            <Text style={styles.quoteTotalValue}>${quote.roofing.estimatedCost.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="sun.max.fill" 
            android_material_icon_name="solar_power" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.sectionTitle}>Solar Installation</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>System Size</Text>
            <Text style={styles.quoteValue}>{quote.solar.systemSize}</Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Installation Cost</Text>
            <Text style={styles.quoteValue}>${quote.solar.estimatedCost.toLocaleString()}</Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Annual Savings</Text>
            <Text style={[styles.quoteValue, { color: colors.secondary }]}>
              ${quote.solar.estimatedSavings.toLocaleString()}
            </Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Payback Period</Text>
            <Text style={styles.quoteValue}>{quote.solar.paybackPeriod}</Text>
          </View>
        </View>

        <View style={styles.savingsCard}>
          <IconSymbol 
            ios_icon_name="leaf.fill" 
            android_material_icon_name="eco" 
            size={20} 
            color={colors.secondary} 
          />
          <Text style={styles.savingsText}>
            Save ${quote.solar.estimatedSavings.toLocaleString()} annually with solar
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="wrench.and.screwdriver.fill" 
            android_material_icon_name="build" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.sectionTitle}>Repairs</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Repair Cost</Text>
            <Text style={styles.quoteValue}>${quote.repairs.estimatedCost.toLocaleString()}</Text>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Urgency</Text>
            <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(quote.repairs.urgency) }]}>
              <Text style={styles.urgencyText}>{quote.repairs.urgency.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.quoteRow}>
            <Text style={styles.quoteLabel}>Timeline</Text>
            <Text style={styles.quoteValue}>{quote.repairs.timeline}</Text>
          </View>
        </View>
      </View>

      <View style={styles.disclaimer}>
        <IconSymbol 
          ios_icon_name="info.circle.fill" 
          android_material_icon_name="info" 
          size={20} 
          color={colors.textSecondary} 
        />
        <Text style={styles.disclaimerText}>
          This is an estimated quote based on AI analysis. Final pricing may vary after on-site inspection.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  quoteLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quoteValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalRow: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    marginTop: 8,
    paddingTop: 16,
  },
  quoteTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  quoteTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  urgencyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  savingsText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
