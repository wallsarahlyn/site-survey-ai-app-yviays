
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme, spacing, borderRadius, typography } from '@/styles/commonStyles';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from '@/app/integrations/supabase/client';
import { SampleReportCard } from '@/components/landing/SampleReportCard';
import { StepCard } from '@/components/landing/StepCard';
import { PricingCard } from '@/components/landing/PricingCard';
import { BulkPackCard } from '@/components/landing/BulkPackCard';
import { WhoItsForCard } from '@/components/landing/WhoItsForCard';
import { FAQItem } from '@/components/landing/FAQItem';

const { width: screenWidth } = Dimensions.get('window');
const isMobile = screenWidth < 768;

const SUPABASE_URL = "https://xnmhalybnxbvfaausuru.supabase.co";

export default function LandingPage() {
  const { mode } = useTheme();
  const colors = getTheme(mode);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const [sampleModalVisible, setSampleModalVisible] = useState(false);

  const handleBuyReport = (reportType: string) => {
    console.log(`Buy ${reportType} report clicked`);
  };

  const handleBuyBulkCredits = () => {
    console.log('Buy bulk credits clicked');
  };

  const handleSeeSample = () => {
    setSampleModalVisible(true);
  };

  const handleGenerateSampleReport = async (reportType: 'basic' | 'pro' | 'premium') => {
    setIsGeneratingSample(true);
    setSampleModalVisible(false);

    try {
      console.log(`Generating sample ${reportType} report...`);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to view sample reports');
        setIsGeneratingSample(false);
        return;
      }

      const token = session.access_token;
      console.log('Auth token obtained');

      const url = `${SUPABASE_URL}/functions/v1/generate-sample-report`;
      console.log('Calling Edge Function:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportType }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to generate sample report: ${response.status} ${response.statusText}\n${errorText}`);
      }

      console.log('Sample report generated successfully');

      const arrayBuffer = await response.arrayBuffer();
      console.log('PDF size:', arrayBuffer.byteLength);
      
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < uint8Array.length; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      const base64 = btoa(binary);

      const fileName = `sample-${reportType}-report.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      console.log('Saving PDF to:', fileUri);

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Sample PDF saved successfully');

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: `Sample ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        alert('PDF saved successfully!');
      }

    } catch (error) {
      console.error('Error generating sample report:', error);
      alert(`Failed to generate sample report. Please try again.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingSample(false);
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroHeadline}>
            AI-Powered Roof & Solar Inspection Reports in Minutes
          </Text>
          <Text style={styles.heroSubheadline}>
            Upload site photos, let the AI analyze everything, and download professional reports ready for roofing, solar, and insurance work.
          </Text>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleBuyReport('any')}
            >
              <Text style={[styles.primaryButtonText, { color: colors.primary }]}>
                Buy a Report
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleSeeSample}
            >
              <Text style={styles.secondaryButtonText}>
                See Sample Report
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.heroFootnote}>
            No subscription required. Pay per report or save with bulk credits.
          </Text>

          <View style={styles.mockupContainer}>
            <IconSymbol
              ios_icon_name="doc.text.fill"
              android_material_icon_name="description"
              size={80}
              color="rgba(255, 255, 255, 0.9)"
            />
            <Text style={styles.mockupText}>
              Professional PDF Report Preview
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.section, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          View Sample Reports
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          See exactly what you&apos;ll get before you buy
        </Text>
        
        <View style={styles.sampleReportsContainer}>
          <SampleReportCard
            title="Basic Inspection"
            description="Quick roof assessment with AI damage detection and repair recommendations"
            reportType="basic"
            icon="document"
            onPress={() => handleGenerateSampleReport('basic')}
          />
          
          <SampleReportCard
            title="Pro Measurement"
            description="Complete inspection with roof measurements, facet breakdown, and detailed quotes"
            reportType="pro"
            icon="ruler"
            onPress={() => handleGenerateSampleReport('pro')}
          />
          
          <SampleReportCard
            title="Premium Insurance"
            description="Full report with historical storm data, risk analysis, and insurance documentation"
            reportType="premium"
            icon="shield"
            onPress={() => handleGenerateSampleReport('premium')}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.backgroundSecondary }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          How It Works
        </Text>
        
        <View style={styles.stepsContainer}>
          <StepCard
            stepNumber="1"
            title="Upload Photos"
            description="Take or upload roof, property, and system photos from any device."
            icon="cloud-upload"
          />
          <StepCard
            stepNumber="2"
            title="AI Analysis"
            description="Our AI detects damage, performs measurements, and evaluates roof & solar readiness."
            icon="psychology"
          />
          <StepCard
            stepNumber="3"
            title="Download Your Report"
            description="Get a clean, contractor-grade PDF report in minutes."
            icon="download"
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Choose the Report You Need
        </Text>
        
        <View style={styles.pricingCardsContainer}>
          <PricingCard
            title="Basic Inspection Report"
            price="$15"
            tagline="Best for quick roof checks & homeowners."
            features={[
              'AI roof condition summary',
              'Basic damage detection',
              'Key labeled photos',
              'Repair vs. replace recommendation',
            ]}
            buttonText="Buy Basic Report – $15"
            onPress={() => handleBuyReport('basic')}
          />
          
          <PricingCard
            title="Pro Measurement & Inspection Report"
            price="$29"
            tagline="Best for roofing and solar teams."
            features={[
              'Everything in Basic',
              'Roof measurements (est. squares)',
              'Facet breakdown',
              'Recommended scope of work',
              'Proposal-ready PDF formatting',
            ]}
            buttonText="Buy Pro Report – $29"
            isPopular
            onPress={() => handleBuyReport('pro')}
          />
          
          <PricingCard
            title="Premium Insurance & Risk Report"
            price="$59"
            tagline="Best for adjusters & complex claims."
            features={[
              'Everything in Pro',
              'Historical storm & risk data',
              'Hail/wind event timeline',
              'Severity scoring',
              'Insurance-focused summary page',
            ]}
            buttonText="Buy Premium Report – $59"
            onPress={() => handleBuyReport('premium')}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.backgroundSecondary }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Save with Bulk Report Credits
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Buy credits upfront and lower your cost per report.
        </Text>
        
        <View style={styles.bulkPacksContainer}>
          <BulkPackCard
            title="Starter Pack"
            reports="10 Reports"
            price="$150"
            perReport="~$15/report"
            description="Ideal for small teams"
            onPress={handleBuyBulkCredits}
          />
          
          <BulkPackCard
            title="Growth Pack"
            reports="50 Reports"
            price="$600"
            perReport="~$12/report"
            description="Best for active contractors"
            onPress={handleBuyBulkCredits}
          />
          
          <BulkPackCard
            title="Power User Pack"
            reports="100 Reports"
            price="$1,000"
            perReport="~$10/report"
            description="Maximum savings"
            onPress={handleBuyBulkCredits}
          />
        </View>

        <Text style={[styles.creditsNote, { color: colors.textSecondary }]}>
          Credits work for all report types. (Example: Basic = 1 credit, Pro = 2 credits, Premium = 3 credits.)
        </Text>

        <TouchableOpacity
          style={[styles.bulkButton, { backgroundColor: colors.primary }]}
          onPress={handleBuyBulkCredits}
        >
          <Text style={styles.bulkButtonText}>Buy Bulk Credits</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Who It&apos;s For
        </Text>
        
        <View style={styles.whoItsForContainer}>
          <WhoItsForCard
            title="Roofing Contractors"
            description="Document damage and generate estimates faster."
            icon="construction"
          />
          <WhoItsForCard
            title="Solar Companies"
            description="Add roof & site inspection reports to every proposal."
            icon="solar-power"
          />
          <WhoItsForCard
            title="Insurance Professionals"
            description="Create claim-ready documentation instantly."
            icon="shield"
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.backgroundSecondary }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Frequently Asked Questions
        </Text>
        
        <View style={styles.faqContainer}>
          <FAQItem
            question="How fast is the report?"
            answer="Most reports generate within minutes."
            isExpanded={expandedFAQ === 0}
            onToggle={() => toggleFAQ(0)}
          />
          <FAQItem
            question="Is white-label branding available?"
            answer="Yes, Pro and Premium reports support your logo and company name."
            isExpanded={expandedFAQ === 1}
            onToggle={() => toggleFAQ(1)}
          />
          <FAQItem
            question="Do credits expire?"
            answer="Credits are valid for 12 months."
            isExpanded={expandedFAQ === 2}
            onToggle={() => toggleFAQ(2)}
          />
          <FAQItem
            question="Do I need a subscription?"
            answer="No. Buy reports individually or save with credits."
            isExpanded={expandedFAQ === 3}
            onToggle={() => toggleFAQ(3)}
          />
        </View>
      </View>

      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.ctaSection}
      >
        <Text style={styles.ctaHeadline}>
          Ready to Try AI-Powered Site Surveys?
        </Text>
        <Text style={styles.ctaSubheadline}>
          Buy a single report or save with bulk credits—no contracts required.
        </Text>
        
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => handleBuyReport('any')}
        >
          <Text style={[styles.ctaButtonText, { color: colors.primary }]}>
            Get a Report Now
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <Modal
        visible={sampleModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSampleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Choose a Sample Report
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Select which type of report you&apos;d like to preview
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => handleGenerateSampleReport('basic')}
            >
              <Text style={styles.modalButtonText}>Basic Inspection Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => handleGenerateSampleReport('pro')}
            >
              <Text style={styles.modalButtonText}>Pro Measurement Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => handleGenerateSampleReport('premium')}
            >
              <Text style={styles.modalButtonText}>Premium Insurance Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalCancelButton, { borderColor: colors.border }]}
              onPress={() => setSampleModalVisible(false)}
            >
              <Text style={[styles.modalCancelButtonText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isGeneratingSample && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingContent, { backgroundColor: colors.cardBackground }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Generating sample report...
            </Text>
          </View>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    paddingTop: Platform.OS === 'android' ? 60 : 40,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl * 2,
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: 800,
    width: '100%',
    alignItems: 'center',
  },
  heroHeadline: {
    ...typography.h1,
    fontSize: isMobile ? 28 : 40,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: '#FFFFFF',
  },
  heroSubheadline: {
    ...typography.body,
    fontSize: isMobile ? 16 : 18,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 26,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  heroButtons: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    width: '100%',
    maxWidth: 500,
  },
  primaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    flex: isMobile ? 0 : 1,
    minHeight: 50,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  primaryButtonText: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    flex: isMobile ? 0 : 1,
    minHeight: 50,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    ...typography.bodyMedium,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroFootnote: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  mockupContainer: {
    width: '100%',
    maxWidth: 400,
    height: 250,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  mockupText: {
    ...typography.body,
    marginTop: spacing.md,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  section: {
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: isMobile ? 24 : 32,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  sectionSubtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  sampleReportsContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.lg,
    maxWidth: 1200,
    width: '100%',
  },
  stepsContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.lg,
    maxWidth: 1200,
    width: '100%',
  },
  pricingCardsContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.lg,
    maxWidth: 1200,
    width: '100%',
  },
  bulkPacksContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.lg,
    maxWidth: 1200,
    width: '100%',
    marginBottom: spacing.lg,
  },
  creditsNote: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.lg,
    maxWidth: 600,
  },
  bulkButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  bulkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  whoItsForContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.lg,
    maxWidth: 1200,
    width: '100%',
  },
  faqContainer: {
    gap: spacing.md,
    maxWidth: 800,
    width: '100%',
  },
  ctaSection: {
    paddingVertical: spacing.xl * 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  ctaHeadline: {
    ...typography.h2,
    fontSize: isMobile ? 24 : 32,
    textAlign: 'center',
    marginBottom: spacing.md,
    color: '#FFFFFF',
  },
  ctaSubheadline: {
    ...typography.body,
    fontSize: isMobile ? 16 : 18,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 600,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  ctaButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minWidth: 200,
    backgroundColor: '#FFFFFF',
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  modalTitle: {
    ...typography.h2,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  modalButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalCancelButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    marginTop: spacing.sm,
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl * 2,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
