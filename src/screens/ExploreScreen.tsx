import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  FlatList, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';
import { MOCK_RESTAURANTS } from '../data/mockData';
import RestaurantCard from '../components/RestaurantCard';
import FilterChip from '../components/FilterChip';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FILTERS = ['All', 'Open now', 'Nepali', 'Under Rs500', 'Veg'];

export default function ExploreScreen() {
  const nav = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const results = useMemo(() => {
    let list = MOCK_RESTAURANTS;
    if (activeFilter === 'Open now') list = list.filter(r => r.isOpen);
    if (activeFilter === 'Nepali') list = list.filter(r => r.tags.some(t => ['Newari', 'Thakali', 'Nepali'].includes(t)));
    if (activeFilter === 'Veg') list = list.filter(r => r.tags.includes('VEG'));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [query, activeFilter]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* Search input */}
      <View style={s.searchWrap}>
        <TextInput
          style={s.input}
          value={query}
          onChangeText={setQuery}
          placeholder="🔍  Search restaurants..."
          placeholderTextColor={Colors.hint}
          returnKeyType="search"
        />
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterRow}
      >
        {FILTERS.map(f => (
          <FilterChip
            key={f}
            label={f}
            selected={activeFilter === f}
            onPress={() => setActiveFilter(f)}
          />
        ))}
      </ScrollView>

      {/* Count */}
      <Text style={s.count}>{results.length} result{results.length !== 1 ? 's' : ''}</Text>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={r => r.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            variant="row"
            onPress={() => nav.navigate('RestaurantDetail', { restaurantId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>🍽️</Text>
            <Text style={s.emptyText}>No restaurants found</Text>
            <Text style={s.emptySub}>Try a different search or filter</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  searchWrap: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.sm },
  input: {
    backgroundColor: Colors.muted,
    borderRadius: Radius.card,
    borderWidth: 0.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.text,
    minHeight: 44,
  },
  filterRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.md },
  count: { fontSize: FontSize.sm, color: Colors.sub, paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  list: { paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text, marginTop: Spacing.md },
  emptySub: { fontSize: FontSize.sm, color: Colors.sub, marginTop: 4 },
});
