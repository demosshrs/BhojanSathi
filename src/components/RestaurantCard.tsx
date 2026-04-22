import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight, SCREEN_WIDTH } from '../constants/theme';
import type { Restaurant } from '../types';

interface Props {
  restaurant: Restaurant;
  onPress: () => void;
  variant?: 'card' | 'row';
}

function PriceDisplay({ price }: { price: Restaurant['price'] }) {
  const map = { Rs: 'Rs', RsRs: 'RsRs', RsRsRs: 'RsRsRs' };
  return <Text style={s.metaText}>{map[price]}</Text>;
}

export default function RestaurantCard({ restaurant: r, onPress, variant = 'card' }: Props) {
  if (variant === 'row') {
    return (
      <TouchableOpacity style={s.row} onPress={onPress} activeOpacity={0.8}>
        <Image
          source={{ uri: r.images[0] }}
          style={s.rowImg}
          resizeMode="cover"
        />
        <View style={s.rowBody}>
          <Text style={s.rowName} numberOfLines={1}>{r.name}</Text>
          <Text style={s.rowCuisine} numberOfLines={1}>{r.cuisine}</Text>
          <View style={s.metaRow}>
            <Text style={s.ratingText}>⭐ {r.rating}</Text>
            <Text style={s.dot}>·</Text>
            <PriceDisplay price={r.price} />
            <Text style={s.dot}>·</Text>
            <Text style={s.metaText}>{r.distance}</Text>
            <Text style={s.dot}>·</Text>
            <Text style={[s.metaText, { color: r.isOpen ? Colors.primary : Colors.red }]}>
              {r.isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: r.images[0] }} style={s.cardImg} resizeMode="cover" />
      <View style={[s.openBadge, { backgroundColor: r.isOpen ? 'rgba(29,158,117,0.9)' : 'rgba(226,75,74,0.9)' }]}>
        <Text style={s.openText}>{r.isOpen ? 'Open' : 'Closed'}</Text>
      </View>
      <View style={s.cardBody}>
        <Text style={s.cardName} numberOfLines={1}>{r.name}</Text>
        <Text style={s.cardCuisine} numberOfLines={1}>{r.cuisine}</Text>
        <View style={s.metaRow}>
          <Text style={s.ratingText}>⭐ {r.rating}</Text>
          <PriceDisplay price={r.price} />
          <Text style={s.metaText}>{r.distance}</Text>
        </View>
        <View style={s.tagRow}>
          {r.tags.slice(0, 2).map(t => (
            <View key={t} style={s.tag}>
              <Text style={s.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.68,
    borderRadius: Radius.card,
    backgroundColor: Colors.card,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  cardImg: { width: '100%', height: 130 },
  openBadge: { position: 'absolute', top: 8, left: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  openText: { fontSize: FontSize.xs, color: Colors.white, fontWeight: FontWeight.semibold },
  cardBody: { padding: Spacing.md },
  cardName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  cardCuisine: { fontSize: FontSize.sm, color: Colors.sub, marginTop: 2 },
  metaRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: 6, alignItems: 'center' },
  ratingText: { fontSize: FontSize.sm, color: Colors.amber, fontWeight: FontWeight.semibold },
  metaText: { fontSize: FontSize.sm, color: Colors.hint },
  dot: { fontSize: FontSize.sm, color: Colors.hint },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  tag: { backgroundColor: Colors.tagBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: FontSize.xs, color: Colors.tagText, fontWeight: FontWeight.medium },
  row: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  rowImg: { width: 88, height: 88 },
  rowBody: { flex: 1, padding: Spacing.md, justifyContent: 'center' },
  rowName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text },
  rowCuisine: { fontSize: FontSize.sm, color: Colors.sub, marginTop: 2 },
});
