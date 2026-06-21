import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
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
  IonSearchbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { PokemonItemComponent } from '@feature/pokemon/components/pokemon-item/pokemon-item.component';
import { FavouriteService } from '@core/services/favourite/favourite.service';
import { PokemonItem } from '@core/interfaces/pokemon.interface';
import { PokemonEmptyStateComponent } from '@feature/pokemon/components/pokemon-empty-state/pokemon-empty-state.component';
import { ToastService } from '@core/services/toast/toast.service';

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
    IonSearchbar,
    PokemonItemComponent,
    PokemonEmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonFavouritePageComponent {
  private readonly favouriteService = inject(FavouriteService);
  private readonly alertController = inject(AlertController);
  private readonly toastService = inject(ToastService);

  public readonly searchValue = signal<string>('');

  constructor() {
    addIcons({ trashOutline });
  }

  public favouritePokemons = computed<PokemonItem[]>(() => {
    const list = this.favouriteService.favourites();
    const term = this.searchValue().trim().toLowerCase();

    return term
      ? list.filter((item) => item.name.toLowerCase().includes(term))
      : list;
  });

  public total = computed<number>(
    () => this.favouriteService.favourites().length,
  );

  public onSearch(event: CustomEvent): void {
    const term = (event.detail as { value?: string }).value ?? '';
    this.searchValue.set(term);
  }

  public async removeFavourite(pokemon: PokemonItem): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Remove favourite',
      message: `Remove ${pokemon.name} from your favourites?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Remove',
          role: 'destructive',
          handler: async () => {
            this.favouriteService.removeFavourite(pokemon);
            await this.toastService.error(
              `${pokemon.name} removed from favourites`,
            );
          },
        },
      ],
    });
    await alert.present();
  }
}
