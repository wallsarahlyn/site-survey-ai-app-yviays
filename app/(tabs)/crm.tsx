
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Lead } from '@/types/dashboard';

export default function CRMScreen() {
  const { colors } = useThemeContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'leads' | 'opportunities' | 'contacts'>('leads');

  // Mock data
  const leads: Lead[] = [
    {
      id: '1',
      name: 'John Anderson',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Austin, TX',
      status: 'qualified',
      source: 'Website',
      value: 25000,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      notes: 'Interested in solar installation',
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      email: 'sarah@example.com',
      phone: '(555) 234-5678',
      address: '456 Oak Ave, Dallas, TX',
      status: 'proposal',
      source: 'Referral',
      value: 35000,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      notes: 'Roof replacement needed',
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '(555) 345-6789',
      address: '789 Pine Rd, Houston, TX',
      status: 'new',
      source: 'Cold Call',
      value: 18000,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      notes: 'Storm damage assessment',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return colors.info;
      case 'contacted': return colors.accent;
      case 'qualified': return colors.success;
      case 'proposal': return colors.warning;
      case 'negotiation': return colors.primary;
      case 'closed-won': return colors.success;
      case 'closed-lost': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const formatDate = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
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
          <Text style={[styles.title, { color: colors.text }]}>CRM</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.accent }]}>
            <IconSymbol
              ios_icon_name="plus"
              android_material_icon_name="add"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={20}
              color={colors.textSecondary}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search leads, contacts..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'leads' && { borderBottomColor: colors.accent, borderBottomWidth: 3 }
            ]}
            onPress={() => setSelectedTab('leads')}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'leads' ? colors.accent : colors.textSecondary }
            ]}>
              Leads
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'opportunities' && { borderBottomColor: colors.accent, borderBottomWidth: 3 }
            ]}
            onPress={() => setSelectedTab('opportunities')}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'opportunities' ? colors.accent : colors.textSecondary }
            ]}>
              Opportunities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'contacts' && { borderBottomColor: colors.accent, borderBottomWidth: 3 }
            ]}
            onPress={() => setSelectedTab('contacts')}
          >
            <Text style={[
              styles.tabText,
              { color: selectedTab === 'contacts' ? colors.accent : colors.textSecondary }
            ]}>
              Contacts
            </Text>
          </TouchableOpacity>
        </View>

        {/* Leads List */}
        {selectedTab === 'leads' && (
          <View style={styles.content}>
            {leads.map((lead) => (
              <TouchableOpacity
                key={lead.id}
                style={[styles.leadCard, { backgroundColor: colors.card }]}
              >
                <View style={styles.leadHeader}>
                  <View style={styles.leadInfo}>
                    <Text style={[styles.leadName, { color: colors.text }]}>{lead.name}</Text>
                    <Text style={[styles.leadAddress, { color: colors.textSecondary }]}>
                      {lead.address}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(lead.status) }]}>
                      {lead.status.replace('-', ' ').toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.leadDetails}>
                  <View style={styles.leadDetailRow}>
                    <IconSymbol
                      ios_icon_name="envelope.fill"
                      android_material_icon_name="email"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text style={[styles.leadDetailText, { color: colors.textSecondary }]}>
                      {lead.email}
                    </Text>
                  </View>
                  <View style={styles.leadDetailRow}>
                    <IconSymbol
                      ios_icon_name="phone.fill"
                      android_material_icon_name="phone"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text style={[styles.leadDetailText, { color: colors.textSecondary }]}>
                      {lead.phone}
                    </Text>
                  </View>
                </View>

                <View style={styles.leadFooter}>
                  <View style={styles.leadMeta}>
                    <Text style={[styles.leadValue, { color: colors.success }]}>
                      ${(lead.value / 1000).toFixed(0)}K
                    </Text>
                    <Text style={[styles.leadSource, { color: colors.textSecondary }]}>
                      • {lead.source}
                    </Text>
                  </View>
                  <Text style={[styles.leadDate, { color: colors.textSecondary }]}>
                    {formatDate(lead.createdAt)}
                  </Text>
                </View>

                {lead.notes && (
                  <View style={[styles.leadNotes, { backgroundColor: colors.backgroundSecondary }]}>
                    <Text style={[styles.leadNotesText, { color: colors.textSecondary }]}>
                      {lead.notes}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Opportunities Placeholder */}
        {selectedTab === 'opportunities' && (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="chart.bar.fill"
              android_material_icon_name="trending_up"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No opportunities yet
            </Text>
          </View>
        )}

        {/* Contacts Placeholder */}
        {selectedTab === 'contacts' && (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="person.2.fill"
              android_material_icon_name="contacts"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              No contacts yet
            </Text>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(0, 217, 255, 0.3)',
    elevation: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 24,
  },
  tab: {
    paddingBottom: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 20,
  },
  leadCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  leadAddress: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  leadDetails: {
    gap: 8,
    marginBottom: 12,
  },
  leadDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leadDetailText: {
    fontSize: 14,
  },
  leadFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leadMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leadValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  leadSource: {
    fontSize: 13,
  },
  leadDate: {
    fontSize: 13,
  },
  leadNotes: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  leadNotesText: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
  },
});
