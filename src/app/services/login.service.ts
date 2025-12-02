import {Injectable} from '@angular/core';
import {signInWithPopup, signInWithRedirect} from 'firebase/auth';
import {auth, googleProvider} from '../../firebase';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  setLanguage(languageCode: string) {
    auth.languageCode = languageCode;
  }

  private async withCenteredPopup<T>(fn: () => Promise<T>): Promise<T> {
    const originalOpen = window.open;
    // center popup
    window.open = function (url?: string | URL | null, target?: string, features?: string) {
      try {
        const width = 600;
        const height = 700;
        const screenLeft = (window.screenLeft !== undefined) ? window.screenLeft : (window.screenX || 0);
        const screenTop = (window.screenTop !== undefined) ? window.screenTop : (window.screenY || 0);
        const outerWidth = window.outerWidth || screen.width || 1024;
        const outerHeight = window.outerHeight || screen.height || 768;
        const left = Math.floor(screenLeft + (outerWidth - width) / 2);
        const top = Math.floor(screenTop + (outerHeight - height) / 2);
        const centered = `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`;
        const final = features ? (features + ',' + centered) : centered;
        return (originalOpen as any).call(window, url, target, final);
      } catch (e) {
        return (originalOpen as any).call(window, url, target, features);
      }
    } as any;

    try {
      return await fn();
    } finally {
      try {
        window.open = originalOpen;
      } catch (e_1) {
      }
    }
  }

  async loginWithGoogle() {
    try {
      await this.withCenteredPopup(() => signInWithPopup(auth, googleProvider));
    } catch (error: any) {
      console.warn('Popup sign-in failed, attempting redirect fallback:', error?.code || error);

      const authDomain = (auth as any)?.app?.options?.authDomain;
      const handlerUrl = `https://${authDomain}/__/auth/handler?apiKey=${(auth as any)?.app?.options?.apiKey}&providerId=google.com`;

      try {
        const resp = await fetch(handlerUrl, { method: 'HEAD' });
        if (resp.ok || resp.status === 405 || resp.status === 200 || resp.status === 302) {
          console.info('Auth handler reachable; using redirect fallback to sign in.');
          await signInWithRedirect(auth, googleProvider);
          return;
        }
      } catch (e) {
        console.warn('Auth handler check failed:', e);
      }
    }
  }
}
