import React, { useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  StyleSheet, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';

import { Colors, Spacing, Radius, FontSize, FontWeight, SCREEN_WIDTH } from '../constants/theme';
import { MOCK_RESTAURANTS, MOCK_MENU } from '../data/mockData';
import MenuItemRow from '../components/MenuItemRow';
import type { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'RestaurantDetail'>;

type Tab = 'Menu' | 'Reserve' | 'Reviews';

export default function RestaurantDetailScreen() {
  const nav = useNavigation<Nav>();
  const route = useRoute<Route>();
  const [tab, setTab] = useState<Tab>('Menu');

  const restaurant = MOCK_RESTAURANTS.find(r => r.id === route.params.restaurantId)
    ?? MOCK_RESTAURANTS[0];

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero image */}
        <View style={s.heroWrap}>
          <Image source={{ uri: restaurant.images[0] }} style={s.hero} resizeMode="cover" />
          <TouchableOpacity style={s.backBtn} onPress={() => nav.goBack()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={s.infoSection}>
          <Text style={s.name}>{restaurant.name}</Text>
          <View style={s.tagsRow}>
            {restaurant.tags.map(t => (
              <View key={t} style={s.infoTag}>
                <Text style={s.infoTagText}>{t}</Text>
              </View>
            ))}
          </View>
          <View style={s.metaRow}>
            <Text style={s.ratingText}>⭐ {restaurant.rating} ({restaurant.ratingCount})</Text>
            <Text style={s.metaText}>{restaurant.price}</Text>
            <Text style={s.metaText}>{restaurant.distance}</Text>
          </View>
          <Text style={s.description}>{restaurant.description}</Text>

          {/* Action buttons */}
          <View style={s.actionRow}>
            <TouchableOpacity style={s.actionBtn} onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}>
              <Text style={s.actionEmoji}>📞</Text>
              <Text style={s.actionLabel}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.actionBtn} onPress={() => Linking.openURL(`https://maps.google.com/?q=${restaurant.location.lat},${restaurant.location.lng}`)}>
              <Text style={s.actionEmoji}>📍</Text>
              <Text style={s.actionLabel}>Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab bar */}
        <View style={s.tabBar}>
          {(['Menu', 'Reserve', 'Reviews'] as Tab[]).map(t => (
            <TouchableOpacity key={t} style={s.tabBtn} onPress={() => setTab(t)}>
              <Text style={[s.tabLabel, tab === t && s.tabLabelActive]}>{t}</Text>
              {tab === t && <View style={s.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        {tab === 'Menu' && <MenuTab />}
        {tab === 'Reserve' && <ReserveTab restaurantId={restaurant.id} restaurantName={restaurant.name} nav={nav} accepts={restaurant.acceptsReservations} />}
        {tab === 'Reviews' && <ReviewsTab rating={restaurant.rating} count={restaurant.ratingCount} />}

      </ScrollView>
    </SafeAreaView>
  );
}

function MenuTab() {
  return (
    <View style={s.tabContent}>
      {MOCK_MENU.map(cat => (
        <View key={cat.id}>
          <Text style={s.categoryLabel}>{cat.name}</Text>
          {cat.items.map(item => <MenuItemRow key={item.id} item={item} />)}
        </View>
      ))}
    </View>
  );
}

function ReserveTab({ restaurantId, restaurantName, nav, accepts }: { restaurantId: string; restaurantName: string; nav: Nav; accepts: boolean }) {
  if (!accepts) {
    return (
      <View style={s.tabContent}>
        <View style={s.noReserve}>
          <Text style={s.noReserveEmoji}>📞</Text>
          <Text style={s.noReserveText}>This restaurant prefers phone reservations.</Text>
          <Text style={s.noReserveSub}>Call or WhatsApp to book your table.</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={s.tabContent}>
      <TouchableOpacity
        style={s.reserveBtn}
        onPress={() => nav.navigate('Reserve', { restaurantId, restaurantName })}
      >
        <Text style={s.reserveBtnText}>Reserve a table</Text>
      </TouchableOpacity>
    </View>
  );
}

function ReviewsTab({ rating, count }: { rating: number; count: number }) {
  return (
    <View style={[s.tabContent, s.reviewsWrap]}>
      <Text style={s.reviewRating}>⭐ {rating}</Text>
      <Text style={s.reviewCount}>Based on {count} reviews</Text>
      <Text style={s.reviewComingSoon}>Full reviews coming soon</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  heroWrap: { height: 220, backgroundColor: Colors.muted },
  hero: { width: '100%', height: '100%' },
  backBtn: {
    position: 'absolute', top: 48, left: Spacing.lg,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontSize: 20, color: Colors.text },
  infoSection: { padding: Spacing.lg, backgroundColor: Colors.white, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  name: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.text },
  tagsRow: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  infoTag: { backgroundColor: Colors.tagBg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.chip },
  infoTagText: { fontSize: FontSize.sm, color: Colors.tagText, fontWeight: FontWeight.medium },
  metaRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm, alignItems: 'center' },
  ratingText: { fontSize: FontSize.md, color: Colors.amber, fontWeight: FontWeight.semibold },
  metaText: { fontSize: FontSize.md, color: Colors.sub },
  description: { fontSize: FontSize.sm, color: Colors.sub, marginTop: Spacing.sm, lineHeight: 20 },
  actionRow: { flexDirection: 'row', gap: Spacing.xxl, marginTop: Spacing.lg },
  actionBtn: { alignItems: 'center', gap: 4 },
  actionEmoji: { fontSize: 22, color: Colors.primary },
  actionLabel: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  tabBar: { flexDirection: 'row', backgroundColor: Colors.white, borderBottomWidth: 0.5, borderBottomColor: Colors.border },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, position: 'relative' },
  tabLabel: { fontSize: FontSize.md, color: Colors.sub },
  tabLabelActive: { color: Colors.primary, fontWeight: FontWeight.semibold },
  tabUnderline: { position: 'absolute', bottom: 0, left: 16, right: 16, height: 2, backgroundColor: Colors.primary, borderRadius: 2 },
  tabContent: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.xxl },
  categoryLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.sub, letterSpacing: 0.8, marginTop: Spacing.md, marginBottom: 4 },
  reserveBtn: { backgroundColor: Colors.primary, borderRadius: Radius.input, paddingVertical: 16, alignItems: 'center', marginTop: Spacing.md },
  reserveBtnText: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  noReserve: { alignItems: 'center', paddingVertical: Spacing.xxxl },
  noReserveEmoji: { fontSize: 40 },
  noReserveText: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, marginTop: Spacing.md, textAlign: 'center' },
  noReserveSub: { fontSize: FontSize.sm, color: Colors.sub, marginTop: 4 },
  reviewsWrap: { alignItems: 'center', paddingVertical: Spacing.xxxl },
  reviewRating: { fontSize: 48 },
  reviewCount: { fontSize: FontSize.md, color: Colors.sub, marginTop: Spacing.sm },
  reviewComingSoon: { fontSize: FontSize.sm, color: Colors.hint, marginTop: Spacing.md },
});
