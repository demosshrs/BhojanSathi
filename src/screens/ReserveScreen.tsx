import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { ref, push } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { colors, spacing, radius } from '../constants/theme';

interface Props {
  restaurantId: string;
  restaurantName: string;
}

const TIMES = ['11:00', '12:00', '18:00', '19:00', '20:00'];
const SIZES = ['1', '2', '3-4', '5-8', '8+'];

export default function ReserveScreen({ restaurantId, restaurantName }: Props) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [size, setSize] = useState('2');
  const [requests, setRequests] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReserve() {
    if (!date) { Alert.alert('Select a date'); return; }
    const userId = auth.currentUser?.uid;
    if (!userId) { Alert.alert('Please log in first.'); return; }
    setLoading(true);
    try {
      await push(ref(db, 'reservations'), {
        userId,
        restaurantId,
        restaurantName,
        date,
        time,
        partySize: size,
        status: 'pending',
        requests,
        createdAt: Date.now(),
      });
      Alert.alert('Success', 'Your reservation request has been sent!');
      setDate(''); setRequests('');
    } catch {
      Alert.alert('Error', 'Could not submit reservation. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.banner}>
        <Text style={styles.bannerText}>✅  This restaurant accepts in-app reservations</Text>
      </View>

      <Text style={styles.label}>Select date</Text>
      <TextInput
        style={styles.dateInput}
        placeholder="📅  Choose a date (YYYY-MM-DD)"
        placeholderTextColor={colors.subtext}
        value={date}
        onChangeText={setDate}
      />

      <Text style={styles.label}>Select time</Text>
      <View style={styles.chipRow}>
        {TIMES.map(t => (
          <TouchableOpacity key={t} style={[styles.chip, time === t && styles.chipActive]} onPress={() => setTime(t)}>
            <Text style={[styles.chipText, time === t && styles.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Party size</Text>
      <View style={styles.chipRow}>
        {SIZES.map(s => (
          <TouchableOpacity key={s} style={[styles.chip, size === s && styles.chipActive]} onPress={() => setSize(s)}>
            <Text style={[styles.chipText, size === s && styles.chipTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Special requests</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Birthday, window seat..."
        placeholderTextColor={colors.subtext}
        value={requests}
        onChangeText={setRequests}
        multiline
        numberOfLines={3}
      />

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.md }} />
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleReserve}>
          <Text style={styles.btnText}>Request reservation</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.preferCall}>Prefer to call?</Text>
      <View style={styles.callRow}>
        <TouchableOpacity style={styles.callBtn}><Text>📞 Call</Text></TouchableOpacity>
        <TouchableOpacity style={styles.callBtn}><Text>💬 WhatsApp</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  banner: { backgroundColor: '#E1F5EE', padding: spacing.sm, borderRadius: radius.sm, marginBottom: spacing.md },
  bannerText: { color: colors.tagText, fontSize: 13, fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm, marginTop: spacing.sm },
  dateInput: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    padding: spacing.sm, color: colors.text, marginBottom: spacing.sm,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  textArea: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    padding: spacing.sm, color: colors.text, minHeight: 72, textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingVertical: 14, alignItems: 'center', marginTop: spacing.md,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  preferCall: { textAlign: 'center', color: colors.subtext, marginTop: spacing.md },
  callRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg, marginTop: spacing.sm },
  callBtn: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card,
  },
});
