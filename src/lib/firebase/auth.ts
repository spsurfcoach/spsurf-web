"use client";

import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "./client";

const googleProvider = new GoogleAuthProvider();

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(firebaseAuth, callback);
}

export async function signInWithGoogle() {
  return signInWithPopup(firebaseAuth, googleProvider);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function registerWithEmail(email: string, password: string, name?: string) {
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }
  return credential;
}

export async function signOutUser() {
  return signOut(firebaseAuth);
}

export async function getCurrentIdToken() {
  if (!firebaseAuth.currentUser) return null;
  return firebaseAuth.currentUser.getIdToken();
}
