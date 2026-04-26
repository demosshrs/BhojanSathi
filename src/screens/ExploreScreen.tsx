import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius } from '../constants/theme';
import { mockRestaurants } from '../data/mockData';
import { Restaurant } from '../types';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../navigation/Navigator';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Explore'>,
    StackNavigationProp<RootStackParamList>
  >;
};

const FILTERS = ['All', 'Open now', 'Nepali', 'Under Rs500', 'Veg'];

function applyFilter(restaurants: Restaurant[], filter: string, query: string): Restaurant[] {
  let list = restaurants;
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q));
  }
  if (filter === 'Open now') return list.filter(r => r.openNow);
  if (filter === 'Nepali') return list.filter(r => ['Newari', 'Thakali', 'Nepali'].includes(r.cuisine));
  if (filter === 'Under Rs500') return list.filter(r => r.price.length <= 2);
  if (filter === 'Veg') return list.filter(r =>
    r.menu.some(cat => cat.items.some(i => i.tags.includes('VEG')))
  );
  return list;
}

export default function ExploreScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const results = applyFilter(mockRestaurants, activeFilter, query);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <SearchBar editable value={query} onChangeText={setQuery} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, activeFilter === f && styles.chipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.chipText, activeFilter === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.count}>{results.length} results</Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={r => r.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={item}
            onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No restaurants found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  top: { backgroundColor: colors.background, paddingTop: 52 },
  chips: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.sm },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.full,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  count: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, color: colors.subtext, fontSize: 13 },
  list: { paddingTop: spacing.sm },
  empty: { textAlign: 'center', color: colors.subtext, marginTop: 40 },
});
