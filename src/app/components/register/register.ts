import {Component, inject} from '@angular/core';
import {FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  showPass = false;
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePass(){ this.showPass = !this.showPass; }

  async submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    const user = await this.auth.emailRegister('', email!, password!);
    if (user) {
      // Nach Registrierung direkt zum Home
      await this.router.navigate(['/home']);
    }
  }

  back(){ this.router.navigate(['/login']); }
}
