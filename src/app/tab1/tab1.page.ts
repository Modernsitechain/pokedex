import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { PokemonService } from '@core/services/pokemon/pokemon.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
  ],
})
export class Tab1Page implements OnInit {
  private readonly pokemonService = inject(PokemonService);

  ngOnInit(): void {
    this.pokemonService
      .getPokemons()
      .subscribe((res) => console.log('pokemons', res.results));
  }
}
