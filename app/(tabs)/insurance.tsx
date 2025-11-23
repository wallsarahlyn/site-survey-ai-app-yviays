
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useInspection } from '@/contexts/InspectionContext';
import { fetchHistoricalAnalysis } from '@/utils/historicalDataFetcher';
import { generateInsuranceVerificationPDF } from '@/utils/insurancePdfGenerator';
import { saveHistoricalAnalysis } from '@/utils/supabaseHelpers';
import HistoricalAnalysisDisplay from '@/components/HistoricalAnalysisDisplay';
import { InspectionReport } from '@/types/inspection';
import { supabase } from '@/app/integrations/supabase/client';
import { IconSymbol } from '@/components/IconSymbol';

export default function InsuranceScreen() {
  const { colors } = useTheme();
  const {
    propertyAddress,
    setPropertyAddress,
    historicalAnalysis,
    setHistoricalAnalysis,
    images,
    analysis,
    quote,
    roofDiagram,
  } = useInspection();

  const [localAddress, setLocalAddress] = useState(propertyAddress);
  const [isFetching, setIsFetching] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const handleFetchData = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You need to be signed in to fetch historical data. Please sign in from the Profile tab.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!localAddress.trim()) {
      Alert.alert('Missing Address', 'Please enter a property address.');
      return;
    }

    setIsFetching(true);

    try {
      console.log('Fetching historical data for:', localAddress);
      const data = await fetchHistoricalAnalysis(localAddress);
      
      setHistoricalAnalysis(data);
      setPropertyAddress(localAddress);

      Alert.alert(
        'Data Retrieved',
        'Historical analysis has been completed successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Historical data fetch error:', error);
      Alert.alert(
        'Fetch Error',
        error instanceof Error ? error.message : 'Failed to fetch historical data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!historicalAnalysis) {
      Alert.alert('No Data', 'Please fetch historical data first.');
      return;
    }

    setIsSaving(true);

    try {
      const analysisId = await saveHistoricalAnalysis(historicalAnalysis);
      
      if (analysisId) {
        Alert.alert(
          'Analysis Saved',
          'Your historical analysis has been saved to your account!',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error('Failed to save analysis');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert(
        'Save Error',
        'Failed to save historical analysis. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!historicalAnalysis) {
      Alert.alert('No Data', 'Please fetch historical data first.');
      return;
    }

    if (!analysis || !quote) {
      Alert.alert(
        'Incomplete Inspection',
        'Please complete a property inspection first from the Inspection tab.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsGeneratingPDF(true);

    try {
      const report: InspectionReport = {
        id: `INS-${Date.now()}`,
        propertyAddress: propertyAddress || 'Unknown Address',
        inspectionDate: new Date(),
        images,
        aiAnalysis: analysis,
        quote,
        roofDiagram: roofDiagram || undefined,
        notes: '',
      };

      await generateInsuranceVerificationPDF(report, historicalAnalysis);
      
      Alert.alert(
        'PDF Generated',
        'Your insurance verification report has been generated and is ready to share!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('PDF generation error:', error);
      Alert.alert(
        'PDF Error',
        'Failed to generate PDF. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: `${colors.primary}15` }]}>
            <IconSymbol
              ios_icon_name="shield.fill"
              android_material_icon_name="shield"
              size={32}
              color={colors.primary}
            />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Insurance Report</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Generate comprehensive insurance verification reports with historical weather and risk data
          </Text>
        </View>

        {!isAuthenticated && (
          <View style={[styles.warningCard, { backgroundColor: colors.cardBackground, borderColor: '#F59E0B' }]}>
            <View style={styles.warningHeader}>
              <IconSymbol
                ios_icon_name="exclamationmark.triangle.fill"
                android_material_icon_name="warning"
                size={24}
                color="#F59E0B"
              />
              <Text style={[styles.warningTitle, { color: '#F59E0B' }]}>Sign In Required</Text>
            </View>
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              Historical data analysis requires authentication. Please sign in from the Profile tab to use this feature.
            </Text>
          </View>
        )}

        {/* Address Input Section */}
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.sectionHeader}>
            <IconSymbol
              ios_icon_name="location.fill"
              android_material_icon_name="location_on"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Property Address</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Enter the property address to fetch historical weather data, storm events, and risk assessments
          </Text>
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, 
              color: colors.text,
              borderColor: colors.border 
            }]}
            placeholder="Enter property address (e.g., 123 Main St, Austin, TX 78701)"
            placeholderTextColor={colors.textSecondary}
            value={localAddress}
            onChangeText={setLocalAddress}
            editable={isAuthenticated}
          />
          
          <TouchableOpacity
            style={[
              styles.fetchButton, 
              { backgroundColor: isAuthenticated ? colors.primary : colors.border }
            ]}
            onPress={handleFetchData}
            disabled={isFetching || !isAuthenticated}
          >
            {isFetching ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <IconSymbol
                  ios_icon_name="cloud.fill"
                  android_material_icon_name="cloud_download"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.fetchButtonText}>
                  {isAuthenticated ? 'Fetch Historical Data' : 'Sign In to Fetch Data'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Historical Analysis Display */}
        {historicalAnalysis && (
          <>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <IconSymbol
                  ios_icon_name="chart.bar.fill"
                  android_material_icon_name="bar_chart"
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Historical Analysis</Text>
              </View>
              <HistoricalAnalysisDisplay analysis={historicalAnalysis} />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.success }]}
                onPress={handleSaveAnalysis}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <IconSymbol
                      ios_icon_name="square.and.arrow.down.fill"
                      android_material_icon_name="save"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.actionButtonText}>Save Analysis</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionButton, 
                  { backgroundColor: (!analysis || !quote) ? colors.border : colors.primary }
                ]}
                onPress={handleGeneratePDF}
                disabled={isGeneratingPDF || !analysis || !quote}
              >
                {isGeneratingPDF ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <IconSymbol
                      ios_icon_name="doc.text.fill"
                      android_material_icon_name="description"
                      size={20}
                      color="#FFFFFF"
                    />
                    <Text style={styles.actionButtonText}>
                      Generate Insurance Report
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {(!analysis || !quote) && (
              <View style={[styles.infoCard, { backgroundColor: colors.cardBackground, borderColor: colors.info }]}>
                <View style={styles.infoHeader}>
                  <IconSymbol
                    ios_icon_name="info.circle.fill"
                    android_material_icon_name="info"
                    size={24}
                    color={colors.info}
                  />
                  <Text style={[styles.infoTitle, { color: colors.text }]}>Complete Inspection Required</Text>
                </View>
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  To generate a complete insurance verification report, please complete a property inspection from the Inspection tab first. The insurance report combines:
                </Text>
                <View style={styles.bulletList}>
                  <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                    • AI-powered roof and structural analysis
                  </Text>
                  <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                    • Historical weather and storm data
                  </Text>
                  <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                    • Risk assessments and insurance claims data
                  </Text>
                  <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
                    • Comprehensive cost estimates
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <View style={styles.infoHeader}>
            <IconSymbol
              ios_icon_name="lightbulb.fill"
              android_material_icon_name="lightbulb"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.infoTitle, { color: colors.text }]}>About Insurance Verification</Text>
          </View>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            This tool fetches comprehensive historical data to support insurance claims and underwriting:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
              • Storm events and weather patterns (5 years)
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
              • Fire and flood risk assessments
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
              • Insurance claim statistics for the area
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
              • Regional roof age and replacement patterns
            </Text>
            <Text style={[styles.bulletPoint, { color: colors.textSecondary }]}>
              • Multi-factor risk scoring
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  warningCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 20,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  warningText: {
    fontSize: 14,
    lineHeight: 22,
  },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  fetchButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  fetchButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletList: {
    gap: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 20,
  },
});
