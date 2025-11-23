
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

  const getConfidenceLevel = (confidence: number): string => {
    if (confidence >= 0.9) return 'Very High';
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.7) return 'Moderate';
    return 'Low';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Comprehensive AI Analysis</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Powered by advanced computer vision and machine learning
        </Text>
      </View>

      <View style={[styles.card, styles.conditionCard, { backgroundColor: getConditionColor(analysis.overallCondition) }]}>
        <IconSymbol 
          ios_icon_name="checkmark.seal.fill" 
          android_material_icon_name="verified" 
          size={32} 
          color="#FFFFFF" 
        />
        <View style={styles.conditionContent}>
          <Text style={styles.cardTitle}>Overall Property Condition</Text>
          <Text style={styles.conditionText}>{analysis.overallCondition.toUpperCase()}</Text>
        </View>
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
            <Text style={[styles.label, { color: colors.text }]}>Detection Status:</Text>
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
                <Text style={[styles.label, { color: colors.text }]}>Severity Level:</Text>
                <View style={[styles.badge, { backgroundColor: getSeverityColor(analysis.roofDamage.severity) }]}>
                  <Text style={styles.badgeText}>{analysis.roofDamage.severity.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={[styles.subsectionTitle, { color: colors.text }]}>Identified Issues:</Text>
              {analysis.roofDamage.issues.map((issue, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.bulletContainer, { backgroundColor: colors.error }]}>
                    <Text style={styles.bulletNumber}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.listText, { color: colors.textSecondary }]}>{issue}</Text>
                </View>
              ))}
            </>
          )}

          <View style={[styles.confidenceBar, { backgroundColor: colors.background }]}>
            <View style={styles.confidenceInfo}>
              <IconSymbol 
                ios_icon_name="chart.bar.fill" 
                android_material_icon_name="analytics" 
                size={16} 
                color={colors.primary} 
              />
              <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
                AI Confidence: {getConfidenceLevel(analysis.roofDamage.confidence)}
              </Text>
            </View>
            <Text style={[styles.confidenceValue, { color: colors.primary }]}>
              {(analysis.roofDamage.confidence * 100).toFixed(1)}%
            </Text>
          </View>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Structural Assessment</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statusRow}>
            <Text style={[styles.label, { color: colors.text }]}>Detection Status:</Text>
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
              <View style={styles.divider} />
              <Text style={[styles.subsectionTitle, { color: colors.text }]}>Identified Issues:</Text>
              {analysis.structuralIssues.issues.map((issue, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.bulletContainer, { backgroundColor: colors.warning }]}>
                    <Text style={styles.bulletNumber}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.listText, { color: colors.textSecondary }]}>{issue}</Text>
                </View>
              ))}
            </>
          )}

          <View style={[styles.confidenceBar, { backgroundColor: colors.background }]}>
            <View style={styles.confidenceInfo}>
              <IconSymbol 
                ios_icon_name="chart.bar.fill" 
                android_material_icon_name="analytics" 
                size={16} 
                color={colors.primary} 
              />
              <Text style={[styles.confidenceLabel, { color: colors.textSecondary }]}>
                AI Confidence: {getConfidenceLevel(analysis.structuralIssues.confidence)}
              </Text>
            </View>
            <Text style={[styles.confidenceValue, { color: colors.primary }]}>
              {(analysis.structuralIssues.confidence * 100).toFixed(1)}%
            </Text>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Solar Compatibility Analysis</Text>
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
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreValue, { color: colors.primary }]}>
                {analysis.solarCompatibility.score.toFixed(0)}
              </Text>
              <Text style={[styles.scoreMax, { color: colors.textSecondary }]}>/100</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Compatibility Score</Text>
              <View style={styles.capacityRow}>
                <IconSymbol 
                  ios_icon_name="bolt.fill" 
                  android_material_icon_name="flash_on" 
                  size={16} 
                  color={colors.secondary} 
                />
                <Text style={[styles.capacityText, { color: colors.text }]}>
                  {analysis.solarCompatibility.estimatedCapacity}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={[styles.subsectionTitle, { color: colors.text }]}>Assessment Factors:</Text>
          {analysis.solarCompatibility.factors.map((factor, index) => (
            <View key={index} style={styles.listItem}>
              <IconSymbol 
                ios_icon_name={analysis.solarCompatibility.suitable ? "checkmark.circle.fill" : "xmark.circle.fill"} 
                android_material_icon_name={analysis.solarCompatibility.suitable ? "check_circle" : "cancel"} 
                size={18} 
                color={analysis.solarCompatibility.suitable ? colors.secondary : colors.error} 
              />
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Inspection Concerns & Recommendations</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.subsectionTitle, { color: colors.text }]}>Identified Concerns:</Text>
          {analysis.inspectionConcerns.concerns.map((concern, index) => (
            <View key={index} style={styles.listItem}>
              <View style={[styles.bulletContainer, { backgroundColor: colors.warning }]}>
                <IconSymbol 
                  ios_icon_name="exclamationmark" 
                  android_material_icon_name="priority_high" 
                  size={12} 
                  color="#FFFFFF" 
                />
              </View>
              <Text style={[styles.listText, { color: colors.textSecondary }]}>{concern}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={[styles.subsectionTitle, { color: colors.text }]}>Professional Recommendations:</Text>
          {analysis.inspectionConcerns.recommendations.map((rec, index) => (
            <View key={index} style={styles.listItem}>
              <View style={[styles.bulletContainer, { backgroundColor: colors.primary }]}>
                <IconSymbol 
                  ios_icon_name="lightbulb.fill" 
                  android_material_icon_name="lightbulb" 
                  size={12} 
                  color="#FFFFFF" 
                />
              </View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
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
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
  },
  conditionCard: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  conditionContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  conditionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
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
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 16,
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bulletNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  confidenceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  confidenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confidenceLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginVertical: 16,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(37, 99, 235, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  scoreMax: {
    fontSize: 14,
    marginTop: -4,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  capacityText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
