
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useThemeContext } from '@/contexts/ThemeContext';

export default function EstimatorScreen() {
  const { colors } = useThemeContext();
  const [projectType, setProjectType] = useState<'roofing' | 'solar' | 'repair'>('roofing');
  const [squareFootage, setSquareFootage] = useState('');
  const [marginAdjustment, setMarginAdjustment] = useState('20');

  const calculateEstimate = () => {
    const sqft = parseFloat(squareFootage) || 0;
    const margin = parseFloat(marginAdjustment) / 100;
    
    let baseRate = 0;
    switch (projectType) {
      case 'roofing':
        baseRate = 8.50;
        break;
      case 'solar':
        baseRate = 3.00;
        break;
      case 'repair':
        baseRate = 12.00;
        break;
    }

    const subtotal = sqft * baseRate;
    const total = subtotal * (1 + margin);

    return {
      subtotal,
      margin: subtotal * margin,
      total,
    };
  };

  const estimate = calculateEstimate();

  const proposalTiers = [
    {
      tier: 'good',
      name: 'Standard Package',
      multiplier: 0.85,
      warranty: '10 years',
      features: ['Standard materials', 'Basic installation', 'Standard warranty'],
    },
    {
      tier: 'better',
      name: 'Premium Package',
      multiplier: 1.0,
      warranty: '20 years',
      features: ['Premium materials', 'Professional installation', 'Extended warranty', 'Free inspection'],
    },
    {
      tier: 'best',
      name: 'Elite Package',
      multiplier: 1.25,
      warranty: '30 years',
      features: ['Top-tier materials', 'Expert installation', 'Lifetime warranty', 'Annual inspections', 'Priority service'],
    },
  ];

  const styles = createStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Instant Estimator</Text>
        </View>

        {/* Project Type Selector */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Project Type</Text>
          <View style={styles.typeSelector}>
            {(['roofing', 'solar', 'repair'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: projectType === type ? colors.accent : colors.card,
                    borderColor: projectType === type ? colors.accent : colors.border,
                  }
                ]}
                onPress={() => setProjectType(type)}
              >
                <Text style={[
                  styles.typeButtonText,
                  { color: projectType === type ? '#FFFFFF' : colors.text }
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Input Fields */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Project Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Square Footage
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={squareFootage}
                onChangeText={setSquareFootage}
                placeholder="Enter square footage"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={[styles.inputUnit, { color: colors.textSecondary }]}>sq ft</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Profit Margin
            </Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={marginAdjustment}
                onChangeText={setMarginAdjustment}
                placeholder="Enter margin"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
              <Text style={[styles.inputUnit, { color: colors.textSecondary }]}>%</Text>
            </View>
          </View>
        </View>

        {/* Estimate Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Estimate Summary</Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                ${estimate.subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Margin ({marginAdjustment}%)
              </Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                ${estimate.margin.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Total Estimate
              </Text>
              <Text style={[styles.totalValue, { color: colors.accent }]}>
                ${estimate.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Proposal Templates */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Good / Better / Best Proposals
          </Text>
          {proposalTiers.map((proposal) => (
            <View
              key={proposal.tier}
              style={[styles.proposalCard, { backgroundColor: colors.card }]}
            >
              <View style={styles.proposalHeader}>
                <View>
                  <Text style={[styles.proposalName, { color: colors.text }]}>
                    {proposal.name}
                  </Text>
                  <Text style={[styles.proposalWarranty, { color: colors.textSecondary }]}>
                    {proposal.warranty} warranty
                  </Text>
                </View>
                <Text style={[styles.proposalPrice, { color: colors.accent }]}>
                  ${(estimate.total * proposal.multiplier).toFixed(2)}
                </Text>
              </View>
              <View style={styles.proposalFeatures}>
                {proposal.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check_circle"
                      size={18}
                      color={colors.success}
                    />
                    <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={[styles.selectButton, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.selectButtonText}>Select & Generate Proposal</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  inputUnit: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  proposalCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  proposalName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  proposalWarranty: {
    fontSize: 14,
  },
  proposalPrice: {
    fontSize: 24,
    fontWeight: '700',
  },
  proposalFeatures: {
    gap: 10,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
  },
  selectButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
