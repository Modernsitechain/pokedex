import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { PokemonService } from '@core/services/pokemon/pokemon.service';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { PokemonItemComponent } from '@feature/pokemon/components/pokemon-item/pokemon-item.component';

@Component({
  selector: 'app-pokemon-favourite-page',
  templateUrl: './pokemon-favourite-page.component.html',
  styleUrls: ['./pokemon-favourite-page.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonButton,
    IonIcon,
    PokemonItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonFavouritePageComponent {
  public readonly pokemonService = inject(PokemonService);

  constructor() {
    addIcons({ trashOutline });
  }
}
