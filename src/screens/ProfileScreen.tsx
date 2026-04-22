import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';
import { useAuth } from '../hooks/useAuth';

interface MenuRowProps {
  emoji: string;
  label: string;
  onPress?: () => void;
}

function MenuRow({ emoji, label, onPress }: MenuRowProps) {
  return (
    <TouchableOpacity style={s.menuRow} onPress={onPress} activeOpacity={0.7}>
      <View style={s.menuRowLeft}>
        <Text style={s.menuRowEmoji}>{emoji}</Text>
        <Text style={s.menuRowLabel}>{label}</Text>
      </View>
      <Text style={s.menuRowArrow}>→</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { appUser, logout } = useAuth();

  const initials = appUser?.name
    ? appUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll}>

        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <Text style={s.userName}>{appUser?.name ?? 'Guest'}</Text>
          <Text style={s.userPhone}>{appUser?.phone ?? appUser?.email ?? ''}</Text>
        </View>

        {/* Menu items */}
        <View style={s.menuSection}>
          <MenuRow emoji="🎯" label="Edit taste profile" onPress={() => Alert.alert('Coming soon')} />
          <MenuRow emoji="📅" label="My reservations" onPress={() => Alert.alert('Coming soon')} />
          <MenuRow emoji="❤️" label="Saved restaurants" onPress={() => Alert.alert('Coming soon')} />
          <MenuRow emoji="🔔" label="Notifications" onPress={() => Alert.alert('Coming soon')} />
          <MenuRow emoji="⚙️" label="Settings" onPress={() => Alert.alert('Coming soon')} />
          <MenuRow emoji="💬" label="Help & support" onPress={() => Alert.alert('Coming soon')} />
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutText}>Log out</Text>
        </TouchableOpacity>

        <Text style={s.version}>BhojanSathi v1.0.0 · Made with ❤️ in Nepal</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingBottom: Spacing.xxxl },
  avatarSection: { alignItems: 'center', paddingTop: Spacing.xxl, paddingBottom: Spacing.lg },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary,
  },
  avatarText: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.primary },
  userName: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.text, marginTop: Spacing.sm },
  userPhone: { fontSize: FontSize.sm, color: Colors.sub, marginTop: 4 },
  menuSection: { backgroundColor: Colors.white, borderRadius: Radius.card, marginHorizontal: Spacing.lg, marginTop: Spacing.md, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.border },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg, borderBottomWidth: 0.5, borderBottomColor: Colors.border, minHeight: 56 },
  menuRowLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  menuRowEmoji: { fontSize: 20 },
  menuRowLabel: { fontSize: FontSize.md, color: Colors.text },
  menuRowArrow: { fontSize: FontSize.md, color: Colors.hint },
  logoutBtn: { marginHorizontal: Spacing.lg, marginTop: Spacing.xl, paddingVertical: Spacing.md, alignItems: 'center', minHeight: 48 },
  logoutText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.hint, marginTop: Spacing.xl },
});
