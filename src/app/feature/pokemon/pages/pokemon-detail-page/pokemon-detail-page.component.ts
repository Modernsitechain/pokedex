import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  EMPTY,
  finalize,
  firstValueFrom,
  map,
  of,
  tap,
} from 'rxjs';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonChip,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { PokemonService } from '@core/services/pokemon/pokemon.service';
import { PokemonDetail } from '@core/interfaces/pokemon.interface';
import { addIcons } from 'ionicons';
import {
  heart,
  heartOutline,
  chevronBack,
  chevronForward,
} from 'ionicons/icons';
import { FavouriteService } from '@core/services/favourite/favourite.service';
import { getBasePokemonImageUrl } from '@core/utils/pokemon-helper.function';
import { ToastService } from '@core/services/toast/toast.service';

@Component({
  selector: 'app-pokemon-detail-page',
  templateUrl: './pokemon-detail-page.component.html',
  styleUrls: ['./pokemon-detail-page.component.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonChip,
    IonLabel,
    IonButton,
    IonIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly pokemonService = inject(PokemonService);
  private readonly favouriteService = inject(FavouriteService);
  private readonly toastService = inject(ToastService);

  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly pokemon = signal<PokemonDetail | null>(null);

  public readonly maxStat = 255;
  public readonly maxPokemonId = 1025; // batas atas saat ini di PokeAPI

  constructor() {
    addIcons({ heart, heartOutline, chevronBack, chevronForward });
    this.initialize();
  }

  private initialize(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const pokemonId = params.get('id');
        if (pokemonId) {
          this.loadPokemonDetail(pokemonId);
        }
      });
  }

  private loadPokemonDetail(pokemonId: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.pokemonService
      .getPokemonDetail(pokemonId)
      .pipe(
        tap((pokemon) => this.pokemon.set(pokemon)),
        catchError(() => {
          this.errorMessage.set('Gagal memuat detail Pokémon');
          return EMPTY; // hentikan stream dengan rapi
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe();
  }

  public goTo(id: number): void {
    if (id < 1 || id > this.maxPokemonId) return;
    this.router.navigate(['/detail', id]);
  }

  public statPercent(value: number): number {
    return Math.min(100, (value / this.maxStat) * 100);
  }

  protected isFavourite(pokemonId: string): boolean {
    return this.favouriteService.isFavourite(pokemonId);
  }

  public async toggleFavourite(): Promise<void> {
    const pokemon = this.pokemon();

    if (!pokemon) return;

    const wasFavourite = this.isFavourite(pokemon.id);

    if (wasFavourite) {
      this.favouriteService.removeFavourite(pokemon);
      await this.toastService.error(`${pokemon.name} removed from favourites`);
    } else {
      this.favouriteService.addFavourite(pokemon);
      await this.toastService.success(`${pokemon.name} added to favourites`);
    }
  }
}
