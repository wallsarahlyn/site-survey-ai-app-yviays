
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';

export default function InsuranceScreen() {
  const { colors } = useThemeContext();
  const router = useRouter();

  const riskCategories = [
    {
      id: '1',
      name: 'Storm History',
      icon: 'cloud.bolt.fill',
      iconAndroid: 'thunderstorm',
      score: 7.2,
      status: 'high',
      description: '3 major storms in past 5 years',
    },
    {
      id: '2',
      name: 'Hail Risk',
      icon: 'cloud.hail.fill',
      iconAndroid: 'ac_unit',
      score: 5.8,
      status: 'medium',
      description: 'Moderate hail activity zone',
    },
    {
      id: '3',
      name: 'Wind Damage',
      icon: 'wind',
      iconAndroid: 'air',
      score: 6.5,
      status: 'medium',
      description: 'High wind zone (80+ mph)',
    },
    {
      id: '4',
      name: 'Flood Risk',
      icon: 'water.waves',
      iconAndroid: 'water',
      score: 3.2,
      status: 'low',
      description: 'FEMA Zone X (minimal risk)',
    },
    {
      id: '5',
      name: 'Fire Risk',
      icon: 'flame.fill',
      iconAndroid: 'local_fire_department',
      score: 4.1,
      status: 'low',
      description: 'Low wildfire risk zone',
    },
  ];

  const getScoreColor = (status: string) => {
    switch (status) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

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
          <Text style={[styles.title, { color: colors.text }]}>Insurance Analysis</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Risk Assessment & Verification
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/(tabs)/(home)/')}
          >
            <IconSymbol
              ios_icon_name="doc.text.magnifyingglass"
              android_material_icon_name="search"
              size={32}
              color="#FFFFFF"
            />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Fetch Historical Data</Text>
              <Text style={styles.actionSubtitle}>
                Get storm history, FEMA zones, and risk scores
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Risk Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Risk Categories</Text>
          {riskCategories.map((category) => (
            <View
              key={category.id}
              style={[styles.riskCard, { backgroundColor: colors.card }]}
            >
              <View style={[styles.riskIcon, { backgroundColor: getScoreColor(category.status) + '20' }]}>
                <IconSymbol
                  ios_icon_name={category.icon}
                  android_material_icon_name={category.iconAndroid}
                  size={28}
                  color={getScoreColor(category.status)}
                />
              </View>
              <View style={styles.riskInfo}>
                <Text style={[styles.riskName, { color: colors.text }]}>
                  {category.name}
                </Text>
                <Text style={[styles.riskDescription, { color: colors.textSecondary }]}>
                  {category.description}
                </Text>
              </View>
              <View style={styles.riskScore}>
                <Text style={[styles.scoreValue, { color: getScoreColor(category.status) }]}>
                  {category.score}
                </Text>
                <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>
                  /10
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Report Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Generate Reports</Text>
          
          <TouchableOpacity
            style={[styles.reportButton, { backgroundColor: colors.card }]}
          >
            <View style={styles.reportContent}>
              <IconSymbol
                ios_icon_name="doc.text.fill"
                android_material_icon_name="description"
                size={24}
                color={colors.primary}
              />
              <View style={styles.reportInfo}>
                <Text style={[styles.reportTitle, { color: colors.text }]}>
                  Insurance Verification Report
                </Text>
                <Text style={[styles.reportDescription, { color: colors.textSecondary }]}>
                  Comprehensive report for claims adjusters
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.reportButton, { backgroundColor: colors.card }]}
          >
            <View style={styles.reportContent}>
              <IconSymbol
                ios_icon_name="chart.bar.doc.horizontal.fill"
                android_material_icon_name="assessment"
                size={24}
                color={colors.accent}
              />
              <View style={styles.reportInfo}>
                <Text style={[styles.reportTitle, { color: colors.text }]}>
                  Risk Assessment Report
                </Text>
                <Text style={[styles.reportDescription, { color: colors.textSecondary }]}>
                  Detailed risk analysis and recommendations
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.section}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={32}
              color={colors.info}
            />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Data Sources
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                - NOAA Storm Events Database{'\n'}
                - FEMA Flood Zone Maps{'\n'}
                - National Weather Service{'\n'}
                - Local Building Records{'\n'}
                - Insurance Claim History
              </Text>
            </View>
          </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(0, 217, 255, 0.3)',
    elevation: 4,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  riskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  riskIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskInfo: {
    flex: 1,
  },
  riskName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  riskDescription: {
    fontSize: 13,
  },
  riskScore: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 12,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  reportContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 13,
  },
  infoCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
