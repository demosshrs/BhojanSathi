import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';
import { MOCK_OWNER_STATS, MOCK_BOOKINGS } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import type { ReservationStatus } from '../types';

const STATUS_CONFIG: Record<ReservationStatus, { label: string; bg: string; color: string }> = {
  pending: { label: 'Pending', bg: '#FEF9C3', color: '#92400E' },
  confirmed: { label: 'Confirmed', bg: '#D1FAE5', color: '#065F46' },
  cancelled: { label: 'Cancelled', bg: '#FEE2E2', color: '#991B1B' },
};

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <View style={s.statCard}>
      <Text style={s.statValue}>{value.toLocaleString()}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.quickAction} onPress={onPress} activeOpacity={0.7}>
      <Text style={s.quickActionLabel}>{label}</Text>
      <Text style={s.quickActionArrow}>→</Text>
    </TouchableOpacity>
  );
}

export default function OwnerPanelScreen() {
  const { appUser, logout } = useAuth();
  const stats = MOCK_OWNER_STATS;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.ownerRole}>Restaurant owner</Text>
            <Text style={s.restaurantName}>{appUser?.name ?? 'Your Restaurant'}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={s.logoutBtn}>
            <Text style={s.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>

        {/* Stats grid */}
        <View style={s.statsGrid}>
          <StatCard value={stats.views} label="Views" />
          <StatCard value={stats.reservations} label="Reservations" />
          <StatCard value={stats.pending} label="Pending" />
          <StatCard value={stats.menuItems} label="Menu items" />
        </View>

        {/* Quick actions */}
        <Text style={s.sectionTitle}>QUICK ACTIONS</Text>
        <View style={s.section}>
          <QuickAction label="Edit restaurant profile" onPress={() => Alert.alert('Coming soon')} />
          <QuickAction label="Manage menu" onPress={() => Alert.alert('Coming soon')} />
          <QuickAction label="Reservation settings" onPress={() => Alert.alert('Coming soon')} />
          <QuickAction label="View bookings" onPress={() => Alert.alert('Coming soon')} />
        </View>

        {/* Recent bookings */}
        <Text style={s.sectionTitle}>RECENT BOOKINGS</Text>
        <View style={s.section}>
          {MOCK_BOOKINGS.map(b => (
            <View key={b.id} style={s.bookingRow}>
              <View style={s.bookingInfo}>
                <Text style={s.bookingGuest}>{b.guestName}</Text>
                <Text style={s.bookingMeta}>{b.date} · {b.time} · {b.partySize} guests</Text>
              </View>
              <View style={[s.statusBadge, { backgroundColor: STATUS_CONFIG[b.status].bg }]}>
                <Text style={[s.statusText, { color: STATUS_CONFIG[b.status].color }]}>
                  {STATUS_CONFIG[b.status].label}
                </Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.lg },
  ownerRole: { fontSize: FontSize.sm, color: Colors.sub },
  restaurantName: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.text, marginTop: 2 },
  logoutBtn: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm, minHeight: 44, justifyContent: 'center' },
  logoutText: { fontSize: FontSize.sm, color: Colors.red },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.lg, gap: Spacing.md, marginBottom: Spacing.xl },
  statCard: { flex: 1, minWidth: '40%', backgroundColor: Colors.white, borderRadius: Radius.card, padding: Spacing.lg, borderWidth: 0.5, borderColor: Colors.border },
  statValue: { fontSize: FontSize.xxxl, fontWeight: FontWeight.bold, color: Colors.text },
  statLabel: { fontSize: FontSize.sm, color: Colors.sub, marginTop: 4 },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.sub, letterSpacing: 0.8, paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  section: { backgroundColor: Colors.white, marginHorizontal: Spacing.lg, borderRadius: Radius.card, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.border, marginBottom: Spacing.xl },
  quickAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, borderBottomWidth: 0.5, borderBottomColor: Colors.border, minHeight: 56 },
  quickActionLabel: { fontSize: FontSize.md, color: Colors.text },
  quickActionArrow: { fontSize: FontSize.md, color: Colors.hint },
  bookingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  bookingInfo: { flex: 1 },
  bookingGuest: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.text },
  bookingMeta: { fontSize: FontSize.sm, color: Colors.sub, marginTop: 2 },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
});
