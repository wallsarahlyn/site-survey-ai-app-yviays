
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { HistoricalAnalysis, StormEvent, RiskScore } from '@/types/historicalData';
import { IconSymbol } from './IconSymbol';

interface HistoricalAnalysisDisplayProps {
  analysis: HistoricalAnalysis;
}

export function HistoricalAnalysisDisplay({ analysis }: HistoricalAnalysisDisplayProps) {
  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'low': return colors.success;
      case 'moderate': return colors.accent;
      case 'high': return colors.warning;
      case 'extreme': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStormIcon = (type: string): { ios: string; android: string } => {
    switch (type) {
      case 'hail': return { ios: 'cloud.hail.fill', android: 'ac_unit' };
      case 'wind': return { ios: 'wind', android: 'air' };
      case 'tornado': return { ios: 'tornado', android: 'cyclone' };
      case 'hurricane': return { ios: 'hurricane', android: 'storm' };
      case 'flood': return { ios: 'water.waves', android: 'water' };
      default: return { ios: 'cloud.fill', android: 'cloud' };
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const recentEvents = analysis.stormEvents.slice(0, 5);
  const overallRisk = analysis.riskScores.find(s => s.category === 'overall');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <IconSymbol 
          ios_icon_name="chart.bar.doc.horizontal.fill" 
          android_material_icon_name="assessment" 
          size={40} 
          color={colors.primary} 
        />
        <Text style={styles.headerTitle}>Historical Analysis</Text>
        <Text style={styles.headerSubtitle}>{analysis.address}</Text>
      </View>

      {/* AI Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="sparkles" 
            android_material_icon_name="auto_awesome" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.sectionTitle}>AI Summary</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>{analysis.aiSummary}</Text>
        </View>
      </View>

      {/* Overall Risk Score */}
      {overallRisk && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="exclamationmark.shield.fill" 
              android_material_icon_name="shield" 
              size={24} 
              color={getRiskColor(overallRisk.level)} 
            />
            <Text style={styles.sectionTitle}>Overall Risk Assessment</Text>
          </View>
          <View style={[styles.riskCard, { borderLeftColor: getRiskColor(overallRisk.level) }]}>
            <View style={styles.riskHeader}>
              <Text style={styles.riskScore}>{overallRisk.score}/100</Text>
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(overallRisk.level) }]}>
                <Text style={styles.riskBadgeText}>{overallRisk.level.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Risk Scores Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk Breakdown</Text>
        <View style={styles.riskGrid}>
          {analysis.riskScores.filter(s => s.category !== 'overall').map((risk, index) => (
            <View key={index} style={[styles.riskGridItem, { borderLeftColor: getRiskColor(risk.level) }]}>
              <Text style={styles.riskCategory}>{risk.category.toUpperCase()}</Text>
              <Text style={styles.riskGridScore}>{risk.score}</Text>
              <View style={[styles.riskGridBadge, { backgroundColor: getRiskColor(risk.level) }]}>
                <Text style={styles.riskGridBadgeText}>{risk.level}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Storm Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="cloud.bolt.fill" 
            android_material_icon_name="thunderstorm" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.sectionTitle}>Recent Storm Events</Text>
        </View>
        <Text style={styles.sectionSubtitle}>
          {analysis.stormEvents.length} events in past 5 years
        </Text>
        {recentEvents.map((event, index) => {
          const icon = getStormIcon(event.type);
          return (
            <View key={index} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <IconSymbol 
                  ios_icon_name={icon.ios} 
                  android_material_icon_name={icon.android} 
                  size={24} 
                  color={getRiskColor(event.severity)} 
                />
                <View style={styles.eventHeaderText}>
                  <Text style={styles.eventType}>{event.type.toUpperCase()}</Text>
                  <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: getRiskColor(event.severity) }]}>
                  <Text style={styles.severityBadgeText}>{event.severity}</Text>
                </View>
              </View>
              <Text style={styles.eventDescription}>{event.description}</Text>
              <View style={styles.eventDetails}>
                {event.windSpeed && (
                  <Text style={styles.eventDetail}>Wind: {event.windSpeed} mph</Text>
                )}
                {event.hailSize && (
                  <Text style={styles.eventDetail}>Hail: {event.hailSize.toFixed(1)}"</Text>
                )}
                <Text style={styles.eventDetail}>Distance: {event.proximityMiles.toFixed(1)} mi</Text>
              </View>
            </View>
          );
        })}
        {analysis.stormEvents.length > 5 && (
          <Text style={styles.moreEventsText}>
            + {analysis.stormEvents.length - 5} more events
          </Text>
        )}
      </View>

      {/* Fire Risk */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="flame.fill" 
            android_material_icon_name="local_fire_department" 
            size={24} 
            color={getRiskColor(analysis.fireRisk.riskLevel)} 
          />
          <Text style={styles.sectionTitle}>Fire Risk Zone</Text>
        </View>
        <View style={[styles.infoCard, { borderLeftColor: getRiskColor(analysis.fireRisk.riskLevel) }]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Zone:</Text>
            <Text style={styles.infoValue}>{analysis.fireRisk.zone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Risk Level:</Text>
            <View style={[styles.inlineBadge, { backgroundColor: getRiskColor(analysis.fireRisk.riskLevel) }]}>
              <Text style={styles.inlineBadgeText}>{analysis.fireRisk.riskLevel.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.factorsTitle}>Risk Factors:</Text>
          {analysis.fireRisk.factors.map((factor, index) => (
            <Text key={index} style={styles.factorText}>• {factor}</Text>
          ))}
        </View>
      </View>

      {/* Flood Risk */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="water.waves" 
            android_material_icon_name="water_damage" 
            size={24} 
            color={getRiskColor(analysis.floodRisk.riskLevel === 'minimal' ? 'low' : analysis.floodRisk.riskLevel)} 
          />
          <Text style={styles.sectionTitle}>Flood Risk</Text>
        </View>
        <View style={[styles.infoCard, { borderLeftColor: getRiskColor(analysis.floodRisk.riskLevel === 'minimal' ? 'low' : analysis.floodRisk.riskLevel) }]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>FEMA Zone:</Text>
            <Text style={styles.infoValue}>{analysis.floodRisk.floodZone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Risk Level:</Text>
            <View style={[styles.inlineBadge, { backgroundColor: getRiskColor(analysis.floodRisk.riskLevel === 'minimal' ? 'low' : analysis.floodRisk.riskLevel) }]}>
              <Text style={styles.inlineBadgeText}>{analysis.floodRisk.riskLevel.toUpperCase()}</Text>
            </View>
          </View>
          {analysis.floodRisk.baseFloodElevation && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Base Flood Elevation:</Text>
              <Text style={styles.infoValue}>{analysis.floodRisk.baseFloodElevation} ft</Text>
            </View>
          )}
          {analysis.floodRisk.lastFloodDate && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Flood:</Text>
              <Text style={styles.infoValue}>{formatDate(analysis.floodRisk.lastFloodDate)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Insurance Claims */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="doc.text.fill" 
            android_material_icon_name="description" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.sectionTitle}>Insurance Claim Activity</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Claims in Area:</Text>
            <Text style={styles.infoValue}>{analysis.insuranceClaims.claimsInArea}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Average Claim:</Text>
            <Text style={styles.infoValue}>${analysis.insuranceClaims.averageClaimAmount.toLocaleString()}</Text>
          </View>
          <Text style={styles.factorsTitle}>Common Claim Types:</Text>
          {analysis.insuranceClaims.commonClaimTypes.map((type, index) => (
            <Text key={index} style={styles.factorText}>• {type}</Text>
          ))}
        </View>
      </View>

      {/* Weather Patterns */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="cloud.sun.fill" 
            android_material_icon_name="wb_sunny" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.sectionTitle}>Historical Weather Patterns</Text>
        </View>
        <View style={styles.weatherGrid}>
          <View style={styles.weatherCard}>
            <Text style={styles.weatherValue}>{analysis.weatherPatterns.averageAnnualPrecipitation.toFixed(1)}"</Text>
            <Text style={styles.weatherLabel}>Annual Precipitation</Text>
          </View>
          <View style={styles.weatherCard}>
            <Text style={styles.weatherValue}>{analysis.weatherPatterns.averageSnowfall.toFixed(1)}"</Text>
            <Text style={styles.weatherLabel}>Annual Snowfall</Text>
          </View>
          <View style={styles.weatherCard}>
            <Text style={styles.weatherValue}>{analysis.weatherPatterns.averageWindSpeed.toFixed(1)} mph</Text>
            <Text style={styles.weatherLabel}>Avg Wind Speed</Text>
          </View>
          <View style={styles.weatherCard}>
            <Text style={styles.weatherValue}>{analysis.weatherPatterns.extremeWeatherDays}</Text>
            <Text style={styles.weatherLabel}>Extreme Days/Year</Text>
          </View>
        </View>
      </View>

      {/* Roof Age Patterns */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <IconSymbol 
            ios_icon_name="house.fill" 
            android_material_icon_name="roofing" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.sectionTitle}>Regional Roof Patterns</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Average Roof Age:</Text>
            <Text style={styles.infoValue}>{analysis.roofAgePatterns.averageRoofAge} years</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Replacement Frequency:</Text>
            <Text style={styles.infoValue}>{analysis.roofAgePatterns.replacementFrequency} years</Text>
          </View>
          <Text style={styles.factorsTitle}>Common Roof Types:</Text>
          {analysis.roofAgePatterns.commonRoofTypes.map((type, index) => (
            <Text key={index} style={styles.factorText}>• {type}</Text>
          ))}
          <Text style={styles.factorsTitle}>Regional Factors:</Text>
          {analysis.roofAgePatterns.regionalFactors.map((factor, index) => (
            <Text key={index} style={styles.factorText}>• {factor}</Text>
          ))}
        </View>
      </View>

      {/* Data Sources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Sources</Text>
        <View style={styles.sourcesCard}>
          {analysis.dataSourcesUsed.map((source, index) => (
            <Text key={index} style={styles.sourceText}>✓ {source}</Text>
          ))}
          <Text style={styles.sourceDate}>
            Analysis completed: {formatDate(analysis.analyzedAt)}
          </Text>
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
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
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
    fontWeight: '700',
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  riskCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskScore: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
  },
  riskBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  riskBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  riskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  riskGridItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  riskCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  riskGridScore: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  riskGridBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskGridBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  eventCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  eventHeaderText: {
    flex: 1,
  },
  eventType: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  eventDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  eventDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  eventDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  moreEventsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  inlineBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inlineBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  factorsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    marginBottom: 8,
  },
  factorText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    marginLeft: 8,
  },
  weatherGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  weatherCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  weatherValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  weatherLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sourcesCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sourceText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 24,
  },
  sourceDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 12,
    fontStyle: 'italic',
  },
});
