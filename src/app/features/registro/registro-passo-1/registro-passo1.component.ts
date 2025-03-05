import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-passo1',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-passo1.component.html',
  styleUrls: ['./registro-passo1.component.css'],
})
export class RegistroPasso1Component {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    // Armazena o email temporariamente
    sessionStorage.setItem('email', this.email);
    this.router.navigate(['/registro-passo2']);
  }
}
