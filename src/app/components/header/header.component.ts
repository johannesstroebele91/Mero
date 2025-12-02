import {Component, inject, computed, signal} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  private currentUrl = signal<string>('');
  isLoginRoute = computed(() => this.currentUrl() === '/login');

  constructor() {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.currentUrl.set(ev.urlAfterRedirects);
      }
    });
  }

  async onLogout() {
    await this.auth.logout();
  }
}
