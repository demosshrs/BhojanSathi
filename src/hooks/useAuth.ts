import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { AppUser, UserRole } from '../types';

interface AuthState {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, appUser: null, loading: true });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
        setState({ user: firebaseUser, appUser: snap.data() as AppUser ?? null, loading: false });
      } else {
        setState({ user: null, appUser: null, loading: false });
      }
    });
    return unsub;
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const appUser: AppUser = {
      id: cred.user.uid,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), appUser);
    setState(s => ({ ...s, appUser }));
    return cred;
  };

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return { ...state, signUp, signIn, logout };
}
