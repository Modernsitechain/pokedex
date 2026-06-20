import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonButton,
  IonIcon,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { PokemonItemComponent } from '@feature/pokemon/components/pokemon-item/pokemon-item.component';
import { FavouriteService } from '@core/services/favourite/favourite.service';
import { PokemonItem } from '@core/interfaces/pokemon.interface';

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
  private readonly favouriteService = inject(FavouriteService);
  private readonly alertController = inject(AlertController);

  constructor() {
    addIcons({ trashOutline });
  }

  protected favouritePokemons = computed<PokemonItem[]>(() =>
    this.favouriteService.favourites(),
  );

  protected total = computed<number>(
    () => this.favouriteService.favourites().length,
  );

  public async removeFavourite(pokemon: PokemonItem): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Hapus favorit',
      message: `Hapus ${pokemon.name} dari daftar favorit?`,
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => this.favouriteService.removeFavourite(pokemon),
        },
      ],
    });
    await alert.present();
  }
}
