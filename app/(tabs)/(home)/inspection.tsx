
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
      console.log('Starting AI analysis...');
      const imageUris = images.map(img => img.uri);
      const aiAnalysis = await analyzeImages(imageUris);
      
      console.log('AI analysis completed, generating quote...');
      const roofArea = roofDiagram?.totalArea || 2000;
      const serviceQuote = generateQuote(aiAnalysis, roofArea);

      setAnalysis(aiAnalysis);
      setQuote(serviceQuote);

      Alert.alert(
        'Analysis Complete',
        'Your property inspection has been analyzed successfully!',
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
        Alert.alert(
          'Inspection Saved',
          'Your inspection has been saved to your account!',
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

      await generateInspectionPDF(report);
      
      Alert.alert(
        'PDF Generated',
        'Your inspection report has been generated and is ready to share!',
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
            Alert.alert('Reset Complete', 'You can now start a new inspection.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Property Inspection</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Upload photos and get AI-powered analysis
          </Text>
        </View>

        {!isAuthenticated && (
          <View style={[styles.warningCard, { backgroundColor: colors.cardBackground, borderColor: colors.warning }]}>
            <Text style={[styles.warningTitle, { color: colors.warning }]}>⚠️ Sign In Required</Text>
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              AI analysis requires authentication. Please sign in from the Profile tab to use this feature.
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
            value={propertyAddress}
            onChangeText={setPropertyAddress}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upload Images</Text>
          <ImageUploader images={images} onImagesChange={setImages} />
        </View>

        {images.length > 0 && !analysis && (
          <TouchableOpacity
            style={[styles.analyzeButton, { backgroundColor: colors.primary }]}
            onPress={handleAnalyze}
            disabled={isAnalyzing || !isAuthenticated}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.analyzeButtonText}>
                {isAuthenticated ? 'Analyze with AI' : 'Sign In to Analyze'}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {analysis && (
          <>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Analysis Results</Text>
              <AnalysisResults analysis={analysis} />
            </View>

            {quote && (
              <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Service Quote</Text>
                <QuoteDisplay quote={quote} />
              </View>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.success }]}
                onPress={handleSaveInspection}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionButtonText}>Save Inspection</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={handleGeneratePDF}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionButtonText}>Generate PDF Report</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.error }]}
                onPress={handleReset}
              >
                <Text style={styles.actionButtonText}>Start New Inspection</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {roofDiagram && (
          <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>📐 Roof Diagram Available</Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Total Area: {roofDiagram.totalArea.toFixed(2)} sq ft
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Facets: {roofDiagram.facets.length}
            </Text>
            <TouchableOpacity
              style={[styles.linkButton, { borderColor: colors.primary }]}
              onPress={() => router.push('/(tabs)/drawing')}
            >
              <Text style={[styles.linkButtonText, { color: colors.primary }]}>
                View Roof Drawing
              </Text>
            </TouchableOpacity>
          </View>
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
  },
  analyzeButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  analyzeButtonText: {
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
    marginBottom: 8,
  },
  linkButton: {
    marginTop: 12,
    height: 44,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
});
