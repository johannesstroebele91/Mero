import {inject, Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';
import {onAuthStateChanged, signOut, User, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../firebase';
import {Observable, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private _authState$ = new BehaviorSubject<User | null>(null);
  private _authReady = signal(false);
  authReady = this._authReady.asReadonly();
  private _userSignal = signal<User | null>(null);
  userSignal = this._userSignal.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();
  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  constructor() {
    onAuthStateChanged(auth, (user) => {
      if (!this._authReady()) this._authReady.set(true);
      this._userSignal.set(user);
      this._authState$.next(user);
    });
  }

  get authState$(): Observable<User | null> {
    return this._authState$.asObservable();
  }

  clearError() { this._error.set(null); }

  private mapError(code?: string): string {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email format.';
      case 'auth/user-disabled': return 'Account disabled.';
      case 'auth/user-not-found': return 'No user with that email.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/email-already-in-use': return 'Email already in use.';
      case 'auth/weak-password': return 'Password is too weak.';
      case 'auth/too-many-requests': return 'Too many attempts. Try later.';
      default: return code ? code : 'Unknown auth error.';
    }
  }

  async logout() {
    try {
      await signOut(auth);
      console.log('[Auth] logout success');
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('[Auth] logout error:', error);
    }
  }

  // Email registration — minimal: create auth user and optionally set displayName
  async emailRegister(displayName: string, email: string, password: string) {
    this.clearError();
    this._loading.set(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        try { await updateProfile(cred.user, { displayName }); } catch (e) { console.warn('[Auth] updateProfile failed', e); }
      }
      console.log('[Auth] email register success uid=' + cred.user.uid);
      return cred.user;
    } catch (e: any) {
      console.error('[Auth] email register error', e);
      this._error.set(this.mapError(e?.code));
      return null;
    } finally {
      this._loading.set(false);
    }
  }

  // Email login — minimal
  async emailLogin(email: string, password: string) {
    this.clearError();
    this._loading.set(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log('[Auth] email login success uid=' + cred.user.uid);
      return cred.user;
    } catch (e: any) {
      console.error('[Auth] email login error', e);
      this._error.set(this.mapError(e?.code));
      return null;
    } finally {
      this._loading.set(false);
    }
  }

  /**
   * Wait until onAuthStateChanged has set the user signal (or timeout)
   */
  async waitForAuthState(timeoutMs = 3000): Promise<void> {
    const start = Date.now();
    return new Promise<void>((resolve) => {
      const check = () => {
        if (this._userSignal()) { resolve(); return; }
        if (Date.now() - start >= timeoutMs) { resolve(); return; }
        setTimeout(check, 50);
      };
      check();
    });
  }
}
