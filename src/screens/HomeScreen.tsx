import React, { useState } from 'react';
import {
  View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet,
} from 'react-native';
import { colors, spacing, radius } from '../constants/theme';
import { mockRestaurants, moods, cuisines } from '../data/mockData';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../navigation/Navigator';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Home'>,
    StackNavigationProp<RootStackParamList>
  >;
};

export default function HomeScreen({ navigation }: Props) {
  const [activeMood, setActiveMood] = useState(0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.location}>📍 Thamel, Kathmandu</Text>
          </View>
          <Text style={styles.bell}>🔔</Text>
        </View>

        <SearchBar onPress={() => navigation.navigate('Explore')} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's the mood?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodList}>
            {moods.map((m, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.moodChip, activeMood === i && styles.moodChipActive]}
                onPress={() => setActiveMood(i)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, activeMood === i && styles.moodLabelActive]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Trending near you</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={mockRestaurants.slice(0, 4)}
            horizontal
            keyExtractor={(r) => r.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.md }}
            renderItem={({ item }) => (
              <RestaurantCard
                restaurant={item}
                horizontal
                onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item.id })}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore cuisines</Text>
          <View style={styles.cuisineGrid}>
            {cuisines.map((c, i) => (
              <TouchableOpacity key={i} style={styles.cuisineItem} onPress={() => navigation.navigate('Explore')}>
                <Text style={styles.cuisineEmoji}>{c.emoji}</Text>
                <Text style={styles.cuisineLabel}>{c.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity style={styles.aiBtn} onPress={() => navigation.navigate('AI')}>
        <Text style={styles.aiBtnText}>✨</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: spacing.md, paddingTop: 52, paddingBottom: spacing.sm,
  },
  greeting: { fontSize: 13, color: colors.subtext },
  location: { fontSize: 18, fontWeight: '700', color: colors.text },
  bell: { fontSize: 24, marginTop: 2 },
  section: { marginBottom: spacing.md },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  seeAll: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  moodList: { paddingHorizontal: spacing.md, gap: spacing.sm },
  moodChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  moodChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  moodEmoji: { fontSize: 14, marginRight: 4 },
  moodLabel: { fontSize: 13, color: colors.text, fontWeight: '600' },
  moodLabelActive: { color: '#fff' },
  cuisineGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md },
  cuisineItem: { width: '25%', alignItems: 'center', marginBottom: spacing.md },
  cuisineEmoji: { fontSize: 28 },
  cuisineLabel: { fontSize: 12, color: colors.subtext, marginTop: 4 },
  aiBtn: {
    position: 'absolute', right: spacing.md, bottom: 90,
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', elevation: 4,
  },
  aiBtnText: { fontSize: 22 },
});
