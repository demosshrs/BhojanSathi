import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { ref, onValue, update } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { colors, spacing, radius } from '../constants/theme';
import { Reservation } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/Navigator';
import { signOut } from 'firebase/auth';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'OwnerPanel'> };

export default function OwnerPanelScreen({ navigation }: Props) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(db, 'reservations'), snap => {
      const data: Reservation[] = [];
      snap.forEach(child => {
        data.push({ id: child.key ?? undefined, ...child.val() } as Reservation);
      });
      setReservations(data.reverse());
      setLoading(false);
    });
    return unsub;
  }, []);

  function updateStatus(id: string, status: 'confirmed' | 'declined') {
    update(ref(db, `reservations/${id}`), { status });
  }

  const total = reservations.length;
  const pending = reservations.filter(r => r.status === 'pending').length;
  const confirmed = reservations.filter(r => r.status === 'confirmed').length;
  const menuItems = 15;

  const stats = [
    { label: 'Total', value: total },
    { label: 'Pending', value: pending },
    { label: 'Confirmed', value: confirmed },
    { label: 'Menu Items', value: menuItems },
  ];

  async function handleLogout() {
    await signOut(auth);
    navigation.replace('Login');
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Owner Panel</Text>
        <TouchableOpacity onPress={handleLogout}><Text style={styles.logout}>Log out</Text></TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          <View style={styles.statsGrid}>
            {stats.map(s => (
              <View key={s.label} style={styles.statCard}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Recent Reservations</Text>
          {reservations.length === 0 && <Text style={styles.empty}>No reservations yet.</Text>}
          {reservations.map(r => (
            <View key={r.id} style={styles.resCard}>
              <View style={styles.resHeader}>
                <Text style={styles.resName}>{r.restaurantName}</Text>
                <View style={[styles.badge, r.status === 'confirmed' ? styles.confirmed : r.status === 'declined' ? styles.declined : styles.pendingBadge]}>
                  <Text style={styles.badgeText}>{r.status}</Text>
                </View>
              </View>
              <Text style={styles.resMeta}>{r.date} at {r.time} · {r.partySize} guests</Text>
              {r.requests ? <Text style={styles.resReq}>"{r.requests}"</Text> : null}
              {r.status === 'pending' && r.id && (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.acceptBtn} onPress={() => updateStatus(r.id!, 'confirmed')}>
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineBtn} onPress={() => updateStatus(r.id!, 'declined')}>
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingTop: 52, paddingBottom: spacing.sm },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  logout: { color: colors.red, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.sm },
  statCard: { width: '48%', margin: '1%', backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statValue: { fontSize: 28, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 13, color: colors.subtext, marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginHorizontal: spacing.md, marginBottom: spacing.sm, marginTop: spacing.sm },
  empty: { textAlign: 'center', color: colors.subtext, marginTop: spacing.lg },
  resCard: { backgroundColor: colors.card, marginHorizontal: spacing.md, marginBottom: spacing.sm, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  resHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  resName: { fontWeight: '700', color: colors.text },
  resMeta: { color: colors.subtext, fontSize: 13 },
  resReq: { color: colors.subtext, fontSize: 12, fontStyle: 'italic', marginTop: spacing.xs },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
  confirmed: { backgroundColor: colors.tagBg },
  declined: { backgroundColor: '#fde8e8' },
  pendingBadge: { backgroundColor: '#fff3cd' },
  badgeText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize', color: colors.text },
  actionRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  acceptBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: 8, alignItems: 'center' },
  acceptText: { color: '#fff', fontWeight: '700' },
  declineBtn: { flex: 1, backgroundColor: '#fde8e8', borderRadius: radius.full, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.red },
  declineText: { color: colors.red, fontWeight: '700' },
});
