
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { useThemeContext } from '@/contexts/ThemeContext';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconAndroid: string;
  connected: boolean;
  category: 'automation' | 'crm' | 'accounting' | 'storage' | 'photo';
}

export default function IntegrationsScreen() {
  const { colors } = useThemeContext();
  const [integrations, setIntegrations] = React.useState<Integration[]>([
    {
      id: '1',
      name: 'Zapier',
      description: 'Automate workflows with 5000+ apps',
      icon: 'bolt.fill',
      iconAndroid: 'flash_on',
      connected: true,
      category: 'automation',
    },
    {
      id: '2',
      name: 'Zoho CRM',
      description: 'Sync leads and contacts',
      icon: 'person.2.fill',
      iconAndroid: 'people',
      connected: false,
      category: 'crm',
    },
    {
      id: '3',
      name: 'Bigin by Zoho',
      description: 'Lightweight CRM integration',
      icon: 'briefcase.fill',
      iconAndroid: 'work',
      connected: false,
      category: 'crm',
    },
    {
      id: '4',
      name: 'Monday.com',
      description: 'Project management & workflows',
      icon: 'calendar',
      iconAndroid: 'event',
      connected: true,
      category: 'automation',
    },
    {
      id: '5',
      name: 'CompanyCam',
      description: 'Photo documentation & sharing',
      icon: 'camera.fill',
      iconAndroid: 'photo_camera',
      connected: false,
      category: 'photo',
    },
    {
      id: '6',
      name: 'QuickBooks',
      description: 'Accounting & invoicing',
      icon: 'dollarsign.circle.fill',
      iconAndroid: 'attach_money',
      connected: true,
      category: 'accounting',
    },
    {
      id: '7',
      name: 'Google Drive',
      description: 'Cloud storage & file sharing',
      icon: 'folder.fill',
      iconAndroid: 'folder',
      connected: true,
      category: 'storage',
    },
    {
      id: '8',
      name: 'Dropbox',
      description: 'File sync & collaboration',
      icon: 'square.and.arrow.up.fill',
      iconAndroid: 'cloud_upload',
      connected: false,
      category: 'storage',
    },
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration.id === id
          ? { ...integration, connected: !integration.connected }
          : integration
      )
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'automation': return colors.accent;
      case 'crm': return colors.primary;
      case 'accounting': return colors.success;
      case 'storage': return colors.warning;
      case 'photo': return colors.info;
      default: return colors.textSecondary;
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
          <Text style={[styles.title, { color: colors.text }]}>Integrations</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Connect your favorite tools
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.accent }]}>
              {integrations.filter(i => i.connected).length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Connected
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: colors.textSecondary }]}>
              {integrations.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Available
            </Text>
          </View>
        </View>

        {/* Integrations List */}
        <View style={styles.section}>
          {integrations.map((integration) => (
            <View
              key={integration.id}
              style={[styles.integrationCard, { backgroundColor: colors.card }]}
            >
              <View style={[
                styles.integrationIcon,
                { backgroundColor: getCategoryColor(integration.category) + '20' }
              ]}>
                <IconSymbol
                  ios_icon_name={integration.icon}
                  android_material_icon_name={integration.iconAndroid}
                  size={28}
                  color={getCategoryColor(integration.category)}
                />
              </View>
              
              <View style={styles.integrationInfo}>
                <Text style={[styles.integrationName, { color: colors.text }]}>
                  {integration.name}
                </Text>
                <Text style={[styles.integrationDescription, { color: colors.textSecondary }]}>
                  {integration.description}
                </Text>
                {integration.connected && (
                  <View style={[styles.connectedBadge, { backgroundColor: colors.success + '20' }]}>
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check_circle"
                      size={14}
                      color={colors.success}
                    />
                    <Text style={[styles.connectedText, { color: colors.success }]}>
                      Connected
                    </Text>
                  </View>
                )}
              </View>

              <Switch
                value={integration.connected}
                onValueChange={() => toggleIntegration(integration.id)}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.section}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={32}
              color={colors.info}
            />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Need Help?
              </Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                Visit our integration guides for step-by-step setup instructions and API documentation.
              </Text>
            </View>
          </View>
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
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
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
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  integrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  integrationIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  integrationDescription: {
    fontSize: 13,
    marginBottom: 8,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  connectedText: {
    fontSize: 11,
    fontWeight: '700',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
