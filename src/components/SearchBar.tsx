import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../constants/theme';

interface TappableProps {
  onPress: () => void;
  editable?: false;
}

interface EditableProps {
  value: string;
  onChangeText: (text: string) => void;
  editable: true;
}

type Props = TappableProps | EditableProps;

export default function SearchBar(props: Props) {
  if ('editable' in props && props.editable) {
    return (
      <View style={styles.bar}>
        <Text style={styles.icon}>🔍</Text>
        <TextInput
          style={styles.input}
          placeholder="Search restaurants..."
          placeholderTextColor={colors.subtext}
          value={props.value}
          onChangeText={props.onChangeText}
        />
      </View>
    );
  }
  return (
    <TouchableOpacity style={styles.bar} onPress={(props as TappableProps).onPress} activeOpacity={0.8}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.placeholder}>Search restaurants...</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 10,
    marginHorizontal: spacing.md, marginBottom: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  icon: { marginRight: spacing.sm, fontSize: 16 },
  placeholder: { color: colors.subtext, fontSize: 14 },
  input: { flex: 1, color: colors.text, fontSize: 14 },
});
