import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';
import { MOCK_RESTAURANTS } from '../data/mockData';
import type { ChatMessage, RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function makeId() { return Math.random().toString(36).slice(2); }

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init',
  role: 'bot',
  text: "Namaste! 🙏 Tell me what you're craving and I'll find the perfect spot for you.",
  timestamp: new Date(),
};

function getBotReply(input: string): ChatMessage {
  const lower = input.toLowerCase();
  const matched = MOCK_RESTAURANTS.filter(r =>
    r.tags.some(t => lower.includes(t.toLowerCase())) ||
    r.cuisine.toLowerCase().split(' · ').some(c => lower.includes(c)) ||
    (lower.includes('spicy') && r.tags.includes('Newari')) ||
    (lower.includes('cheap') && r.price === 'Rs') ||
    (lower.includes('fine dining') && r.price === 'RsRsRs')
  );
  const picks = matched.length > 0 ? matched : MOCK_RESTAURANTS.slice(0, 2);
  return {
    id: makeId(),
    role: 'bot',
    text: `Great choice! Here are my top picks:`,
    restaurants: picks.slice(0, 2),
    timestamp: new Date(),
  };
}

export default function AIChatScreen() {
  const nav = useNavigation<Nav>();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: makeId(), role: 'user', text, timestamp: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      const botMsg = getBotReply(text);
      setMessages(m => [...m, botMsg]);
      listRef.current?.scrollToEnd({ animated: true });
    }, 700);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>AI food concierge</Text>
        <TouchableOpacity onPress={() => setMessages([INITIAL_MESSAGE])}>
          <Text style={s.newChat}>New chat</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={s.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item: msg }) => (
            <View style={msg.role === 'user' ? s.userBubbleWrap : s.botBubbleWrap}>
              {msg.role === 'user' ? (
                <View style={s.userBubble}>
                  <Text style={s.userText}>{msg.text}</Text>
                </View>
              ) : (
                <View style={s.botBubble}>
                  <Text style={s.botText}>{msg.text}</Text>
                  {msg.restaurants?.map(r => (
                    <TouchableOpacity
                      key={r.id}
                      style={s.restaurantCard}
                      onPress={() => nav.navigate('RestaurantDetail', { restaurantId: r.id })}
                      activeOpacity={0.85}
                    >
                      <Image source={{ uri: r.images[0] }} style={s.cardImg} resizeMode="cover" />
                      <Text style={s.cardName}>{r.name}</Text>
                      <Text style={s.cardMeta}>{r.cuisine} · ⭐ {r.rating} · {r.distance}</Text>
                      <Text style={s.cardHint}>Known for {r.tags[0]}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        />

        {/* Input row */}
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            value={input}
            onChangeText={setInput}
            placeholder="What are you craving?"
            placeholderTextColor={Colors.hint}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <TouchableOpacity style={s.sendBtn} onPress={send} disabled={!input.trim()}>
            <Text style={s.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 0.5, borderBottomColor: Colors.border, backgroundColor: Colors.white },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold, color: Colors.text },
  newChat: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium },
  list: { padding: Spacing.lg, gap: Spacing.md },
  userBubbleWrap: { alignItems: 'flex-end' },
  botBubbleWrap: { alignItems: 'flex-start', maxWidth: '85%' },
  userBubble: { backgroundColor: Colors.primary, borderRadius: 18, borderBottomRightRadius: 4, paddingHorizontal: 16, paddingVertical: 10, maxWidth: '80%' },
  userText: { color: Colors.white, fontSize: FontSize.md },
  botBubble: { gap: Spacing.sm },
  botText: { fontSize: FontSize.md, color: Colors.text, lineHeight: 22 },
  restaurantCard: { backgroundColor: Colors.card, borderRadius: Radius.card, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.border, width: 220 },
  cardImg: { width: '100%', height: 110 },
  cardName: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.text, paddingHorizontal: Spacing.sm, paddingTop: Spacing.sm },
  cardMeta: { fontSize: FontSize.sm, color: Colors.sub, paddingHorizontal: Spacing.sm, marginTop: 2 },
  cardHint: { fontSize: FontSize.sm, color: Colors.primary, paddingHorizontal: Spacing.sm, paddingBottom: Spacing.sm, marginTop: 2 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderTopWidth: 0.5, borderTopColor: Colors.border, backgroundColor: Colors.white },
  input: { flex: 1, backgroundColor: Colors.muted, borderRadius: Radius.chip, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: FontSize.md, color: Colors.text, minHeight: 44 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { color: Colors.white, fontSize: FontSize.lg, fontWeight: FontWeight.bold },
});
