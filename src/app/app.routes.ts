import { Routes } from '@angular/router';
import { PokemonLayoutComponent } from './shared/layouts/pokemon-layout/pokemon-layout.component';
import { POKEMON_ROUTES } from '@feature/pokemon/pokemon.routes';

export const routes: Routes = [
  {
    path: 'pokemon',
    component: PokemonLayoutComponent,
    loadChildren: () => POKEMON_ROUTES,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pokemon',
  },
  {
    path: '**',
    redirectTo: 'pokemon',
  },
];
