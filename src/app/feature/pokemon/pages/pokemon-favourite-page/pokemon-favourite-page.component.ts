import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonButton, IonIcon,
  AlertController,
} from '@ionic/angular/standalone';
import { PokemonService } from '@core/services/pokemon/pokemon.service';
import { PokemonItem } from '@core/interfaces/pokemon.interface';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { PokemonItemComponent } from '@feature/pokemon/components/pokemon-item/pokemon-item.component';

@Component({
  selector: 'app-pokemon-favourite-page',
  templateUrl: './pokemon-favourite-page.component.html',
  styleUrls: ['./pokemon-favourite-page.component.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonList, IonButton, IonIcon, PokemonItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonFavouritePageComponent {
  public readonly pokemonService = inject(PokemonService);
  private readonly alertCtrl = inject(AlertController);

  constructor() {
    addIcons({ trashOutline });
  }

  public async confirmRemove(pokemon: PokemonItem): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Hapus favorit',
      message: `Hapus ${pokemon.name} dari daftar favorit?`,
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => this.pokemonService.removeFavorite(pokemon.name),
        },
      ],
    });
    await alert.present();
  }
}