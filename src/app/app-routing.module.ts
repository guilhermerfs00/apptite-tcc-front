import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { CadastroRestauranteComponent } from './features/restaurante/cadastro-restaurante/cadastro-restaurante.component';
import { ListaRestaurantesComponent } from './features/restaurante/lista-restaurante/lista-restaurante.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro-restaurante', component: CadastroRestauranteComponent },
  { path: 'lista-restaurantes', component: ListaRestaurantesComponent }, // Rota para a lista de restaurantes
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Rota padrão
  { path: '**', redirectTo: '/login' }, // Rota de fallback
];