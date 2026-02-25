import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@react-native-firebase/auth';
import { decrypt } from './crypto';
import { getApp } from '@react-native-firebase/app';

const auth = getAuth(getApp()); // or just getAuth() for default app

export async function register(email: string, password: string) {
  const plainPassword = decrypt(password);
  email = email + '@leagueone.com.ph';

  return createUserWithEmailAndPassword(auth, email, plainPassword);
}

export async function login(email: string, password: string) {
  const plainPassword = decrypt(password);
  email = email + '@leagueone.com.ph';

  return signInWithEmailAndPassword(auth, email, plainPassword);
}

export async function logout() {
  return signOut(auth);
}
