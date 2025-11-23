
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
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useInspection } from '@/contexts/InspectionContext';
import { fetchHistoricalAnalysis } from '@/utils/historicalDataFetcher';
import { generateInsuranceVerificationPDF } from '@/utils/insurancePdfGenerator';
import { saveHistoricalAnalysis } from '@/utils/supabaseHelpers';
import HistoricalAnalysisDisplay from '@/components/HistoricalAnalysisDisplay';
import { InspectionReport } from '@/types/inspection';
import { supabase } from '@/app/integrations/supabase/client';

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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Insurance Verification</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Historical data analysis for underwriting
          </Text>
        </View>

        {!isAuthenticated && (
          <View style={[styles.warningCard, { backgroundColor: colors.cardBackground, borderColor: '#F59E0B' }]}>
            <Text style={[styles.warningTitle, { color: '#F59E0B' }]}>⚠️ Sign In Required</Text>
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              Historical data analysis requires authentication. Please sign in from the Profile tab to use this feature.
            </Text>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Property Address</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.background, 
              color: colors.text,
              borderColor: colors.border 
            }]}
            placeholder="Enter property address"
            placeholderTextColor={colors.textSecondary}
            value={localAddress}
            onChangeText={setLocalAddress}
          />
          
          <TouchableOpacity
            style={[styles.fetchButton, { backgroundColor: colors.primary }]}
            onPress={handleFetchData}
            disabled={isFetching || !isAuthenticated}
          >
            {isFetching ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.fetchButtonText}>
                {isAuthenticated ? 'Fetch Historical Data' : 'Sign In to Fetch Data'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {historicalAnalysis && (
          <>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Historical Analysis</Text>
              <HistoricalAnalysisDisplay analysis={historicalAnalysis} />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.success }]}
                onPress={handleSaveAnalysis}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionButtonText}>Save Analysis</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={handleGeneratePDF}
                disabled={isGeneratingPDF || !analysis || !quote}
              >
                {isGeneratingPDF ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionButtonText}>
                    Generate Insurance Report
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {(!analysis || !quote) && (
              <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.infoTitle, { color: colors.text }]}>📋 Complete Inspection Required</Text>
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  To generate a complete insurance verification report, please complete a property inspection from the Inspection tab first.
                </Text>
              </View>
            )}
          </>
        )}

        <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>ℹ️ About Insurance Verification</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            This tool fetches comprehensive historical data including:
          </Text>
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

        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  warningCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  fetchButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 24,
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});
