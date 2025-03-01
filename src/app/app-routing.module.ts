import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { CadastroRestauranteComponent } from './features/restaurante/cadastro-restaurante/cadastro-restaurante.component';
import { ListaRestaurantesComponent } from './features/restaurante/lista-restaurante/lista-restaurante.component';
import { CadastroCardapioComponent } from './features/cardapio/cadastro-cardapio/cadastro-cardapio.component';
import { CadastroCategoriaComponent } from './features/categoria/cadastro-categoria/cadastro-categoria.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro-restaurante', component: CadastroRestauranteComponent },
  { path: 'lista-restaurantes', component: ListaRestaurantesComponent },
  { path: 'cadastro-cardapio/:idRestaurante', component: CadastroCardapioComponent },
  { path: 'cadastro-categoria/:idCardapio', component: CadastroCategoriaComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];