import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Radius, FontSize, FontWeight } from '../constants/theme';
import type { Mood } from '../types';

interface Props {
  mood: Mood;
  selected: boolean;
  onPress: () => void;
}

export default function MoodChip({ mood, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[s.chip, { backgroundColor: selected ? mood.color : Colors.muted }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={s.emoji}>{mood.emoji}</Text>
      <Text style={[s.label, selected && s.labelActive]}>{mood.label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.chip,
    gap: 4,
    minHeight: 44,
  },
  emoji: { fontSize: 15 },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.sub },
  labelActive: { color: Colors.white },
});
