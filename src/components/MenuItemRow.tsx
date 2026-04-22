import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '../constants/theme';
import type { MenuItem, MenuTag } from '../types';

interface Props {
  item: MenuItem;
}

const TAG_CONFIG: Record<MenuTag, { label: string; color: string; bg: string }> = {
  VEG: { label: 'VEG', color: '#1D7A3E', bg: '#D4EDDA' },
  SPICY: { label: 'SPICY', color: '#C0392B', bg: '#FADBD8' },
  CHEFS_PICK: { label: "CHEF'S PICK", color: '#7D6608', bg: '#FDEBD0' },
};

export default function MenuItemRow({ item }: Props) {
  return (
    <View style={s.row}>
      <View style={s.left}>
        <View style={s.nameRow}>
          <Text style={s.name}>{item.name}</Text>
          {item.tags.map(tag => (
            <View key={tag} style={[s.tag, { backgroundColor: TAG_CONFIG[tag].bg }]}>
              <Text style={[s.tagText, { color: TAG_CONFIG[tag].color }]}>
                {TAG_CONFIG[tag].label}
              </Text>
            </View>
          ))}
        </View>
        {item.description ? (
          <Text style={s.desc} numberOfLines={2}>{item.description}</Text>
        ) : null}
      </View>
      <Text style={s.price}>Rs.{item.price}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  left: { flex: 1, marginRight: Spacing.md },
  nameRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  name: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.text },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 10, fontWeight: FontWeight.bold },
  desc: { fontSize: FontSize.sm, color: Colors.sub, marginTop: 4, lineHeight: 18 },
  price: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, minWidth: 60, textAlign: 'right' },
});
