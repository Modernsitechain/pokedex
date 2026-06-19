import { Routes } from '@angular/router';
import { PokemonLayoutComponent } from './shared/layouts/pokemon-layout/pokemon-layout.component';
import { POKEMON_ROUTES } from '@feature/pokemon/pokemon.routes';
import { PokemonDetailPageComponent } from '@feature/pokemon/pages/pokemon-detail-page/pokemon-detail-page.component';

export const routes: Routes = [
  {
    path: 'pokemon',
    component: PokemonLayoutComponent,
    loadChildren: () => POKEMON_ROUTES,
  },
  {
    path: 'detail/:name',
    component: PokemonDetailPageComponent,
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
