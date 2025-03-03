import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  isLoggedIn = !!localStorage.getItem('userToken'); // Verifica se o usuário está logado
}
