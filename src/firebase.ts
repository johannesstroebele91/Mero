import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import {environment} from '../environment';

const firebaseConfig = ((environment as any)?.firebase);

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence).catch(err => console.error('[Auth] persistence set error', err));
export const googleProvider = new GoogleAuthProvider();
