import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, FlatList,
} from 'react-native';
import { colors, spacing, radius } from '../constants/theme';
import { mockRestaurants } from '../data/mockData';
import { Restaurant } from '../types';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { TabParamList, RootStackParamList } from '../navigation/Navigator';

type Props = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'AI'>,
    StackNavigationProp<RootStackParamList>
  >;
};

type Message = { id: string; text: string; isUser: boolean; restaurants?: Restaurant[] };

const CHIPS = ['Spicy food', 'Under Rs500', 'Newari cuisine', 'Near Thamel'];

function getBotReply(query: string): { text: string; restaurants: Restaurant[] } {
  const q = query.toLowerCase();
  let matches = mockRestaurants.filter(r => {
    if (q.includes('spicy')) return r.menu.some(c => c.items.some(i => i.tags.includes('SPICY')));
    if (q.includes('rs500') || q.includes('under')) return r.price.length <= 2;
    if (q.includes('newari') || q.includes('nepali')) return ['Newari', 'Thakali', 'Nepali'].includes(r.cuisine);
    if (q.includes('thamel') || q.includes('close')) return parseFloat(r.distance) < 1.0;
    if (q.includes('patan')) return r.distance > '1 km';
    return r.openNow;
  });
  if (!matches.length) matches = mockRestaurants.slice(0, 2);
  return { text: 'Great choice! Here are my top picks:', restaurants: matches.slice(0, 2) };
}

export default function AIChatScreen({ navigation }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', isUser: false, text: "Namaste! Tell me what you're craving and I'll find the perfect spot for you." },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), isUser: true, text };
    const reply = getBotReply(text);
    const botMsg: Message = { id: (Date.now() + 1).toString(), isUser: false, text: reply.text, restaurants: reply.restaurants };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.title}>AI food concierge</Text>
        <TouchableOpacity onPress={() => setMessages([{ id: '0', isUser: false, text: "Namaste! Tell me what you're craving and I'll find the perfect spot for you." }])}>
          <Text style={styles.newChat}>New chat</Text>
        </TouchableOpacity>
      </View>

      <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
        {messages.map((msg, idx) => (
          <View key={msg.id}>
            <View style={[styles.bubble, msg.isUser ? styles.userBubble : styles.botBubble]}>
              <Text style={[styles.bubbleText, msg.isUser && styles.userText]}>{msg.text}</Text>
            </View>
            {idx === 0 && (
              <View style={styles.suggestRow}>
                {CHIPS.map(c => (
                  <TouchableOpacity key={c} style={styles.suggestChip} onPress={() => sendMessage(c)}>
                    <Text style={styles.suggestText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {msg.restaurants && msg.restaurants.map(r => (
              <TouchableOpacity
                key={r.id}
                style={styles.restCard}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: r.id })}
              >
                <View style={styles.restImg} />
                <View>
                  <Text style={styles.restName}>{r.name}</Text>
                  <Text style={styles.restMeta}>{r.cuisine} · ⭐{r.rating} · {r.distance}</Text>
                  <Text style={styles.restNote}>Known for {r.menu[0]?.items.find(i => i.tags.includes('SPICY'))?.name ?? r.menu[0]?.items[0]?.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="What are you craving?"
          placeholderTextColor={colors.subtext}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => sendMessage(input)}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(input)}>
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingTop: 52, paddingBottom: spacing.sm, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  newChat: { color: colors.primary, fontWeight: '600' },
  chat: { flex: 1 },
  chatContent: { padding: spacing.md, gap: spacing.sm },
  bubble: { maxWidth: '80%', borderRadius: radius.md, padding: spacing.sm, marginBottom: 4 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  botBubble: { alignSelf: 'flex-start', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  bubbleText: { color: colors.text, fontSize: 14 },
  userText: { color: '#fff' },
  suggestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  suggestChip: { backgroundColor: colors.tagBg, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 6 },
  suggestText: { color: colors.tagText, fontSize: 12, fontWeight: '600' },
  restCard: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.sm, marginBottom: spacing.sm, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  restImg: { width: 70, height: 70, backgroundColor: colors.primary },
  restName: { fontWeight: '700', color: colors.text, fontSize: 14, margin: spacing.sm, marginBottom: 2 },
  restMeta: { color: colors.subtext, fontSize: 12, marginHorizontal: spacing.sm },
  restNote: { color: colors.primary, fontSize: 12, margin: spacing.sm, marginTop: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, backgroundColor: colors.background, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: 10, color: colors.text, fontSize: 14 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.sm },
  sendIcon: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
