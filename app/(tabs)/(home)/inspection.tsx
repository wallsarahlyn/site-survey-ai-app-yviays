
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
import { useRouter } from 'expo-router';
import { useInspection } from '@/contexts/InspectionContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import { analyzeImages } from '@/utils/aiAnalysis';
import { generateQuote } from '@/utils/quoteGenerator';
import { generateInspectionPDF } from '@/utils/pdfGenerator';
import { saveInspection } from '@/utils/supabaseHelpers';
import { InspectionReport } from '@/types/inspection';
import ImageUploader from '@/components/ImageUploader';
import AnalysisResults from '@/components/AnalysisResults';
import QuoteDisplay from '@/components/QuoteDisplay';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';

export default function InspectionScreen() {
  const router = useRouter();
  const { colors } = useThemeContext();
  const {
    images,
    setImages,
    analysis,
    setAnalysis,
    quote,
    setQuote,
    propertyAddress,
    setPropertyAddress,
    roofDiagram,
    resetInspection,
  } = useInspection();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [savedInspectionId, setSavedInspectionId] = useState<string | null>(null);
  const [pdfProgress, setPdfProgress] = useState<string>('');

  // Check authentication status on mount
  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const handleAnalyze = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You need to be signed in to use AI analysis. Please sign in from the Profile tab.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (images.length === 0) {
      Alert.alert('No Images', 'Please upload at least one image to analyze.');
      return;
    }

    if (!propertyAddress.trim()) {
      Alert.alert('Missing Address', 'Please enter a property address.');
      return;
    }

    setIsAnalyzing(true);

    try {
      console.log('Starting enhanced AI analysis...');
      const imageUris = images.map(img => img.uri);
      const aiAnalysis = await analyzeImages(imageUris);
      
      console.log('AI analysis completed, generating quote...');
      const roofArea = roofDiagram?.totalArea || 2000;
      const serviceQuote = generateQuote(aiAnalysis, roofArea);

      setAnalysis(aiAnalysis);
      setQuote(serviceQuote);

      Alert.alert(
        'Analysis Complete',
        'Your property inspection has been analyzed successfully! Review the detailed findings below.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Error',
        error instanceof Error ? error.message : 'Failed to analyze images. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveInspection = async () => {
    if (!analysis || !quote) {
      Alert.alert('Incomplete Data', 'Please complete the analysis first.');
      return;
    }

    setIsSaving(true);

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

      const inspectionId = await saveInspection(report);
      
      if (inspectionId) {
        setSavedInspectionId(inspectionId);
        Alert.alert(
          'Inspection Saved',
          'Your inspection has been saved to your account! You can now generate a comprehensive PDF report.',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error('Failed to save inspection');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert(
        'Save Error',
        'Failed to save inspection. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!analysis || !quote) {
      Alert.alert('Incomplete Data', 'Please complete the analysis first.');
      return;
    }

    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You need to be signed in to generate PDF reports. Please sign in from the Profile tab.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsGeneratingPDF(true);
    setPdfProgress('Preparing inspection data...');

    try {
      const report: InspectionReport = {
        id: savedInspectionId || `INS-${Date.now()}`,
        propertyAddress: propertyAddress || 'Unknown Address',
        inspectionDate: new Date(),
        images,
        aiAnalysis: analysis,
        quote,
        roofDiagram: roofDiagram || undefined,
        notes: '',
      };

      console.log('Generating comprehensive PDF report from inspection data...');
      setPdfProgress('Generating PDF on server...');
      
      await generateInspectionPDF(report, savedInspectionId || undefined);
      
      setPdfProgress('PDF ready!');
      
      Alert.alert(
        'PDF Generated Successfully',
        'Your complete inspection report has been generated and is ready to share!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('PDF generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate PDF. Please try again.';
      Alert.alert(
        'PDF Generation Error',
        `${errorMessage}\n\nPlease check your internet connection and try again. If the problem persists, contact support.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsGeneratingPDF(false);
      setPdfProgress('');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Inspection',
      'Are you sure you want to start a new inspection? All current data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetInspection();
            setSavedInspectionId(null);
            Alert.alert('Reset Complete', 'You can now start a new inspection.');
          },
        },
      ]
    );
  };

  const navigateToRoofDrawing = () => {
    router.push('/(tabs)/drawing');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Property Inspection</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Upload photos and get comprehensive AI-powered analysis
          </Text>
        </View>

        {!isAuthenticated && (
          <View style={[styles.warningCard, { backgroundColor: colors.cardBackground, borderColor: colors.warning }]}>
            <View style={styles.warningHeader}>
              <IconSymbol ios_icon_name="exclamationmark.triangle.fill" android_material_icon_name="warning" size={24} color={colors.warning} />
              <Text style={[styles.warningTitle, { color: colors.warning }]}>Sign In Required</Text>
            </View>
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              AI analysis and PDF generation require authentication. Please sign in from the Profile tab to use these features.
            </Text>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Property Address</Text>
          <AddressAutocomplete
            value={propertyAddress}
            onChangeText={setPropertyAddress}
            onAddressSelect={(addressComponents) => {
              console.log('Address selected:', addressComponents);
              setPropertyAddress(addressComponents.formattedAddress);
            }}
            placeholder="Enter property address"
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upload Images</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Upload multiple photos of the property including roof, exterior walls, and any areas of concern
          </Text>
          <ImageUploader images={images} onImagesChange={setImages} maxImages={15} />
        </View>

        <View style={[styles.roofToolCard, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
          <View style={styles.roofToolHeader}>
            <IconSymbol ios_icon_name="square.grid.3x3.fill" android_material_icon_name="grid_on" size={32} color={colors.primary} />
            <View style={styles.roofToolTextContainer}>
              <Text style={[styles.roofToolTitle, { color: colors.text }]}>Roof Facet Measurement Tool</Text>
              <Text style={[styles.roofToolSubtitle, { color: colors.textSecondary }]}>
                {roofDiagram 
                  ? `${roofDiagram.facets.length} facets measured • ${roofDiagram.totalArea.toFixed(0)} sq ft total`
                  : 'Draw and measure roof facets for accurate estimates and detailed analysis'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.roofToolButton, { backgroundColor: colors.primary }]}
            onPress={navigateToRoofDrawing}
          >
            <IconSymbol 
              ios_icon_name={roofDiagram ? "pencil.circle.fill" : "plus.circle.fill"} 
              android_material_icon_name={roofDiagram ? "edit" : "add_circle"} 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={styles.roofToolButtonText}>
              {roofDiagram ? 'Edit Roof Diagram' : 'Create Roof Diagram'}
            </Text>
          </TouchableOpacity>
        </View>

        {images.length > 0 && !analysis && (
          <TouchableOpacity
            style={[styles.analyzeButton, { 
              backgroundColor: isAuthenticated ? colors.primary : colors.textSecondary,
              opacity: isAnalyzing ? 0.7 : 1,
            }]}
            onPress={handleAnalyze}
            disabled={isAnalyzing || !isAuthenticated}
          >
            {isAnalyzing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.analyzeButtonText}>Analyzing with AI...</Text>
              </View>
            ) : (
              <>
                <IconSymbol 
                  ios_icon_name="sparkles" 
                  android_material_icon_name="auto_awesome" 
                  size={24} 
                  color="#FFFFFF" 
                />
                <Text style={styles.analyzeButtonText}>
                  {isAuthenticated ? 'Analyze with AI' : 'Sign In to Analyze'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {analysis && (
          <>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Analysis Results</Text>
                <View style={[styles.badge, { backgroundColor: colors.success }]}>
                  <Text style={styles.badgeText}>Complete</Text>
                </View>
              </View>
              <AnalysisResults analysis={analysis} />
            </View>

            {quote && (
              <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Service Quote</Text>
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.badgeText}>Estimated</Text>
                  </View>
                </View>
                <QuoteDisplay quote={quote} />
              </View>
            )}

            {roofDiagram && (
              <View style={[styles.infoCard, { backgroundColor: colors.cardBackground, borderColor: colors.success }]}>
                <View style={styles.infoCardHeader}>
                  <IconSymbol ios_icon_name="checkmark.circle.fill" android_material_icon_name="check_circle" size={24} color={colors.success} />
                  <Text style={[styles.infoTitle, { color: colors.text }]}>Roof Diagram Included</Text>
                </View>
                <View style={styles.roofDiagramStats}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Area</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>{roofDiagram.totalArea.toFixed(2)} sq ft</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Facets</Text>
                    <Text style={[styles.statValue, { color: colors.text }]}>{roofDiagram.facets.length}</Text>
                  </View>
                </View>
                <Text style={[styles.infoHighlight, { color: colors.success }]}>
                  ✓ Detailed roof measurements will be included in the PDF report
                </Text>
              </View>
            )}

            <View style={[styles.infoCard, { backgroundColor: colors.cardBackground, borderColor: colors.primary }]}>
              <View style={styles.infoCardHeader}>
                <IconSymbol ios_icon_name="doc.text.fill" android_material_icon_name="description" size={24} color={colors.primary} />
                <Text style={[styles.infoTitle, { color: colors.text }]}>Professional PDF Report</Text>
              </View>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Your PDF report will be generated server-side with professional formatting, ensuring a complete, 
                structured report with all sections properly laid out.
              </Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <IconSymbol ios_icon_name="checkmark.circle" android_material_icon_name="check_circle" size={16} color={colors.primary} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>Multi-page report with cover page</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol ios_icon_name="checkmark.circle" android_material_icon_name="check_circle" size={16} color={colors.primary} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>Detailed AI analysis and findings</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol ios_icon_name="checkmark.circle" android_material_icon_name="check_circle" size={16} color={colors.primary} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>Roof measurements and diagrams</Text>
                </View>
                <View style={styles.featureItem}>
                  <IconSymbol ios_icon_name="checkmark.circle" android_material_icon_name="check_circle" size={16} color={colors.primary} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>Comprehensive cost breakdown</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionButtons}>
              {!savedInspectionId && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.success }]}
                  onPress={handleSaveInspection}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <IconSymbol ios_icon_name="square.and.arrow.down.fill" android_material_icon_name="save" size={20} color="#FFFFFF" />
                      <Text style={styles.actionButtonText}>Save Inspection</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {savedInspectionId && (
                <View style={[styles.infoCard, { backgroundColor: colors.cardBackground, borderColor: colors.success }]}>
                  <View style={styles.infoCardHeader}>
                    <IconSymbol ios_icon_name="checkmark.circle.fill" android_material_icon_name="check_circle" size={20} color={colors.success} />
                    <Text style={[styles.infoText, { color: colors.success, fontWeight: '600' }]}>Inspection Saved Successfully</Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[styles.actionButton, { 
                  backgroundColor: isAuthenticated ? colors.primary : colors.textSecondary,
                  opacity: isGeneratingPDF ? 0.7 : 1,
                }]}
                onPress={handleGeneratePDF}
                disabled={isGeneratingPDF || !isAuthenticated}
              >
                {isGeneratingPDF ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <View style={styles.progressTextContainer}>
                      <Text style={styles.actionButtonText}>Generating PDF...</Text>
                      {pdfProgress && (
                        <Text style={styles.progressText}>{pdfProgress}</Text>
                      )}
                    </View>
                  </View>
                ) : (
                  <>
                    <IconSymbol ios_icon_name="doc.text.fill" android_material_icon_name="description" size={20} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>
                      {isAuthenticated ? 'Download Full PDF Report' : 'Sign In to Generate PDF'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.resetButton, { backgroundColor: colors.error }]}
                onPress={handleReset}
              >
                <IconSymbol ios_icon_name="arrow.counterclockwise" android_material_icon_name="refresh" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Start New Inspection</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

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
    lineHeight: 24,
  },
  warningCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  roofToolCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
  },
  roofToolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  roofToolTextContainer: {
    flex: 1,
  },
  roofToolTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  roofToolSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  roofToolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    gap: 8,
  },
  roofToolButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTextContainer: {
    alignItems: 'flex-start',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    gap: 8,
  },
  resetButton: {
    marginTop: 8,
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
    borderWidth: 2,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoHighlight: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  roofDiagramStats: {
    flexDirection: 'row',
    gap: 24,
    marginVertical: 12,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  featureList: {
    marginTop: 12,
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
});
