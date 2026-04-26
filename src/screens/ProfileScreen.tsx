import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Alert,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { colors, spacing, radius } from '../constants/theme';
import { Reservation } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList, RootStackParamList } from '../navigation/Navigator';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Profile'>,
    StackNavigationProp<RootStackParamList>
  >;
};

const MENU_ITEMS = ['Edit taste profile', 'My reservations', 'Saved restaurants', 'Notifications', 'Settings', 'Help & support'];

export default function ProfileScreen({ navigation }: Props) {
  const user = auth.currentUser;
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRes, setShowRes] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(ref(db, 'reservations'), orderByChild('userId'), equalTo(user.uid));
    const unsub = onValue(q, snap => {
      const data: Reservation[] = [];
      snap.forEach(child => {
        data.push({ id: child.key ?? undefined, ...child.val() } as Reservation);
      });
      setReservations(data.reverse());
      setLoading(false);
    });
    return unsub;
  }, [user]);

  async function handleLogout() {
    await signOut(auth);
    navigation.replace('Login');
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarBox}>
        <View style={styles.avatar}><Text style={styles.initials}>{initials}</Text></View>
        <Text style={styles.name}>{user?.displayName ?? 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.menuList}>
        {MENU_ITEMS.map(item => (
          <TouchableOpacity key={item} style={styles.menuRow} onPress={() => item === 'My reservations' && setShowRes(!showRes)}>
            <Text style={styles.menuText}>{item}</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showRes && (
        <View style={styles.resSection}>
          <Text style={styles.resTitle}>My Reservations</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : reservations.length === 0 ? (
            <Text style={styles.empty}>No reservations yet.</Text>
          ) : (
            reservations.map(r => (
              <View key={r.id} style={styles.resCard}>
                <Text style={styles.resName}>{r.restaurantName}</Text>
                <Text style={styles.resMeta}>{r.date} at {r.time} · Party of {r.partySize}</Text>
                <View style={[styles.badge, r.status === 'confirmed' ? styles.confirmed : r.status === 'declined' ? styles.declined : styles.pending]}>
                  <Text style={styles.badgeText}>{r.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  avatarBox: { alignItems: 'center', paddingTop: 60, paddingBottom: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.tagBg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  initials: { fontSize: 26, fontWeight: '700', color: colors.primary },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  email: { fontSize: 14, color: colors.subtext },
  menuList: { backgroundColor: colors.card, marginHorizontal: spacing.md, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuText: { fontSize: 15, color: colors.text },
  arrow: { color: colors.subtext, fontSize: 18 },
  resSection: { margin: spacing.md },
  resTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  resCard: { backgroundColor: colors.card, borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  resName: { fontWeight: '700', color: colors.text },
  resMeta: { color: colors.subtext, fontSize: 13, marginBottom: spacing.xs },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full },
  confirmed: { backgroundColor: colors.tagBg },
  declined: { backgroundColor: '#fde8e8' },
  pending: { backgroundColor: '#fff3cd' },
  badgeText: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize', color: colors.text },
  empty: { color: colors.subtext, textAlign: 'center', marginTop: spacing.md },
  logoutBtn: { margin: spacing.lg, alignItems: 'center' },
  logoutText: { fontWeight: '700', color: colors.text, fontSize: 15 },
});
