
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput, Modal } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { ImageUploader } from '@/components/ImageUploader';
import { AnalysisResults } from '@/components/AnalysisResults';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { HistoricalAnalysisDisplay } from '@/components/HistoricalAnalysisDisplay';
import { InspectionReport } from '@/types/inspection';
import { analyzeImages } from '@/utils/aiAnalysis';
import { generateQuote } from '@/utils/quoteGenerator';
import { generateInspectionPDF } from '@/utils/pdfGenerator';
import { generateInsuranceVerificationPDF } from '@/utils/insurancePdfGenerator';
import { fetchHistoricalAnalysis } from '@/utils/historicalDataFetcher';
import { IconSymbol } from '@/components/IconSymbol';
import { useInspection } from '@/contexts/InspectionContext';

type Step = 'upload' | 'analyzing' | 'results' | 'quote' | 'historical' | 'fetchingHistorical';

export default function HomeScreen() {
  const {
    images,
    setImages,
    analysis,
    setAnalysis,
    quote,
    setQuote,
    roofDiagram,
    propertyAddress,
    setPropertyAddress,
    historicalAnalysis,
    setHistoricalAnalysis,
    resetInspection,
  } = useInspection();

  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [tempAddress, setTempAddress] = useState('');

  const handleAnalyze = async () => {
    if (images.length === 0) {
      Alert.alert('No Images', 'Please upload at least one image to analyze.');
      return;
    }

    setCurrentStep('analyzing');

    try {
      const imageUris = images.map(img => img.uri);
      const analysisResult = await analyzeImages(imageUris);
      setAnalysis(analysisResult);

      const roofArea = roofDiagram?.totalArea || 2000;
      const quoteResult = generateQuote(analysisResult, roofArea);
      setQuote(quoteResult);

      setCurrentStep('results');
    } catch (error) {
      console.error('Error analyzing images:', error);
      Alert.alert('Analysis Error', 'Failed to analyze images. Please try again.');
      setCurrentStep('upload');
    }
  };

  const handleFetchHistoricalData = async () => {
    if (!propertyAddress.trim()) {
      setTempAddress('');
      setShowAddressModal(true);
      return;
    }

    await fetchHistoricalData();
  };

  const fetchHistoricalData = async () => {
    setCurrentStep('fetchingHistorical');

    try {
      const historical = await fetchHistoricalAnalysis(propertyAddress);
      setHistoricalAnalysis(historical);
      setCurrentStep('historical');
    } catch (error) {
      console.error('Error fetching historical data:', error);
      Alert.alert('Error', 'Failed to fetch historical data. Please check the address and try again.');
      setCurrentStep(analysis ? 'results' : 'upload');
    }
  };

  const handleGeneratePDF = async () => {
    if (!analysis || !quote) {
      Alert.alert('Error', 'Analysis and quote data are required to generate PDF.');
      return;
    }

    if (!propertyAddress.trim()) {
      setTempAddress('');
      setShowAddressModal(true);
      return;
    }

    await generatePDF();
  };

  const generatePDF = async () => {
    try {
      console.log('Generating PDF with roof diagram:', roofDiagram);
      
      const report: InspectionReport = {
        id: `INS-${Date.now()}`,
        propertyAddress: propertyAddress || 'Property Address Not Provided',
        inspectionDate: new Date(),
        images,
        aiAnalysis: analysis!,
        roofDiagram: roofDiagram || undefined,
        quote: quote!,
        notes: '',
      };

      await generateInspectionPDF(report);
      Alert.alert('Success', 'Professional PDF report generated and ready to share!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('PDF Error', 'Failed to generate PDF report. Please try again.');
    }
  };

  const handleGenerateInsurancePDF = async () => {
    if (!analysis || !quote || !historicalAnalysis) {
      Alert.alert('Error', 'Complete analysis and historical data are required.');
      return;
    }

    try {
      const report: InspectionReport = {
        id: `INS-${Date.now()}`,
        propertyAddress: propertyAddress || 'Property Address Not Provided',
        inspectionDate: new Date(),
        images,
        aiAnalysis: analysis,
        roofDiagram: roofDiagram || undefined,
        quote: quote,
        notes: '',
      };

      await generateInsuranceVerificationPDF(report, historicalAnalysis);
      Alert.alert('Success', 'Insurance Verification Report generated and ready to share!');
    } catch (error) {
      console.error('Error generating Insurance PDF:', error);
      Alert.alert('PDF Error', 'Failed to generate Insurance Verification Report. Please try again.');
    }
  };

  const handleSaveAddress = () => {
    if (!tempAddress.trim()) {
      Alert.alert('Required', 'Please enter a property address.');
      return;
    }
    setPropertyAddress(tempAddress);
    setShowAddressModal(false);
    
    // Determine what action to take after saving address
    if (currentStep === 'fetchingHistorical' || !analysis) {
      fetchHistoricalData();
    } else {
      generatePDF();
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Start New Inspection',
      'Are you sure you want to start a new inspection? All current data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start New',
          style: 'destructive',
          onPress: () => {
            setCurrentStep('upload');
            resetInspection();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="house.fill" 
            android_material_icon_name="home" 
            size={40} 
            color={colors.primary} 
          />
          <Text style={styles.title}>Property Inspection</Text>
          <Text style={styles.subtitle}>AI-Powered Roof & Solar Analysis</Text>
        </View>

        {currentStep === 'upload' && (
          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Property Information</Text>
              <TextInput
                style={styles.addressInput}
                value={propertyAddress}
                onChangeText={setPropertyAddress}
                placeholder="Enter property address (optional)"
                placeholderTextColor={colors.textSecondary}
                multiline
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upload Site Photos</Text>
              <Text style={styles.sectionDescription}>
                Upload photos of the property, roof, and surrounding areas for AI analysis
              </Text>
              <ImageUploader images={images} onImagesChange={setImages} maxImages={10} />
            </View>

            {roofDiagram && (
              <View style={styles.diagramInfo}>
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check_circle" 
                  size={24} 
                  color={colors.secondary} 
                />
                <View style={styles.diagramInfoContent}>
                  <Text style={styles.diagramInfoTitle}>Roof Diagram Available</Text>
                  <Text style={styles.diagramInfoText}>
                    {roofDiagram.facets.length} facets • {roofDiagram.totalArea.toFixed(0)} sq ft
                  </Text>
                </View>
              </View>
            )}

            {images.length > 0 && (
              <TouchableOpacity style={styles.analyzeButton} onPress={handleAnalyze}>
                <IconSymbol 
                  ios_icon_name="sparkles" 
                  android_material_icon_name="auto_awesome" 
                  size={24} 
                  color="#FFFFFF" 
                />
                <Text style={styles.analyzeButtonText}>Analyze with AI</Text>
              </TouchableOpacity>
            )}

            {/* Historical Analysis Button */}
            <TouchableOpacity 
              style={styles.historicalButton} 
              onPress={handleFetchHistoricalData}
            >
              <IconSymbol 
                ios_icon_name="chart.bar.doc.horizontal.fill" 
                android_material_icon_name="assessment" 
                size={24} 
                color={colors.primary} 
              />
              <View style={styles.historicalButtonContent}>
                <Text style={styles.historicalButtonTitle}>Historical Analysis</Text>
                <Text style={styles.historicalButtonSubtitle}>
                  Fetch storm data, risk zones, and insurance claims
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.infoCard}>
              <IconSymbol 
                ios_icon_name="info.circle.fill" 
                android_material_icon_name="info" 
                size={24} 
                color={colors.primary} 
              />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>What we analyze:</Text>
                <Text style={styles.infoText}>- Roof damage and condition</Text>
                <Text style={styles.infoText}>- Structural issues</Text>
                <Text style={styles.infoText}>- Solar panel compatibility</Text>
                <Text style={styles.infoText}>- Inspection concerns</Text>
                <Text style={styles.infoText}>- Historical storm events</Text>
                <Text style={styles.infoText}>- Fire and flood risk zones</Text>
              </View>
            </View>
          </View>
        )}

        {currentStep === 'analyzing' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Analyzing images with AI...</Text>
            <Text style={styles.loadingSubtext}>This may take a few moments</Text>
          </View>
        )}

        {currentStep === 'fetchingHistorical' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.error} />
            <Text style={styles.loadingText}>Fetching Historical Data...</Text>
            <Text style={styles.loadingSubtext}>
              Analyzing storm events, risk zones, and insurance claims
            </Text>
            <View style={styles.loadingSteps}>
              <Text style={styles.loadingStep}>✓ Geocoding address</Text>
              <Text style={styles.loadingStep}>✓ Fetching NOAA storm data</Text>
              <Text style={styles.loadingStep}>✓ Analyzing FEMA flood zones</Text>
              <Text style={styles.loadingStep}>✓ Checking fire risk zones</Text>
              <Text style={styles.loadingStep}>✓ Gathering insurance claims</Text>
            </View>
          </View>
        )}

        {currentStep === 'results' && analysis && (
          <View style={styles.content}>
            <AnalysisResults analysis={analysis} />

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]} 
                onPress={() => setCurrentStep('quote')}
              >
                <IconSymbol 
                  ios_icon_name="dollarsign.circle.fill" 
                  android_material_icon_name="attach_money" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.buttonText}>View Quote</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]} 
                onPress={handleGeneratePDF}
              >
                <IconSymbol 
                  ios_icon_name="doc.fill" 
                  android_material_icon_name="description" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.buttonText}>Generate PDF</Text>
              </TouchableOpacity>
            </View>

            {/* Historical Analysis Button */}
            <TouchableOpacity 
              style={styles.historicalButton} 
              onPress={handleFetchHistoricalData}
            >
              <IconSymbol 
                ios_icon_name="chart.bar.doc.horizontal.fill" 
                android_material_icon_name="assessment" 
                size={24} 
                color={colors.primary} 
              />
              <View style={styles.historicalButtonContent}>
                <Text style={styles.historicalButtonTitle}>
                  {historicalAnalysis ? 'View Historical Analysis' : 'Fetch Historical Analysis'}
                </Text>
                <Text style={styles.historicalButtonSubtitle}>
                  {historicalAnalysis 
                    ? 'Storm data and risk assessment available' 
                    : 'Get storm data, risk zones, and insurance claims'}
                </Text>
              </View>
              {historicalAnalysis && (
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check_circle" 
                  size={24} 
                  color={colors.secondary} 
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Start New Inspection</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 'quote' && quote && (
          <View style={styles.content}>
            <QuoteDisplay quote={quote} />

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]} 
                onPress={() => setCurrentStep('results')}
              >
                <IconSymbol 
                  ios_icon_name="arrow.left.circle.fill" 
                  android_material_icon_name="arrow_back" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.buttonText}>Back to Results</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]} 
                onPress={handleGeneratePDF}
              >
                <IconSymbol 
                  ios_icon_name="doc.fill" 
                  android_material_icon_name="description" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.buttonText}>Generate PDF</Text>
              </TouchableOpacity>
            </View>

            {/* Historical Analysis Button */}
            <TouchableOpacity 
              style={styles.historicalButton} 
              onPress={handleFetchHistoricalData}
            >
              <IconSymbol 
                ios_icon_name="chart.bar.doc.horizontal.fill" 
                android_material_icon_name="assessment" 
                size={24} 
                color={colors.primary} 
              />
              <View style={styles.historicalButtonContent}>
                <Text style={styles.historicalButtonTitle}>
                  {historicalAnalysis ? 'View Historical Analysis' : 'Fetch Historical Analysis'}
                </Text>
                <Text style={styles.historicalButtonSubtitle}>
                  {historicalAnalysis 
                    ? 'Storm data and risk assessment available' 
                    : 'Get storm data, risk zones, and insurance claims'}
                </Text>
              </View>
              {historicalAnalysis && (
                <IconSymbol 
                  ios_icon_name="checkmark.circle.fill" 
                  android_material_icon_name="check_circle" 
                  size={24} 
                  color={colors.secondary} 
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Start New Inspection</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 'historical' && historicalAnalysis && (
          <View style={styles.content}>
            <HistoricalAnalysisDisplay analysis={historicalAnalysis} />

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]} 
                onPress={() => setCurrentStep(analysis ? 'results' : 'upload')}
              >
                <IconSymbol 
                  ios_icon_name="arrow.left.circle.fill" 
                  android_material_icon_name="arrow_back" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.insuranceButton]} 
                onPress={handleGenerateInsurancePDF}
                disabled={!analysis || !quote}
              >
                <IconSymbol 
                  ios_icon_name="doc.text.fill" 
                  android_material_icon_name="description" 
                  size={20} 
                  color="#FFFFFF" 
                />
                <Text style={styles.buttonText}>Insurance Report</Text>
              </TouchableOpacity>
            </View>

            {analysis && quote && (
              <View style={styles.infoCard}>
                <IconSymbol 
                  ios_icon_name="info.circle.fill" 
                  android_material_icon_name="info" 
                  size={24} 
                  color={colors.error} 
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Insurance Verification Report</Text>
                  <Text style={styles.infoText}>
                    Generate a comprehensive insurance report combining historical data with your inspection results
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Start New Inspection</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Address Input Modal */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Property Address</Text>
            <Text style={styles.modalDescription}>
              Enter the property address to fetch historical data and generate reports
            </Text>
            
            <TextInput
              style={styles.modalInput}
              value={tempAddress}
              onChangeText={setTempAddress}
              placeholder="123 Main Street, City, State ZIP"
              placeholderTextColor={colors.textSecondary}
              multiline
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalCancelButton]} 
                onPress={() => setShowAddressModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalSaveButton]} 
                onPress={handleSaveAddress}
              >
                <Text style={styles.modalSaveText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  addressInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  diagramInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  diagramInfoContent: {
    flex: 1,
  },
  diagramInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  diagramInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  historicalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  historicalButtonContent: {
    flex: 1,
  },
  historicalButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  historicalButtonSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  loadingSteps: {
    marginTop: 30,
    alignItems: 'flex-start',
  },
  loadingStep: {
    fontSize: 13,
    color: colors.secondary,
    marginVertical: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  insuranceButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  resetButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalSaveButton: {
    backgroundColor: colors.primary,
  },
  modalCancelText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
