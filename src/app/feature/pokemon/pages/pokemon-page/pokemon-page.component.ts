import {
  ChangeDetectionStrategy,
  Component,
  inject,
  resource,
} from '@angular/core';
import { PokemonService } from '@core/services/pokemon/pokemon.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon,
  IonButton,
} from '@ionic/angular/standalone';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pokemon-page',
  templateUrl: './pokemon-page.component.html',
  styleUrls: ['./pokemon-page.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButton,
    IonIcon,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonPageComponent {
  public readonly pokemonService = inject(PokemonService);

  constructor() {
    addIcons({ heart, heartOutline });
    // load awal hanya jika store masih kosong
    if (this.pokemonService.items().length === 0) {
      this.pokemonService.loadMore();
    }
  }

  public async onInfinite(event: InfiniteScrollCustomEvent): Promise<void> {
    await this.pokemonService.loadMore();
    await event.target.complete();
    if (!this.pokemonService.hasMore()) {
      event.target.disabled = true;
    }
  }
}
