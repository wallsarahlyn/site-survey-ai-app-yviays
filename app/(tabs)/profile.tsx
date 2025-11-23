
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { colors, mode, setMode } = useThemeContext();
  const router = useRouter();

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          label: 'Theme Mode',
          icon: 'paintbrush.fill',
          iconAndroid: 'palette',
          type: 'select' as const,
          value: mode,
          options: [
            { label: 'Light Mode', value: 'light' },
            { label: 'Dark Mode', value: 'dark' },
            { label: 'Field Mode (High Visibility)', value: 'field' },
          ],
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          label: 'Profile Settings',
          icon: 'person.circle.fill',
          iconAndroid: 'account_circle',
          type: 'navigation' as const,
        },
        {
          id: 'team',
          label: 'Team Management',
          icon: 'person.2.fill',
          iconAndroid: 'people',
          type: 'navigation' as const,
        },
        {
          id: 'permissions',
          label: 'Permissions',
          icon: 'lock.fill',
          iconAndroid: 'lock',
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Business',
      items: [
        {
          id: 'branding',
          label: 'Branding Settings',
          icon: 'paintpalette.fill',
          iconAndroid: 'color_lens',
          type: 'navigation' as const,
        },
        {
          id: 'measurements',
          label: 'Measurement Settings',
          icon: 'ruler.fill',
          iconAndroid: 'straighten',
          type: 'navigation' as const,
        },
        {
          id: 'subscription',
          label: 'Subscription',
          icon: 'creditcard.fill',
          iconAndroid: 'credit_card',
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          id: 'storage',
          label: 'Cloud Storage',
          icon: 'icloud.fill',
          iconAndroid: 'cloud',
          type: 'navigation' as const,
        },
        {
          id: 'export',
          label: 'Export Data',
          icon: 'square.and.arrow.up.fill',
          iconAndroid: 'upload',
          type: 'navigation' as const,
        },
        {
          id: 'backup',
          label: 'Backup & Restore',
          icon: 'arrow.clockwise.circle.fill',
          iconAndroid: 'backup',
          type: 'navigation' as const,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          label: 'Help Center',
          icon: 'questionmark.circle.fill',
          iconAndroid: 'help',
          type: 'navigation' as const,
        },
        {
          id: 'contact',
          label: 'Contact Support',
          icon: 'envelope.fill',
          iconAndroid: 'email',
          type: 'navigation' as const,
        },
        {
          id: 'about',
          label: 'About TechOps Pro',
          icon: 'info.circle.fill',
          iconAndroid: 'info',
          type: 'navigation' as const,
        },
      ],
    },
  ];

  const handleThemeChange = () => {
    Alert.alert(
      'Select Theme',
      'Choose your preferred theme mode',
      [
        {
          text: 'Light Mode',
          onPress: () => setMode('light'),
        },
        {
          text: 'Dark Mode',
          onPress: () => setMode('dark'),
        },
        {
          text: 'Field Mode',
          onPress: () => setMode('field'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const getThemeLabel = () => {
    switch (mode) {
      case 'light': return 'Light Mode';
      case 'dark': return 'Dark Mode';
      case 'field': return 'Field Mode';
      default: return 'Light Mode';
    }
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
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>TP</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>TechOps Pro</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            admin@techopspro.com
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.accent }]}>127</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Inspections
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.success }]}>$2.4M</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Revenue
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>94%</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Close Rate
            </Text>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={item.id}>
                  <TouchableOpacity
                    style={styles.settingItem}
                    onPress={() => {
                      if (item.id === 'theme') {
                        handleThemeChange();
                      } else {
                        console.log('Navigate to:', item.id);
                      }
                    }}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, { backgroundColor: colors.accent + '20' }]}>
                        <IconSymbol
                          ios_icon_name={item.icon}
                          android_material_icon_name={item.iconAndroid}
                          size={22}
                          color={colors.accent}
                        />
                      </View>
                      <Text style={[styles.settingLabel, { color: colors.text }]}>
                        {item.label}
                      </Text>
                    </View>
                    {item.type === 'select' && (
                      <View style={styles.settingRight}>
                        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
                          {getThemeLabel()}
                        </Text>
                        <IconSymbol
                          ios_icon_name="chevron.right"
                          android_material_icon_name="chevron_right"
                          size={20}
                          color={colors.textSecondary}
                        />
                      </View>
                    )}
                    {item.type === 'navigation' && (
                      <IconSymbol
                        ios_icon_name="chevron.right"
                        android_material_icon_name="chevron_right"
                        size={20}
                        color={colors.textSecondary}
                      />
                    )}
                  </TouchableOpacity>
                  {itemIndex < section.items.length - 1 && (
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.signOutButton, { backgroundColor: colors.error }]}
            onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?')}
          >
            <IconSymbol
              ios_icon_name="arrow.right.square.fill"
              android_material_icon_name="logout"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            TechOps Pro v1.0.0
          </Text>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            © 2024 All rights reserved
          </Text>
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  versionInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  versionText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
