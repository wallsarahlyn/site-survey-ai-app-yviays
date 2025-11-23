
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import { AIAnalysisResult } from '@/types/inspection';
import { IconSymbol } from './IconSymbol';

interface AnalysisResultsProps {
  analysis: AIAnalysisResult;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const { colors } = useThemeContext();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'none': return colors.secondary;
      case 'minor': return colors.warning;
      case 'moderate': return colors.accent;
      case 'severe': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return colors.secondary;
      case 'good': return colors.secondary;
      case 'fair': return colors.accent;
      case 'poor': return colors.error;
      default: return colors.textSecondary;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>AI Analysis Results</Text>
      </View>

      <View style={[styles.card, styles.conditionCard, { backgroundColor: getConditionColor(analysis.overallCondition) }]}>
        <Text style={styles.cardTitle}>Overall Condition</Text>
        <Text style={styles.conditionText}>{analysis.overallCondition.toUpperCase()}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="house.fill" 
            android_material_icon_name="roofing" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Roof Damage Assessment</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statusRow}>
            <Text style={[styles.label, { color: colors.text }]}>Status:</Text>
            <View style={[
              styles.badge, 
              { backgroundColor: analysis.roofDamage.detected ? colors.error : colors.secondary }
            ]}>
              <Text style={styles.badgeText}>
                {analysis.roofDamage.detected ? 'DAMAGE DETECTED' : 'NO DAMAGE'}
              </Text>
            </View>
          </View>

          {analysis.roofDamage.detected && (
            <>
              <View style={styles.statusRow}>
                <Text style={[styles.label, { color: colors.text }]}>Severity:</Text>
                <View style={[styles.badge, { backgroundColor: getSeverityColor(analysis.roofDamage.severity) }]}>
                  <Text style={styles.badgeText}>{analysis.roofDamage.severity.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={[styles.subsectionTitle, { color: colors.text }]}>Issues Identified:</Text>
              {analysis.roofDamage.issues.map((issue, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
                  <Text style={[styles.listText, { color: colors.textSecondary }]}>{issue}</Text>
                </View>
              ))}
            </>
          )}

          <Text style={[styles.confidence, { color: colors.textSecondary }]}>
            Confidence: {(analysis.roofDamage.confidence * 100).toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="building.2.fill" 
            android_material_icon_name="foundation" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Structural Issues</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statusRow}>
            <Text style={[styles.label, { color: colors.text }]}>Status:</Text>
            <View style={[
              styles.badge, 
              { backgroundColor: analysis.structuralIssues.detected ? colors.error : colors.secondary }
            ]}>
              <Text style={styles.badgeText}>
                {analysis.structuralIssues.detected ? 'ISSUES DETECTED' : 'NO ISSUES'}
              </Text>
            </View>
          </View>

          {analysis.structuralIssues.detected && analysis.structuralIssues.issues.length > 0 && (
            <>
              <Text style={[styles.subsectionTitle, { color: colors.text }]}>Issues Identified:</Text>
              {analysis.structuralIssues.issues.map((issue, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
                  <Text style={[styles.listText, { color: colors.textSecondary }]}>{issue}</Text>
                </View>
              ))}
            </>
          )}

          <Text style={[styles.confidence, { color: colors.textSecondary }]}>
            Confidence: {(analysis.structuralIssues.confidence * 100).toFixed(1)}%
          </Text>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Solar Compatibility</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statusRow}>
            <Text style={[styles.label, { color: colors.text }]}>Suitability:</Text>
            <View style={[
              styles.badge, 
              { backgroundColor: analysis.solarCompatibility.suitable ? colors.secondary : colors.textSecondary }
            ]}>
              <Text style={styles.badgeText}>
                {analysis.solarCompatibility.suitable ? 'SUITABLE' : 'NOT SUITABLE'}
              </Text>
            </View>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Compatibility Score</Text>
            <Text style={[styles.scoreValue, { color: colors.primary }]}>{analysis.solarCompatibility.score.toFixed(0)}/100</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, { color: colors.text }]}>Estimated Capacity:</Text>
            <Text style={[styles.value, { color: colors.text }]}>{analysis.solarCompatibility.estimatedCapacity}</Text>
          </View>

          <Text style={[styles.subsectionTitle, { color: colors.text }]}>Factors:</Text>
          {analysis.solarCompatibility.factors.map((factor, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
              <Text style={[styles.listText, { color: colors.textSecondary }]}>{factor}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="exclamationmark.triangle.fill" 
            android_material_icon_name="warning" 
            size={24} 
            color={colors.warning} 
          />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Inspection Concerns</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.subsectionTitle, { color: colors.text }]}>Concerns:</Text>
          {analysis.inspectionConcerns.concerns.map((concern, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
              <Text style={[styles.listText, { color: colors.textSecondary }]}>{concern}</Text>
            </View>
          ))}

          <Text style={[styles.subsectionTitle, { marginTop: 16, color: colors.text }]}>Recommendations:</Text>
          {analysis.inspectionConcerns.recommendations.map((rec, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={[styles.bullet, { color: colors.primary }]}>•</Text>
              <Text style={[styles.listText, { color: colors.textSecondary }]}>{rec}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
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
  conditionCard: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
    textAlign: 'center',
  },
  conditionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: '700',
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  confidence: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 12,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
