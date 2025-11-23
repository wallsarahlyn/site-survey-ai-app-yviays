
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme, spacing, borderRadius, typography } from '@/styles/commonStyles';

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

export default function LandingPage() {
  const { theme: themeMode } = useTheme();
  const colors = getTheme(themeMode);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleBuyReport = (reportType: string) => {
    console.log(`Buy ${reportType} report clicked`);
    // TODO: Implement purchase flow
  };

  const handleBuyBulkCredits = () => {
    console.log('Buy bulk credits clicked');
    // TODO: Implement bulk purchase flow
  };

  const handleSeeSample = () => {
    console.log('See sample report clicked');
    // TODO: Implement sample report view
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
          <Text style={[styles.heroHeadline, { color: '#FFFFFF' }]}>
            AI-Powered Roof & Solar Inspection Reports in Minutes
          </Text>
          <Text style={[styles.heroSubheadline, { color: 'rgba(255, 255, 255, 0.9)' }]}>
            Upload site photos, let the AI analyze everything, and download professional reports ready for roofing, solar, and insurance work.
          </Text>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: '#FFFFFF' }]}
              onPress={() => handleBuyReport('any')}
            >
              <Text style={[styles.primaryButtonText, { color: colors.primary }]}>
                Buy a Report
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: '#FFFFFF' }]}
              onPress={handleSeeSample}
            >
              <Text style={[styles.secondaryButtonText, { color: '#FFFFFF' }]}>
                See Sample Report
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.heroFootnote, { color: 'rgba(255, 255, 255, 0.8)' }]}>
            No subscription required. Pay per report or save with bulk credits.
          </Text>

          {/* Mockup Visual */}
          <View style={[styles.mockupContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
            <IconSymbol
              ios_icon_name="doc.text.fill"
              android_material_icon_name="description"
              size={80}
              color="rgba(255, 255, 255, 0.8)"
            />
            <Text style={[styles.mockupText, { color: 'rgba(255, 255, 255, 0.7)' }]}>
              Professional PDF Report Preview
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* How It Works Section */}
      <View style={[styles.section, { backgroundColor: colors.background }]}>
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
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
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
      <View style={[styles.section, { backgroundColor: colors.background }]}>
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
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
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
      <View style={[styles.section, { backgroundColor: colors.background }]}>
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
        <Text style={[styles.ctaHeadline, { color: '#FFFFFF' }]}>
          Ready to Try AI-Powered Site Surveys?
        </Text>
        <Text style={[styles.ctaSubheadline, { color: 'rgba(255, 255, 255, 0.9)' }]}>
          Buy a single report or save with bulk credits—no contracts required.
        </Text>
        
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: '#FFFFFF' }]}
          onPress={() => handleBuyReport('any')}
        >
          <Text style={[styles.ctaButtonText, { color: colors.primary }]}>
            Get a Report Now
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Bottom padding to avoid tab bar overlap */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// Step Card Component
function StepCard({ stepNumber, title, description, icon }: StepCardProps) {
  const { theme: themeMode } = useTheme();
  const colors = getTheme(themeMode);

  return (
    <View style={[styles.stepCard, { backgroundColor: colors.card }]}>
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
  const { theme: themeMode } = useTheme();
  const colors = getTheme(themeMode);

  return (
    <View style={[
      styles.pricingCard,
      { backgroundColor: colors.card, borderColor: isPopular ? colors.primary : colors.border },
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
          <View key={index} style={styles.featureRow}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check-circle"
              size={20}
              color={colors.success}
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
  const { theme: themeMode } = useTheme();
  const colors = getTheme(themeMode);

  return (
    <TouchableOpacity
      style={[styles.bulkPackCard, { backgroundColor: colors.card, borderColor: colors.border }]}
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
  const { theme: themeMode } = useTheme();
  const colors = getTheme(themeMode);

  return (
    <View style={[styles.whoItsForCard, { backgroundColor: colors.card }]}>
      <View style={[styles.whoItsForIconContainer, { backgroundColor: `${colors.primary}20` }]}>
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
  const { theme: themeMode } = useTheme();
  const colors = getTheme(themeMode);

  return (
    <TouchableOpacity
      style={[styles.faqItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, { color: colors.text }]}>{question}</Text>
        <IconSymbol
          ios_icon_name={isExpanded ? 'chevron.up' : 'chevron.down'}
          android_material_icon_name={isExpanded ? 'expand-less' : 'expand-more'}
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
  },
  heroSubheadline: {
    ...typography.body,
    fontSize: isMobile ? 16 : 18,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 26,
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
  },
  primaryButtonText: {
    ...typography.body,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    flex: isMobile ? 0 : 1,
    minHeight: 50,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    ...typography.body,
    fontWeight: '600',
    fontSize: 16,
  },
  heroFootnote: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  mockupContainer: {
    width: '100%',
    maxWidth: 400,
    height: 250,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  mockupText: {
    ...typography.body,
    marginTop: spacing.md,
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
  },
  ctaSubheadline: {
    ...typography.body,
    fontSize: isMobile ? 16 : 18,
    textAlign: 'center',
    marginBottom: spacing.xl,
    maxWidth: 600,
  },
  ctaButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minWidth: 200,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
