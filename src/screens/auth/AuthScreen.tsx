import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';

type Mode = 'login' | 'signup';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  secure?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
}

function Field({ label, value, onChange, placeholder, secure, keyboardType = 'default' }: FieldProps) {
  return (
    <View style={s.fieldWrap}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.hint}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      />
    </View>
  );
}

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signup');
  const [role, setRole] = useState<UserRole>('user');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Required', 'Please fill in email and password.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp(email.trim(), password, name.trim(), role);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      Alert.alert('Error', msg.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={s.logo}>
            <Text style={{ fontSize: 32 }}>🍽️</Text>
          </View>
          <Text style={s.appName}>BhojanSathi</Text>
          <Text style={s.tagline}>Discover · Reserve · Dine</Text>
        </View>

        {/* Role toggle (signup only) */}
        {mode === 'signup' && (
          <View style={s.roleRow}>
            <TouchableOpacity
              style={[s.roleBtn, role === 'user' && s.roleBtnActive]}
              onPress={() => setRole('user')}
            >
              <Text style={[s.roleBtnText, role === 'user' && s.roleBtnTextActive]}>Foodie</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.roleBtn, role === 'owner' && s.roleBtnActive]}
              onPress={() => setRole('owner')}
            >
              <Text style={[s.roleBtnText, role === 'owner' && s.roleBtnTextActive]}>Restaurant</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Fields */}
        {mode === 'signup' && (
          <Field label="Full name" value={name} onChange={setName} placeholder="Rahul Shrestha" />
        )}
        {mode === 'signup' && (
          <Field label="Phone number" value={phone} onChange={setPhone} placeholder="+977 98XXXXXXXX" keyboardType="phone-pad" />
        )}
        <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" keyboardType="email-address" />
        <Field label="Password" value={password} onChange={setPassword} placeholder="••••••••" secure />

        {/* Submit */}
        <TouchableOpacity style={s.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={s.submitText}>{mode === 'signup' ? 'Create account' : 'Log in'}</Text>
          )}
        </TouchableOpacity>

        {/* Google (placeholder) */}
        <TouchableOpacity style={s.googleBtn} onPress={() => Alert.alert('Coming soon', 'Google sign-in will be available soon.')}>
          <Text style={s.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Mode toggle */}
        <View style={s.modeRow}>
          <Text style={s.modeText}>
            {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <TouchableOpacity onPress={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
            <Text style={s.modeLink}>{mode === 'signup' ? 'Log in' : 'Sign up'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },
  logoWrap: { alignItems: 'center', paddingTop: 72, paddingBottom: Spacing.xxl },
  logo: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  appName: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, color: Colors.text },
  tagline: { fontSize: FontSize.sm, color: Colors.primary, marginTop: 4, letterSpacing: 0.5 },
  roleRow: {
    flexDirection: 'row', backgroundColor: Colors.muted,
    borderRadius: Radius.card, padding: 4, marginBottom: Spacing.lg,
  },
  roleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Radius.input },
  roleBtnActive: { backgroundColor: Colors.primary },
  roleBtnText: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.sub },
  roleBtnTextActive: { color: Colors.white },
  fieldWrap: { marginBottom: Spacing.md },
  fieldLabel: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.medium, marginBottom: 6 },
  input: {
    backgroundColor: Colors.white, borderRadius: Radius.input,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: 14,
    fontSize: FontSize.md, color: Colors.text, minHeight: 44,
  },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.input,
    paddingVertical: 16, alignItems: 'center', marginTop: Spacing.md,
    minHeight: 52,
  },
  submitText: { color: Colors.white, fontSize: FontSize.md, fontWeight: FontWeight.semibold },
  googleBtn: {
    borderRadius: Radius.input, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 14, alignItems: 'center', marginTop: Spacing.md,
    backgroundColor: Colors.white, minHeight: 48,
  },
  googleText: { fontSize: FontSize.md, color: Colors.text },
  modeRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  modeText: { fontSize: FontSize.sm, color: Colors.sub },
  modeLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: FontWeight.semibold },
});
