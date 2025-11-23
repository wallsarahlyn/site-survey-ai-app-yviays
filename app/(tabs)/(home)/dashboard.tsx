
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { useThemeContext } from '@/contexts/ThemeContext';
import { QuickAction, RecentInspection, JobQueueItem, SalesPipelineStage } from '@/types/dashboard';

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
      color: colors.highlight,
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
      title: 'CRM',
      subtitle: 'Manage leads',
      icon: 'person.2.fill',
      iconAndroid: 'people',
      color: colors.info,
      route: '/(tabs)/crm',
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

  const pipelineStages: SalesPipelineStage[] = [
    { id: '1', name: 'Leads', count: 24, value: 180000, color: colors.info },
    { id: '2', name: 'Qualified', count: 12, value: 95000, color: colors.primary },
    { id: '3', name: 'Proposal', count: 8, value: 72000, color: colors.warning },
    { id: '4', name: 'Negotiation', count: 4, value: 48000, color: colors.success },
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
            style={[styles.profileButton, { backgroundColor: colors.card }]}
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: colors.card }]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
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

        {/* Sales Pipeline Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sales Pipeline</Text>
          <View style={[styles.pipelineCard, { backgroundColor: colors.card }]}>
            {pipelineStages.map((stage, index) => (
              <React.Fragment key={stage.id}>
                <View style={styles.pipelineStage}>
                  <View style={styles.pipelineStageHeader}>
                    <View style={[styles.pipelineDot, { backgroundColor: stage.color }]} />
                    <Text style={[styles.pipelineStageName, { color: colors.text }]}>
                      {stage.name}
                    </Text>
                  </View>
                  <Text style={[styles.pipelineCount, { color: colors.textSecondary }]}>
                    {stage.count} deals
                  </Text>
                  <Text style={[styles.pipelineValue, { color: colors.text }]}>
                    ${(stage.value / 1000).toFixed(0)}K
                  </Text>
                </View>
                {index < pipelineStages.length - 1 && (
                  <View style={[styles.pipelineDivider, { backgroundColor: colors.border }]} />
                )}
              </React.Fragment>
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
              style={[styles.inspectionCard, { backgroundColor: colors.card }]}
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
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(inspection.severity) + '20' }]}>
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
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(inspection.status) + '20' }]}>
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
              style={[styles.jobCard, { backgroundColor: colors.card }]}
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
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  profileButton: {
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
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
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
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  pipelineCard: {
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  pipelineStage: {
    paddingVertical: 12,
  },
  pipelineStageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pipelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  pipelineStageName: {
    fontSize: 16,
    fontWeight: '600',
  },
  pipelineCount: {
    fontSize: 14,
    marginBottom: 4,
  },
  pipelineValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  pipelineDivider: {
    height: 1,
    marginVertical: 8,
  },
  inspectionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
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
