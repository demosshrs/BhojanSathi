import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../constants/theme';
import { Restaurant } from '../types';

interface Props {
  restaurant: Restaurant;
  onPress: () => void;
  horizontal?: boolean;
}

export default function RestaurantCard({ restaurant, onPress, horizontal = false }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, horizontal ? styles.horizontal : styles.vertical]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={horizontal ? styles.imgWrapH : styles.imgWrapV}>
        <Image
          source={{ uri: restaurant.image }}
          style={horizontal ? styles.imgH : styles.imgV}
          resizeMode="cover"
        />
        <View style={[styles.badge, restaurant.openNow ? styles.badgeOpen : styles.badgeClosed]}>
          <Text style={styles.badgeText}>{restaurant.openNow ? 'Open' : 'Closed'}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
        <Text style={styles.sub}>{restaurant.cuisine}</Text>
        <View style={styles.row}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.rating}>{restaurant.rating}</Text>
          <Text style={styles.dot}> · </Text>
          <Text style={styles.price}>{restaurant.price}</Text>
          <Text style={styles.dot}> · </Text>
          <Text style={styles.dist}>{restaurant.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.md, overflow: 'hidden' },
  horizontal: { width: 180, marginRight: spacing.sm },
  vertical: { flexDirection: 'row', marginBottom: spacing.sm, marginHorizontal: spacing.md },
  imgWrapH: { width: '100%', height: 110 },
  imgWrapV: { width: 80, height: 80, borderRadius: radius.sm, overflow: 'hidden' },
  imgH: { width: '100%', height: '100%' },
  imgV: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute', top: 6, left: 6, paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeOpen: { backgroundColor: colors.primary },
  badgeClosed: { backgroundColor: colors.red },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  info: { flex: 1, padding: spacing.sm },
  name: { fontWeight: '700', fontSize: 14, color: colors.text },
  sub: { fontSize: 12, color: colors.subtext, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  star: { fontSize: 11 },
  rating: { fontSize: 12, color: colors.amber, fontWeight: '600' },
  dot: { color: colors.subtext, fontSize: 12 },
  price: { fontSize: 12, color: colors.subtext },
  dist: { fontSize: 12, color: colors.subtext },
});
