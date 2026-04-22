import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Radius, FontSize, FontWeight } from '../constants/theme';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function FilterChip({ label, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[s.chip, selected && s.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[s.label, selected && s.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.chip,
    backgroundColor: Colors.muted,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 44,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.sub },
  labelActive: { color: Colors.white },
});
