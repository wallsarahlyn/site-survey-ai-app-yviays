
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import { ServiceQuote } from '@/types/inspection';
import { IconSymbol } from './IconSymbol';

interface QuoteDisplayProps {
  quote: ServiceQuote;
}

export default function QuoteDisplay({ quote }: QuoteDisplayProps) {
  const { colors } = useThemeContext();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Service Quote</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Estimated costs based on AI analysis</Text>
      </View>

      <View style={[styles.totalCard, { backgroundColor: colors.primary }]}>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Roofing Services</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.quoteRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>Material Cost</Text>
            <Text style={[styles.quoteValue, { color: colors.text }]}>${quote.roofing.materialCost.toLocaleString()}</Text>
          </View>
          <View style={[styles.quoteRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>Labor Cost</Text>
            <Text style={[styles.quoteValue, { color: colors.text }]}>${quote.roofing.laborCost.toLocaleString()}</Text>
          </View>
          <View style={[styles.quoteRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>Timeline</Text>
            <Text style={[styles.quoteValue, { color: colors.text }]}>{quote.roofing.timeline}</Text>
          </View>
          <View style={[styles.quoteRow, styles.totalRow, { borderTopColor: colors.primary }]}>
            <Text style={[styles.quoteTotalLabel, { color: colors.text }]}>Roofing Total</Text>
            <Text style={[styles.quoteTotalValue, { color: colors.primary }]}>${quote.roofing.estimatedCost.toLocaleString()}</Text>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Solar Installation</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.quoteRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>System Size</Text>
            <Text style={[styles.quoteValue, { color: colors.text }]}>{quote.solar.systemSize}</Text>
          </View>
          <View style={[styles.quoteRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>Installation Cost</Text>
            <Text style={[styles.quoteValue, { color: colors.text }]}>${quote.solar.estimatedCost.toLocaleString()}</Text>
          </View>
          <View style={[styles.quoteRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>Annual Savings</Text>
            <Text style={[styles.quoteValue, { color: colors.secondary }]}>
              ${quote.solar.estimatedSavings.toLocaleString()}
            </Text>
          </View>
          <View style={[styles.quoteRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>Payback Period</Text>
            <Text style={[styles.quoteValue, { color: colors.text }]}>{quote.solar.paybackPeriod}</Text>
          </View>
        </View>

        <View style={[styles.savingsCard, { backgroundColor: colors.card, borderColor: colors.secondary }]}>
          <IconSymbol 
            ios_icon_name="leaf.fill" 
            android_material_icon_name="eco" 
            size={20} 
            color={colors.secondary} 
          />
          <Text style={[styles.savingsText, { color: colors.secondary }]}>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Repairs</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.quoteRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>Repair Cost</Text>
            <Text style={[styles.quoteValue, { color: colors.text }]}>${quote.repairs.estimatedCost.toLocaleString()}</Text>
          </View>
          <View style={[styles.quoteRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>Urgency</Text>
            <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(quote.repairs.urgency) }]}>
              <Text style={styles.urgencyText}>{quote.repairs.urgency.toUpperCase()}</Text>
            </View>
          </View>
          <View style={[styles.quoteRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.quoteLabel, { color: colors.textSecondary }]}>Timeline</Text>
            <Text style={[styles.quoteValue, { color: colors.text }]}>{quote.repairs.timeline}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.disclaimer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <IconSymbol 
          ios_icon_name="info.circle.fill" 
          android_material_icon_name="info" 
          size={20} 
          color={colors.textSecondary} 
        />
        <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  totalCard: {
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
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  quoteLabel: {
    fontSize: 14,
  },
  quoteValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    borderBottomWidth: 0,
    borderTopWidth: 2,
    marginTop: 8,
    paddingTop: 16,
  },
  quoteTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  quoteTotalValue: {
    fontSize: 20,
    fontWeight: '700',
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
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    gap: 12,
    borderWidth: 1,
  },
  savingsText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 100,
    borderWidth: 1,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
