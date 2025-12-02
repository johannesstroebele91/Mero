import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {AuthService} from '../../services/auth.service';
import {Component, inject} from '@angular/core';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  authService = inject(AuthService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  showPassword = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePassword(){ this.showPassword = !this.showPassword; }

  async loginGoogle() {
    this.loginService.setLanguage('de');
    await this.loginService.loginWithGoogle();
  }

  async submitEmailLogin() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    const user = await this.authService.emailLogin(email!, password!);
    if (user) {
      // wait for AuthService to confirm auth state (avoid race)
      await this.authService.waitForAuthState(3000);
      await this.router.navigate(['/home']);
    }
  }

  async goDashboard(){
    await this.router.navigate(['/home']);
  }

}
