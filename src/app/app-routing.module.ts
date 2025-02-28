import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/restaurantes', pathMatch: 'full' }, // Rota padrão
  { path: 'restaurantes', loadChildren: () => import('./features/restaurante/restaurante.module').then(m => m.RestauranteModule) },
  { path: '**', redirectTo: '/restaurantes' } // Rota curinga para redirecionar erros 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }