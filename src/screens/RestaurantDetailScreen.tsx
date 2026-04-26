import React, { useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Linking,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/Navigator';
import { mockRestaurants } from '../data/mockData';
import { colors, spacing, radius } from '../constants/theme';
import ReserveScreen from './ReserveScreen';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'RestaurantDetail'>;
  route: RouteProp<RootStackParamList, 'RestaurantDetail'>;
};

const REVIEWS = [
  { author: 'Anita S.', rating: 5, text: 'Incredible Newari food, the Choila was perfect!' },
  { author: 'Bikash R.', rating: 4, text: 'Beautiful heritage building, great ambiance.' },
  { author: 'Priya T.', rating: 5, text: 'Best cultural dining experience in Kathmandu.' },
];

type Tab = 'Menu' | 'Reserve' | 'Reviews';

export default function RestaurantDetailScreen({ navigation, route }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Menu');
  const restaurant = mockRestaurants.find(r => r.id === route.params.restaurantId);
  if (!restaurant) return <Text style={{ margin: 40 }}>Restaurant not found.</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: restaurant.image }} style={styles.hero} resizeMode="cover" />
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.tags}>{[restaurant.cuisine, ...restaurant.tags].join(' · ')}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.star}>⭐ {restaurant.rating}</Text>
          <Text style={styles.meta}>  {restaurant.price}  ·  {restaurant.distance}</Text>
        </View>
        <Text style={styles.desc}>{restaurant.description}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}>
            <Text>📞  Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text>📍  Directions</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          {(['Menu', 'Reserve', 'Reviews'] as Tab[]).map(tab => (
            <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabLine} />}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Menu' && (
          <View style={styles.tabContent}>
            {restaurant.menu.map((cat, ci) => (
              <View key={ci}>
                <Text style={styles.catName}>{cat.name.toUpperCase()}</Text>
                {cat.items.map((item, ii) => (
                  <View key={ii} style={styles.menuItem}>
                    <View style={styles.menuLeft}>
                      <Text style={styles.itemName}>
                        {item.name}
                        {item.tags.map(t => (
                          <Text key={t} style={t === 'VEG' ? styles.vegTag : styles.spicyTag}> {t} </Text>
                        ))}
                      </Text>
                    </View>
                    <Text style={styles.price}>Rs.{item.price}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Reserve' && (
          <ReserveScreen restaurantId={restaurant.id} restaurantName={restaurant.name} />
        )}

        {activeTab === 'Reviews' && (
          <View style={styles.tabContent}>
            {REVIEWS.map((r, i) => (
              <View key={i} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{r.author}</Text>
                  <Text style={styles.reviewStars}>{'⭐'.repeat(r.rating)}</Text>
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: { width: '100%', height: 200 },
  backBtn: {
    position: 'absolute', top: 44, left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: radius.full, width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: '#fff', fontSize: 28, lineHeight: 34 },
  body: { flex: 1, padding: spacing.md },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  tags: { color: colors.primary, fontSize: 13, marginBottom: spacing.xs },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  star: { color: colors.amber, fontWeight: '700' },
  meta: { color: colors.subtext, fontSize: 13 },
  desc: { color: colors.subtext, fontSize: 13, marginBottom: spacing.md, lineHeight: 20 },
  actionRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  actionBtn: {
    flex: 1, paddingVertical: 10, borderRadius: radius.full, backgroundColor: colors.card,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
  },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing.md },
  tabItem: { flex: 1, alignItems: 'center', paddingBottom: spacing.sm },
  tabText: { fontSize: 15, fontWeight: '600', color: colors.subtext },
  tabActive: { color: colors.primary },
  tabLine: { position: 'absolute', bottom: 0, height: 2, width: '80%', backgroundColor: colors.primary },
  tabContent: { paddingBottom: spacing.md },
  catName: { fontSize: 11, fontWeight: '800', color: colors.subtext, letterSpacing: 1, marginVertical: spacing.sm },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuLeft: { flex: 1 },
  itemName: { fontSize: 14, color: colors.text, fontWeight: '600' },
  vegTag: { fontSize: 10, color: colors.tagText, backgroundColor: colors.tagBg, borderRadius: 4, overflow: 'hidden' },
  spicyTag: { fontSize: 10, color: colors.red },
  price: { fontSize: 14, fontWeight: '700', color: colors.text },
  reviewCard: { backgroundColor: colors.card, borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  reviewAuthor: { fontWeight: '700', color: colors.text },
  reviewStars: { fontSize: 12 },
  reviewText: { color: colors.subtext, fontSize: 13 },
});
