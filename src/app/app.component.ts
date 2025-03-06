import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./shared/components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header *ngIf="isLoggedIn"></app-header>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  isLoggedIn = !!localStorage.getItem('userToken');
}