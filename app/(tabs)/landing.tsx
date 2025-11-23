
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

const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isMobile = screenWidth < 768;

interface PricingCardProps {
  title: string;
  price: string;
  tagline: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
  onPress: () => void;
}

interface BulkPackCardProps {
  title: string;
  reports: string;
  price: string;
  perReport: string;
  description: string;
  onPress: () => void;
}

interface StepCardProps {
  stepNumber: string;
  title: string;
  description: string;
  icon: string;
}

interface WhoItsForCardProps {
  title: string;
  description: string;
  icon: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

interface SampleReportCardProps {
  title: string;
  description: string;
  reportType: 'basic' | 'pro' | 'premium';
  icon: string;
  onPress: () => void;
}

export default function LandingPage() {
  const { mode } = useTheme();
  const colors = getTheme(mode);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isGeneratingSample, setIsGeneratingSample] = useState(false);
  const [sampleModalVisible, setSampleModalVisible] = useState(false);

  const handleBuyReport = (reportType: string) => {
    console.log(`Buy ${reportType} report clicked`);
    // TODO: Implement purchase flow
  };

  const handleBuyBulkCredits = () => {
    console.log('Buy bulk credits clicked');
    // TODO: Implement bulk purchase flow
  };

  const handleSeeSample = () => {
    setSampleModalVisible(true);
  };

  const handleGenerateSampleReport = async (reportType: 'basic' | 'pro' | 'premium') => {
    setIsGeneratingSample(true);
    setSampleModalVisible(false);

    try {
      console.log(`Generating sample ${reportType} report...`);

      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to view sample reports');
        setIsGeneratingSample(false);
        return;
      }

      // Call the Edge Function to generate sample PDF
      const { data, error } = await supabase.functions.invoke('generate-sample-report', {
        body: { reportType },
      });

      if (error) {
        console.error('Error generating sample report:', error);
        alert('Failed to generate sample report. Please try again.');
        setIsGeneratingSample(false);
        return;
      }

      if (!data) {
        throw new Error('No PDF data returned from server');
      }

      console.log('Sample report generated successfully');

      // Convert the response to a blob and save it
      const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
      
      // Create a file URI
      const fileName = `sample-${reportType}-report.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const base64 = base64data.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const base64 = await base64Promise;

      // Write the file
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('Sample PDF saved to:', fileUri);

      // Share the PDF
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
      alert('Failed to generate sample report. Please try again.');
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
      {/* Hero Section */}
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

          {/* Mockup Visual */}
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

      {/* Sample Reports Section */}
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

      {/* How It Works Section */}
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

      {/* Report Types & Pricing Section */}
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

      {/* Bulk Pricing Section */}
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

      {/* Who It's For Section */}
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

      {/* FAQ Section */}
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

      {/* Final CTA Section */}
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

      {/* Sample Report Modal */}
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

      {/* Loading Overlay */}
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

      {/* Bottom padding to avoid tab bar overlap */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// Sample Report Card Component
function SampleReportCard({ title, description, reportType, icon, onPress }: SampleReportCardProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <TouchableOpacity
      style={[styles.sampleReportCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.sampleReportIconContainer, { backgroundColor: `${colors.primary}15` }]}>
        <IconSymbol
          ios_icon_name={icon}
          android_material_icon_name={icon}
          size={40}
          color={colors.primary}
        />
      </View>
      <Text style={[styles.sampleReportTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.sampleReportDescription, { color: colors.textSecondary }]}>
        {description}
      </Text>
      <View style={[styles.sampleReportButton, { backgroundColor: colors.primary }]}>
        <Text style={styles.sampleReportButtonText}>View Sample</Text>
        <IconSymbol
          ios_icon_name="arrow.right"
          android_material_icon_name="arrow_forward"
          size={16}
          color="#FFFFFF"
        />
      </View>
    </TouchableOpacity>
  );
}

// Step Card Component
function StepCard({ stepNumber, title, description, icon }: StepCardProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <View style={[styles.stepCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={[styles.stepNumberBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.stepNumberText}>{stepNumber}</Text>
      </View>
      <IconSymbol
        ios_icon_name={icon}
        android_material_icon_name={icon}
        size={48}
        color={colors.primary}
      />
      <Text style={[styles.stepTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  );
}

// Pricing Card Component
function PricingCard({
  title,
  price,
  tagline,
  features,
  buttonText,
  isPopular,
  onPress,
}: PricingCardProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <View style={[
      styles.pricingCard,
      { backgroundColor: colors.cardBackground, borderColor: isPopular ? colors.primary : colors.border },
      isPopular && styles.popularCard,
    ]}>
      {isPopular && (
        <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.popularBadgeText}>Most Popular</Text>
        </View>
      )}
      
      <Text style={[styles.pricingTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.pricingPrice, { color: colors.primary }]}>{price}</Text>
      <Text style={[styles.pricingTagline, { color: colors.textSecondary }]}>
        {tagline}
      </Text>
      
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <React.Fragment key={index}>
          <View style={styles.featureRow}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check_circle"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
          </View>
          </React.Fragment>
        ))}
      </View>
      
      <TouchableOpacity
        style={[styles.pricingButton, { backgroundColor: colors.primary }]}
        onPress={onPress}
      >
        <Text style={styles.pricingButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
}

// Bulk Pack Card Component
function BulkPackCard({
  title,
  reports,
  price,
  perReport,
  description,
  onPress,
}: BulkPackCardProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <TouchableOpacity
      style={[styles.bulkPackCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.bulkPackTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.bulkPackReports, { color: colors.primary }]}>{reports}</Text>
      <Text style={[styles.bulkPackPrice, { color: colors.text }]}>{price}</Text>
      <Text style={[styles.bulkPackPerReport, { color: colors.textSecondary }]}>
        {perReport}
      </Text>
      <Text style={[styles.bulkPackDescription, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

// Who It's For Card Component
function WhoItsForCard({ title, description, icon }: WhoItsForCardProps) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <View style={[styles.whoItsForCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={[styles.whoItsForIconContainer, { backgroundColor: `${colors.primary}15` }]}>
        <IconSymbol
          ios_icon_name={icon}
          android_material_icon_name={icon}
          size={40}
          color={colors.primary}
        />
      </View>
      <Text style={[styles.whoItsForTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.whoItsForDescription, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  );
}

// FAQ Item Component
function FAQItem({ question, answer, isExpanded, onToggle }: FAQItemProps & { isExpanded: boolean; onToggle: () => void }) {
  const { mode } = useTheme();
  const colors = getTheme(mode);

  return (
    <TouchableOpacity
      style={[styles.faqItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.text }]}>{question}</Text>
        <IconSymbol
          ios_icon_name={isExpanded ? 'chevron.up' : 'chevron.down'}
          android_material_icon_name={isExpanded ? 'expand_less' : 'expand_more'}
          size={24}
          color={colors.textSecondary}
        />
      </View>
      {isExpanded && (
        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{answer}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Hero Section
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
  
  // Section Styles
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
  
  // Sample Reports
  sampleReportsContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.lg,
    maxWidth: 1200,
    width: '100%',
  },
  sampleReportCard: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    minHeight: 280,
  },
  sampleReportIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  sampleReportTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  sampleReportDescription: {
    ...typography.body,
    lineHeight: 22,
    marginBottom: spacing.lg,
    flex: 1,
  },
  sampleReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  sampleReportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // How It Works
  stepsContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.lg,
    maxWidth: 1200,
    width: '100%',
  },
  stepCard: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    minHeight: 280,
    borderWidth: 1,
  },
  stepNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  stepTitle: {
    ...typography.h3,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  stepDescription: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // Pricing Cards
  pricingCardsContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.lg,
    maxWidth: 1200,
    width: '100%',
  },
  pricingCard: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    minHeight: 500,
  },
  popularCard: {
    borderWidth: 3,
    transform: isMobile ? [] : [{ scale: 1.05 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pricingTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  pricingPrice: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  pricingTagline: {
    ...typography.caption,
    marginBottom: spacing.lg,
  },
  featuresContainer: {
    flex: 1,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    ...typography.body,
    flex: 1,
  },
  pricingButton: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  pricingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Bulk Packs
  bulkPacksContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.lg,
    maxWidth: 1200,
    width: '100%',
    marginBottom: spacing.lg,
  },
  bulkPackCard: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 220,
  },
  bulkPackTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  bulkPackReports: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  bulkPackPrice: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  bulkPackPerReport: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  bulkPackDescription: {
    ...typography.caption,
    textAlign: 'center',
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
  
  // Who It's For
  whoItsForContainer: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: spacing.lg,
    maxWidth: 1200,
    width: '100%',
  },
  whoItsForCard: {
    flex: 1,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    minHeight: 220,
    borderWidth: 1,
  },
  whoItsForIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  whoItsForTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  whoItsForDescription: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // FAQ
  faqContainer: {
    gap: spacing.md,
    maxWidth: 800,
    width: '100%',
  },
  faqItem: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  faqAnswer: {
    ...typography.body,
    marginTop: spacing.md,
    lineHeight: 24,
  },
  
  // Final CTA
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
  
  // Modal Styles
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
  
  // Loading Overlay
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
