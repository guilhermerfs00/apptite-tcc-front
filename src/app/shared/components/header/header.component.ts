import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true, // Marque o componente como standalone
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  title = 'Apptite Front';
}