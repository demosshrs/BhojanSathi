import { useState } from 'react';
import type { AppUser, UserRole } from '../types';

interface AuthState {
  appUser: AppUser | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ appUser: null, loading: false });

  const signUp = async (email: string, _password: string, name: string, role: UserRole) => {
    const appUser: AppUser = {
      id: Math.random().toString(36).slice(2),
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    setState({ appUser, loading: false });
  };

  const signIn = async (email: string, _password: string) => {
    const appUser: AppUser = {
      id: 'mock-user',
      name: email.split('@')[0],
      email,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    setState({ appUser, loading: false });
  };

  const logout = () => setState({ appUser: null, loading: false });

  return { ...state, user: state.appUser, signUp, signIn, logout };
}
