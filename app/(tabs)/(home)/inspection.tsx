
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useInspection } from '@/contexts/InspectionContext';
import { ImageUploader } from '@/components/ImageUploader';
import { AnalysisResults } from '@/components/AnalysisResults';
import { QuoteDisplay } from '@/components/QuoteDisplay';
import { IconSymbol } from '@/components/IconSymbol';
import { analyzeImages } from '@/utils/aiAnalysis';
import { generateQuote } from '@/utils/quoteGenerator';
import { generateInspectionPDF } from '@/utils/pdfGenerator';
import { InspectionReport } from '@/types/inspection';

export default function InspectionScreen() {
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
  } = useInspection();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleStartInspection = async () => {
    if (images.length === 0) {
      Alert.alert('No Images', 'Please upload at least one image to start the inspection.');
      return;
    }

    if (!propertyAddress.trim()) {
      Alert.alert('Missing Address', 'Please enter a property address.');
      return;
    }

    try {
      setIsAnalyzing(true);
      console.log('Starting AI analysis with', images.length, 'images');

      // Run AI analysis
      const analysisResult = await analyzeImages(images.map(img => img.uri));
      console.log('AI analysis completed:', analysisResult);
      setAnalysis(analysisResult);

      // Generate quote based on analysis
      const roofArea = roofDiagram?.totalArea || 2000;
      const quoteResult = generateQuote(analysisResult, roofArea);
      console.log('Quote generated:', quoteResult);
      setQuote(quoteResult);

      Alert.alert('Success', 'Inspection analysis completed successfully!');
    } catch (error) {
      console.error('Error during inspection:', error);
      Alert.alert('Error', 'Failed to analyze images. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!analysis || !quote) {
      Alert.alert('No Analysis', 'Please complete the inspection analysis first.');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      console.log('Generating PDF report...');

      const report: InspectionReport = {
        id: `INS-${Date.now()}`,
        propertyAddress: propertyAddress || 'Unknown Address',
        inspectionDate: new Date(),
        images,
        aiAnalysis: analysis,
        quote,
        roofDiagram: roofDiagram || undefined,
      };

      await generateInspectionPDF(report);
      console.log('PDF report generated successfully');
      Alert.alert('Success', 'Inspection report generated and ready to share!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Inspection',
      'Are you sure you want to reset? All data will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setImages([]);
            setAnalysis(null);
            setQuote(null);
            setPropertyAddress('');
          },
        },
      ]
    );
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
          <View>
            <Text style={[styles.title, { color: colors.text }]}>New Inspection</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Upload photos and analyze property
            </Text>
          </View>
          {(analysis || images.length > 0) && (
            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: colors.card }]}
              onPress={handleReset}
            >
              <IconSymbol
                ios_icon_name="arrow.counterclockwise"
                android_material_icon_name="refresh"
                size={24}
                color={colors.error}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Property Address Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Property Address</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol
              ios_icon_name="location.fill"
              android_material_icon_name="location_on"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter property address"
              placeholderTextColor={colors.textSecondary}
              value={propertyAddress}
              onChangeText={setPropertyAddress}
            />
          </View>
        </View>

        {/* Image Upload Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upload Photos</Text>
          <ImageUploader images={images} onImagesChange={setImages} maxImages={20} />
        </View>

        {/* Start Inspection Button */}
        {!analysis && images.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              onPress={handleStartInspection}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <React.Fragment>
                  <IconSymbol
                    ios_icon_name="sparkles"
                    android_material_icon_name="auto_awesome"
                    size={24}
                    color="#FFFFFF"
                  />
                  <Text style={styles.primaryButtonText}>Start AI Analysis</Text>
                </React.Fragment>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Analysis Results */}
        {analysis && (
          <View style={styles.section}>
            <AnalysisResults analysis={analysis} />
          </View>
        )}

        {/* Quote Display */}
        {quote && (
          <View style={styles.section}>
            <QuoteDisplay quote={quote} />
          </View>
        )}

        {/* Generate Report Button */}
        {analysis && quote && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: colors.success }]}
              onPress={handleGenerateReport}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <React.Fragment>
                  <IconSymbol
                    ios_icon_name="doc.text.fill"
                    android_material_icon_name="description"
                    size={24}
                    color="#FFFFFF"
                  />
                  <Text style={styles.secondaryButtonText}>Generate PDF Report</Text>
                </React.Fragment>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Info Card */}
        {!analysis && images.length === 0 && (
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={32}
              color={colors.primary}
            />
            <Text style={[styles.infoTitle, { color: colors.text }]}>How It Works</Text>
            <View style={styles.infoSteps}>
              <View style={styles.infoStep}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                  Enter the property address
                </Text>
              </View>
              <View style={styles.infoStep}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                  Upload photos of the property
                </Text>
              </View>
              <View style={styles.infoStep}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                  Click &apos;Start AI Analysis&apos; to analyze
                </Text>
              </View>
              <View style={styles.infoStep}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                  Review results and generate PDF report
                </Text>
              </View>
            </View>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  resetButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    gap: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  infoCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 24,
  },
  infoSteps: {
    width: '100%',
    gap: 16,
  },
  infoStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
