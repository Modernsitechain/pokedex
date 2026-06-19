import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { PokemonService } from '@core/services/pokemon/pokemon.service';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pokemon-favourite-page',
  templateUrl: './pokemon-favourite-page.component.html',
  styleUrls: ['./pokemon-favourite-page.component.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonItem, IonLabel, IonThumbnail, IonButton, IonIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonFavouritePageComponent {
  public readonly pokemonService = inject(PokemonService);

  constructor() {
    addIcons({ trashOutline });
  }
}