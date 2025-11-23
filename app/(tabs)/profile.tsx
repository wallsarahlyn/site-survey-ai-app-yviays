
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol 
              ios_icon_name="person.circle.fill" 
              android_material_icon_name="account_circle" 
              size={80} 
              color={colors.primary} 
            />
          </View>
          <Text style={styles.name}>Inspector Pro</Text>
          <Text style={styles.email}>inspector@example.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This App</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              This AI-powered property inspection app helps you analyze residential and commercial properties 
              for roof damage, structural issues, and solar compatibility.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featureCard}>
            <IconSymbol 
              ios_icon_name="camera.fill" 
              android_material_icon_name="camera_alt" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Photo Upload & Analysis</Text>
              <Text style={styles.featureDescription}>
                Upload multiple site photos for comprehensive AI analysis
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto_awesome" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AI-Powered Detection</Text>
              <Text style={styles.featureDescription}>
                Detect roof damage, structural issues, and solar compatibility
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <IconSymbol 
              ios_icon_name="pencil.and.scribble" 
              android_material_icon_name="draw" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Roof Drawing Tool</Text>
              <Text style={styles.featureDescription}>
                Draw and measure roof facets with automatic calculations
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <IconSymbol 
              ios_icon_name="doc.fill" 
              android_material_icon_name="description" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>PDF Reports</Text>
              <Text style={styles.featureDescription}>
                Generate professional inspection reports with quotes
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <IconSymbol 
              ios_icon_name="dollarsign.circle.fill" 
              android_material_icon_name="attach_money" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Instant Quotes</Text>
              <Text style={styles.featureDescription}>
                Get instant service quotes for roofing, solar, and repairs
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.card}>
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Upload photos of the property</Text>
            </View>
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>AI analyzes images for damage and compatibility</Text>
            </View>
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Review detailed analysis results</Text>
            </View>
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>Get instant service quotes</Text>
            </View>
            <View style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>5</Text>
              </View>
              <Text style={styles.stepText}>Generate and share PDF reports</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note</Text>
          <View style={styles.noteCard}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={24} 
              color={colors.accent} 
            />
            <Text style={styles.noteText}>
              This app uses mock AI analysis for demonstration purposes. 
              In a production environment, it would integrate with real AI services 
              for accurate property analysis.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
