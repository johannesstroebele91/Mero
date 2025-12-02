import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>

    <div class="app-content-root">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
  .app-content-root { display:block; min-height:100vh; padding: 40px }`
  ]
})
export class App {}
