import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';

import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Reserve'>;

const TIME_SLOTS = ['11:00', '12:00', '18:00', '19:00', '20:00'];
const PARTY_OPTIONS = ['1', '2', '3-4', '5-8', '8+'];

export default function ReserveScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { restaurantName } = route.params;

  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00');
  const [party, setParty] = useState('2');
  const [requests, setRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!date.trim()) {
      Alert.alert('Select date', 'Please enter a date for your reservation.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    Alert.alert(
      'Reservation sent! 🎉',
      `Your table request at ${restaurantName} for ${date} at ${time} (${party} guests) has been sent.`,
      [{ text: 'OK', onPress: () => nav.goBack() }]
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={s.backBtn}>
          <Text style={s.backText}>← Reserve a table</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Notice */}
        <View style={s.notice}>
          <Text style={s.noticeText}>✅  This restaurant accepts in-app reservations</Text>
        </View>

        {/* Date */}
        <Text style={s.label}>Select date</Text>
        <TextInput
          style={s.dateInput}
          value={date}
          onChangeText={setDate}
          placeholder="📅  YYYY-MM-DD (e.g. 2026-05-01)"
          placeholderTextColor={Colors.hint}
        />

        {/* Time */}
        <Text style={s.label}>Select time</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.optionRow}>
          {TIME_SLOTS.map(t => (
            <TouchableOpacity
              key={t}
              style={[s.optionChip, time === t && s.optionChipActive]}
              onPress={() => setTime(t)}
            >
              <Text style={[s.optionText, time === t && s.optionTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Party size */}
        <Text style={s.label}>Party size</Text>
        <View style={s.optionRow}>
          {PARTY_OPTIONS.map(p => (
            <TouchableOpacity
              key={p}
              style={[s.optionChip, party === p && s.optionChipActive]}
              onPress={() => setParty(p)}
            >
              <Text style={[s.optionText, party === p && s.optionTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Special requests */}
        <Text style={s.label}>Special requests</Text>
        <TextInput
          style={s.requestInput}
          value={requests}
          onChangeText={setRequests}
          placeholder="Birthday, window seat..."
          placeholderTextColor={Colors.hint}
          multiline
          textAlignVertical="top"
        />

        {/* Submit */}
        <TouchableOpacity style={s.submitBtn} onPress={handleSubmit} disabled={loading}>
          <Text style={s.submitText}>
            {loading ? 'Sending...' : 'Request reservation'}
          </Text>
        </TouchableOpacity>

        {/* Prefer to call */}
        <View style={s.callSection}>
          <Text style={s.callLabel}>Prefer to call?</Text>
          <View style={s.callRow}>
            <TouchableOpacity style={s.callBtn} onPress={() => Linking.openURL('tel:+9771234567')}>
              <Text>📞  Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.callBtn} onPress={() => Linking.openURL('https://wa.me/9779841000001')}>
              <Text>💬  WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.border, backgroundColor: Colors.white },
  backBtn: { minHeight: 44, justifyContent: 'center' },
  backText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  notice: { backgroundColor: '#E8F8F1', borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.lg },
  noticeText: { fontSize: FontSize.sm, color: Colors.primaryDark },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.text, marginBottom: Spacing.sm, marginTop: Spacing.lg },
  dateInput: {
    backgroundColor: Colors.white, borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: 14, fontSize: FontSize.md, color: Colors.text, textAlign: 'center', minHeight: 48,
  },
  optionRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  optionChip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: Radius.chip,
    borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white, minHeight: 44, justifyContent: 'center',
  },
  optionChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionText: { fontSize: FontSize.md, color: Colors.sub },
  optionTextActive: { color: Colors.white, fontWeight: FontWeight.semibold },
  requestInput: {
    backgroundColor: Colors.white, borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    fontSize: FontSize.md, color: Colors.text, height: 80,
  },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: Radius.input, paddingVertical: 16, alignItems: 'center', marginTop: Spacing.xl, minHeight: 52 },
  submitText: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  callSection: { alignItems: 'center', marginTop: Spacing.xl },
  callLabel: { fontSize: FontSize.sm, color: Colors.sub, marginBottom: Spacing.sm },
  callRow: { flexDirection: 'row', gap: Spacing.xl },
  callBtn: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, minHeight: 44, justifyContent: 'center' },
});
