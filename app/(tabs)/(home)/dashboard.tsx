
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useThemeContext } from '@/contexts/ThemeContext';
import { QuickAction, RecentInspection, JobQueueItem } from '@/types/dashboard';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useThemeContext();

  // Mock data - replace with real data from context/API
  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'New Inspection',
      subtitle: 'Upload & analyze photos',
      icon: 'camera.fill',
      iconAndroid: 'photo_camera',
      color: colors.primary,
      route: '/(tabs)/(home)/inspection',
    },
    {
      id: '2',
      title: 'Roof Drawing',
      subtitle: 'Create measurements',
      icon: 'pencil.and.ruler.fill',
      iconAndroid: 'architecture',
      color: colors.accent,
      route: '/(tabs)/drawing',
    },
    {
      id: '3',
      title: 'Generate Quote',
      subtitle: 'Instant estimates',
      icon: 'dollarsign.circle.fill',
      iconAndroid: 'attach_money',
      color: colors.success,
      route: '/(tabs)/estimator',
    },
    {
      id: '4',
      title: 'Operations',
      subtitle: 'Manage jobs',
      icon: 'wrench.and.screwdriver.fill',
      iconAndroid: 'build',
      color: colors.warning,
      route: '/(tabs)/operations',
    },
  ];

  const recentInspections: RecentInspection[] = [
    {
      id: '1',
      address: '123 Main St, Austin, TX',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      severity: 'medium',
      imageCount: 8,
    },
    {
      id: '2',
      address: '456 Oak Ave, Dallas, TX',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'pending',
      severity: 'high',
      imageCount: 12,
    },
    {
      id: '3',
      address: '789 Pine Rd, Houston, TX',
      date: new Date(Date.now() - 48 * 60 * 60 * 1000),
      status: 'completed',
      severity: 'low',
      imageCount: 6,
    },
  ];

  const jobQueue: JobQueueItem[] = [
    {
      id: '1',
      title: 'Roof Inspection',
      address: '321 Elm St, San Antonio, TX',
      scheduledDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
      status: 'scheduled',
      priority: 'high',
      assignedTo: 'John Smith',
    },
    {
      id: '2',
      title: 'Solar Assessment',
      address: '654 Maple Dr, Fort Worth, TX',
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'scheduled',
      priority: 'medium',
      assignedTo: 'Sarah Johnson',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'in-progress': return colors.primary;
      case 'scheduled': return colors.info;
      case 'pending': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatUpcoming = (date: Date) => {
    const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
    if (seconds < 60) return 'Now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `In ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `In ${hours}h`;
    const days = Math.floor(hours / 24);
    return `In ${days}d`;
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
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back</Text>
            <Text style={[styles.title, { color: colors.text }]}>InspectAI</Text>
          </View>
          <TouchableOpacity 
            style={[styles.profileButton, { backgroundColor: colors.cardBackground }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <IconSymbol
              ios_icon_name="person.circle.fill"
              android_material_icon_name="account_circle"
              size={32}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Purchase Reports Button */}
        <TouchableOpacity
          style={styles.purchaseReportsButton}
          onPress={() => router.push('/(tabs)/landing')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.purchaseReportsGradient}
          >
            <View style={styles.purchaseReportsContent}>
              <View style={styles.purchaseReportsIcon}>
                <IconSymbol
                  ios_icon_name="cart.fill"
                  android_material_icon_name="shopping_cart"
                  size={28}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.purchaseReportsText}>
                <Text style={styles.purchaseReportsTitle}>Purchase Reports</Text>
                <Text style={styles.purchaseReportsSubtitle}>
                  Buy individual reports or bulk credits
                </Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={24}
                color="rgba(255, 255, 255, 0.8)"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: colors.cardBackground }]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                  <IconSymbol
                    ios_icon_name={action.icon}
                    android_material_icon_name={action.iconAndroid}
                    size={28}
                    color={action.color}
                  />
                </View>
                <Text style={[styles.quickActionTitle, { color: colors.text }]}>
                  {action.title}
                </Text>
                <Text style={[styles.quickActionSubtitle, { color: colors.textSecondary }]}>
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Inspections */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Inspections</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/(home)/inspection')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {recentInspections.map((inspection) => (
            <TouchableOpacity
              key={inspection.id}
              style={[styles.inspectionCard, { backgroundColor: colors.cardBackground }]}
            >
              <View style={styles.inspectionHeader}>
                <View style={styles.inspectionInfo}>
                  <Text style={[styles.inspectionAddress, { color: colors.text }]}>
                    {inspection.address}
                  </Text>
                  <Text style={[styles.inspectionTime, { color: colors.textSecondary }]}>
                    {formatTimeAgo(inspection.date)}
                  </Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(inspection.severity) + '15' }]}>
                  <Text style={[styles.severityText, { color: getSeverityColor(inspection.severity) }]}>
                    {inspection.severity.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.inspectionFooter}>
                <View style={styles.inspectionMeta}>
                  <IconSymbol
                    ios_icon_name="photo.fill"
                    android_material_icon_name="photo"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.inspectionMetaText, { color: colors.textSecondary }]}>
                    {inspection.imageCount} photos
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(inspection.status) + '15' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(inspection.status) }]}>
                    {inspection.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Job Queue */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Job Queue</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/operations')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {jobQueue.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={[styles.jobCard, { backgroundColor: colors.cardBackground }]}
            >
              <View style={styles.jobHeader}>
                <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(job.priority) }]} />
                <View style={styles.jobInfo}>
                  <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
                  <Text style={[styles.jobAddress, { color: colors.textSecondary }]}>
                    {job.address}
                  </Text>
                </View>
              </View>
              <View style={styles.jobFooter}>
                <View style={styles.jobMeta}>
                  <IconSymbol
                    ios_icon_name="clock.fill"
                    android_material_icon_name="schedule"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.jobMetaText, { color: colors.textSecondary }]}>
                    {formatUpcoming(job.scheduledDate)}
                  </Text>
                </View>
                {job.assignedTo && (
                  <View style={styles.jobMeta}>
                    <IconSymbol
                      ios_icon_name="person.fill"
                      android_material_icon_name="person"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text style={[styles.jobMetaText, { color: colors.textSecondary }]}>
                      {job.assignedTo}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowMedium,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: `0px 2px 8px ${colors.shadowMedium}`,
      },
    }),
  },
  purchaseReportsButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FF5722',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 16px rgba(255, 87, 34, 0.25)',
      },
    }),
  },
  purchaseReportsGradient: {
    padding: 20,
  },
  purchaseReportsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  purchaseReportsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseReportsText: {
    flex: 1,
  },
  purchaseReportsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  purchaseReportsSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: isTablet ? '23%' : '48%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowLight,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: `0px 2px 12px ${colors.shadowLight}`,
      },
    }),
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  inspectionCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowLight,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: `0px 2px 12px ${colors.shadowLight}`,
      },
    }),
  },
  inspectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  inspectionInfo: {
    flex: 1,
  },
  inspectionAddress: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  inspectionTime: {
    fontSize: 13,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  inspectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inspectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inspectionMetaText: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadowLight,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: `0px 2px 12px ${colors.shadowLight}`,
      },
    }),
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  priorityIndicator: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobAddress: {
    fontSize: 13,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  jobMetaText: {
    fontSize: 13,
  },
});
