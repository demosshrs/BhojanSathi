import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  FlatList, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Spacing, Radius, FontSize, FontWeight, SCREEN_WIDTH } from '../constants/theme';
import { MOCK_RESTAURANTS, MOCK_MOODS, MOCK_CUISINES } from '../data/mockData';
import RestaurantCard from '../components/RestaurantCard';
import MoodChip from '../components/MoodChip';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const filtered = activeMood
    ? MOCK_RESTAURANTS.filter(r => r.tags.some(t => t.toLowerCase().includes(activeMood)))
    : MOCK_RESTAURANTS;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Good evening</Text>
            <Text style={s.location}>📍 Thamel, Kathmandu ▾</Text>
          </View>
          <TouchableOpacity style={s.bellBtn}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
            <View style={s.bellDot} />
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <TouchableOpacity
          style={s.searchBar}
          onPress={() => nav.navigate('MainTabs')}
          activeOpacity={0.7}
        >
          <Text style={s.searchPlaceholder}>🔍  Search restaurants...</Text>
        </TouchableOpacity>

        {/* Mood chips */}
        <Text style={s.sectionTitle}>What's the mood?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.moodRow}
        >
          {MOCK_MOODS.map(mood => (
            <MoodChip
              key={mood.id}
              mood={mood}
              selected={activeMood === mood.id}
              onPress={() => setActiveMood(activeMood === mood.id ? null : mood.id)}
            />
          ))}
        </ScrollView>

        {/* Trending */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Trending near you</Text>
          <TouchableOpacity>
            <Text style={s.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={filtered.slice(0, 4)}
          keyExtractor={r => r.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.cardList}
          ItemSeparatorComponent={() => <View style={{ width: Spacing.md }} />}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => nav.navigate('RestaurantDetail', { restaurantId: item.id })}
            />
          )}
        />

        {/* Explore cuisines */}
        <Text style={[s.sectionTitle, { marginTop: Spacing.xxl }]}>Explore cuisines</Text>
        <View style={s.cuisineGrid}>
          {MOCK_CUISINES.map(c => (
            <TouchableOpacity key={c.label} style={s.cuisineItem} activeOpacity={0.75}>
              <Text style={s.cuisineEmoji}>{c.emoji}</Text>
              <Text style={s.cuisineLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* New in town */}
        <Text style={[s.sectionTitle, { marginTop: Spacing.xxl }]}>New in town ✨</Text>
        {MOCK_RESTAURANTS.slice(3).map(r => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            variant="row"
            onPress={() => nav.navigate('RestaurantDetail', { restaurantId: r.id })}
          />
        ))}

      </ScrollView>

      {/* Floating AI button */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => nav.navigate('MainTabs')}
        activeOpacity={0.85}
      >
        <Text style={{ fontSize: 22 }}>✨</Text>
        <Text style={s.fabLabel}>AI</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  greeting: { fontSize: FontSize.sm, color: Colors.hint },
  location: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text, marginTop: 2 },
  bellBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.muted, alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.red },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: Spacing.lg, marginBottom: Spacing.xl,
    padding: Spacing.md, borderRadius: Radius.card,
    backgroundColor: Colors.muted, borderWidth: 0.5, borderColor: Colors.border,
    minHeight: 44,
  },
  searchPlaceholder: { fontSize: FontSize.md, color: Colors.hint },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: Spacing.lg },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  moodRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.xxl },
  cardList: { paddingHorizontal: Spacing.lg },
  cuisineGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: Spacing.lg, gap: Spacing.sm },
  cuisineItem: {
    width: (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.sm * 3) / 4,
    alignItems: 'center', paddingVertical: Spacing.md,
    borderRadius: Radius.card, backgroundColor: Colors.muted,
  },
  cuisineEmoji: { fontSize: 24 },
  cuisineLabel: { fontSize: 11, fontWeight: FontWeight.medium, color: Colors.sub, marginTop: 4 },
  fab: {
    position: 'absolute', bottom: 28, right: Spacing.xl,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 8, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
  },
  fabLabel: { fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white, marginTop: -2 },
});
