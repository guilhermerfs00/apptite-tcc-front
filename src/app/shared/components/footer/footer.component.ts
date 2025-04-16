import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true, // Marque o componente como standalone
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  year = new Date().getFullYear();
}