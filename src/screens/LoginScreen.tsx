import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, db } from '../firebase/config';
import { colors, spacing, radius } from '../constants/theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/Navigator';

type Props = { navigation: StackNavigationProp<RootStackParamList, 'Login'> };

export default function LoginScreen({ navigation }: Props) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [role, setRole] = useState<'user' | 'owner'>('user');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      try {
        await set(ref(db, `users/${cred.user.uid}`), { name, phone, email, role });
      } catch (dbErr: unknown) {
        Alert.alert('DB Error', dbErr instanceof Error ? dbErr.message : 'Database write failed.');
        setLoading(false);
        return;
      }
      if (role === 'owner') {
        navigation.replace('OwnerPanel');
      } else {
        navigation.replace('Main');
      }
    } catch (e: unknown) {
      Alert.alert('Auth Error', e instanceof Error ? e.message : 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Enter email and password.');
      return;
    }
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await get(ref(db, `users/${cred.user.uid}`));
      if (snap.val()?.role === 'owner') {
        navigation.replace('OwnerPanel');
      } else {
        navigation.replace('Main');
      }
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  const S = styles;
  return (
    <KeyboardAvoidingView style={S.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={S.scroll} keyboardShouldPersistTaps="handled">
        <View style={S.logoBox}><Text style={S.logoIcon}>🍽️</Text></View>
        <Text style={S.appName}>BhojanSathi</Text>
        <Text style={S.tagline}>Discover · Reserve · Dine</Text>
        <View style={S.roleRow}>
          <TouchableOpacity style={[S.roleBtn, role === 'user' && S.roleActive]} onPress={() => setRole('user')}>
            <Text style={[S.roleText, role === 'user' && S.roleTextActive]}>Foodie</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[S.roleBtn, role === 'owner' && S.roleActive]} onPress={() => setRole('owner')}>
            <Text style={[S.roleText, role === 'owner' && S.roleTextActive]}>Restaurant</Text>
          </TouchableOpacity>
        </View>
        {isSignUp && (
          <>
            <TextInput style={S.input} placeholder="Full name" placeholderTextColor={colors.amber} value={name} onChangeText={setName} />
            <TextInput style={S.input} placeholder="Phone number" placeholderTextColor={colors.amber} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </>
        )}
        <TextInput style={S.input} placeholder="Email" placeholderTextColor={colors.amber} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={S.input} placeholder="Password" placeholderTextColor={colors.amber} value={password} onChangeText={setPassword} secureTextEntry />
        {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.md }} /> : (
          <TouchableOpacity style={S.primaryBtn} onPress={isSignUp ? handleSignUp : handleLogin}>
            <Text style={S.primaryBtnText}>{isSignUp ? 'Create account' : 'Log in'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={S.googleBtn}><Text style={S.googleText}>Continue with Google</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
          <Text style={S.toggleText}>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Text style={S.toggleLink}>{isSignUp ? 'Log in' : 'Sign up'}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { alignItems: 'center', padding: spacing.lg, paddingTop: 60 },
  logoBox: {
    width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  logoIcon: { fontSize: 36 },
  appName: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 4 },
  tagline: { fontSize: 13, color: colors.amber, marginBottom: spacing.lg },
  roleRow: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.full,
    padding: 4, marginBottom: spacing.lg, width: '100%',
  },
  roleBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.full, alignItems: 'center' },
  roleActive: { backgroundColor: colors.primary },
  roleText: { color: colors.subtext, fontWeight: '600' },
  roleTextActive: { color: '#fff' },
  input: {
    width: '100%', borderBottomWidth: 1, borderBottomColor: colors.amber,
    paddingVertical: spacing.sm, marginBottom: spacing.md,
    color: colors.text, fontSize: 15,
  },
  primaryBtn: {
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingVertical: 14, width: '100%', alignItems: 'center', marginTop: spacing.sm,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  googleBtn: {
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.full,
    paddingVertical: 14, width: '100%', alignItems: 'center', marginTop: spacing.sm,
  },
  googleText: { color: colors.text, fontWeight: '600' },
  toggleText: { marginTop: spacing.md, color: colors.subtext, fontSize: 14 },
  toggleLink: { color: colors.primary, fontWeight: '600' },
});
