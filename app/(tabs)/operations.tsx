
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Job } from '@/types/contractor';

export default function OperationsScreen() {
  const { colors } = useThemeContext();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'scheduled' | 'in-progress' | 'completed'>('all');

  // Mock data
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Roof Inspection & Assessment',
      address: '123 Main St, Austin, TX 78701',
      clientName: 'John Anderson',
      clientPhone: '(555) 123-4567',
      scheduledDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
      status: 'scheduled',
      priority: 'high',
      assignedTo: 'Mike Johnson',
      estimatedDuration: 120,
      checklist: [
        { id: '1', title: 'Safety equipment check', completed: false, required: true },
        { id: '2', title: 'Roof access inspection', completed: false, required: true },
        { id: '3', title: 'Photo documentation', completed: false, required: true },
      ],
      photos: [],
      notes: 'Storm damage reported. Check for hail damage and missing shingles.',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Solar Panel Installation',
      address: '456 Oak Ave, Dallas, TX 75201',
      clientName: 'Sarah Martinez',
      clientPhone: '(555) 234-5678',
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'in-progress',
      priority: 'medium',
      assignedTo: 'David Lee',
      estimatedDuration: 480,
      actualDuration: 240,
      checklist: [
        { id: '1', title: 'Site preparation', completed: true, required: true, completedAt: new Date() },
        { id: '2', title: 'Panel mounting', completed: true, required: true, completedAt: new Date() },
        { id: '3', title: 'Electrical connections', completed: false, required: true },
        { id: '4', title: 'System testing', completed: false, required: true },
      ],
      photos: [],
      notes: '8kW system installation. Customer wants monitoring app setup.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];

  const filteredJobs = selectedFilter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return colors.info;
      case 'in-progress': return colors.accent;
      case 'completed': return colors.success;
      case 'cancelled': return colors.error;
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getChecklistProgress = (checklist: any[]) => {
    const completed = checklist.filter(item => item.completed).length;
    return `${completed}/${checklist.length}`;
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
          <Text style={[styles.title, { color: colors.text }]}>Operations</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.accent }]}>
            <IconSymbol
              ios_icon_name="plus"
              android_material_icon_name="add"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {(['all', 'scheduled', 'in-progress', 'completed'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                { backgroundColor: selectedFilter === filter ? colors.accent : colors.card }
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                { color: selectedFilter === filter ? '#FFFFFF' : colors.text }
              ]}>
                {filter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Jobs List */}
        <View style={styles.content}>
          {filteredJobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={[styles.jobCard, { backgroundColor: colors.card }]}
            >
              {/* Priority Indicator */}
              <View style={[styles.priorityBar, { backgroundColor: getPriorityColor(job.priority) }]} />

              {/* Job Header */}
              <View style={styles.jobHeader}>
                <View style={styles.jobInfo}>
                  <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
                  <Text style={[styles.jobAddress, { color: colors.textSecondary }]}>
                    {job.address}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
                    {job.status.replace('-', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Client Info */}
              <View style={styles.clientInfo}>
                <View style={styles.clientRow}>
                  <IconSymbol
                    ios_icon_name="person.fill"
                    android_material_icon_name="person"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.clientText, { color: colors.textSecondary }]}>
                    {job.clientName}
                  </Text>
                </View>
                <View style={styles.clientRow}>
                  <IconSymbol
                    ios_icon_name="phone.fill"
                    android_material_icon_name="phone"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text style={[styles.clientText, { color: colors.textSecondary }]}>
                    {job.clientPhone}
                  </Text>
                </View>
              </View>

              {/* Schedule Info */}
              <View style={[styles.scheduleInfo, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.scheduleRow}>
                  <IconSymbol
                    ios_icon_name="calendar"
                    android_material_icon_name="event"
                    size={18}
                    color={colors.accent}
                  />
                  <Text style={[styles.scheduleText, { color: colors.text }]}>
                    {formatDate(job.scheduledDate)} at {formatTime(job.scheduledDate)}
                  </Text>
                </View>
                <View style={styles.scheduleRow}>
                  <IconSymbol
                    ios_icon_name="clock.fill"
                    android_material_icon_name="schedule"
                    size={18}
                    color={colors.accent}
                  />
                  <Text style={[styles.scheduleText, { color: colors.text }]}>
                    {job.estimatedDuration} min
                    {job.actualDuration && ` (${job.actualDuration} min elapsed)`}
                  </Text>
                </View>
              </View>

              {/* Checklist Progress */}
              <View style={styles.checklistProgress}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                    Checklist Progress
                  </Text>
                  <Text style={[styles.progressCount, { color: colors.accent }]}>
                    {getChecklistProgress(job.checklist)}
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: colors.accent,
                        width: `${(job.checklist.filter(i => i.completed).length / job.checklist.length) * 100}%`
                      }
                    ]}
                  />
                </View>
              </View>

              {/* Assigned To */}
              <View style={styles.assignedInfo}>
                <IconSymbol
                  ios_icon_name="person.circle.fill"
                  android_material_icon_name="account_circle"
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.assignedText, { color: colors.textSecondary }]}>
                  Assigned to {job.assignedTo}
                </Text>
              </View>

              {/* Notes */}
              {job.notes && (
                <View style={[styles.notes, { backgroundColor: colors.backgroundSecondary }]}>
                  <Text style={[styles.notesText, { color: colors.textSecondary }]}>
                    {job.notes}
                  </Text>
                </View>
              )}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 16px rgba(6, 182, 212, 0.3)',
    elevation: 4,
  },
  filterContainer: {
    marginBottom: 24,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
  },
  jobCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.06)',
    elevation: 4,
    position: 'relative',
  },
  priorityBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginLeft: 8,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  jobAddress: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  clientInfo: {
    gap: 8,
    marginBottom: 12,
    marginLeft: 8,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clientText: {
    fontSize: 14,
  },
  scheduleInfo: {
    padding: 14,
    borderRadius: 14,
    gap: 8,
    marginBottom: 12,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  checklistProgress: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
  },
  progressCount: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  assignedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  assignedText: {
    fontSize: 14,
  },
  notes: {
    padding: 14,
    borderRadius: 12,
  },
  notesText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
