import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { PokemonService } from '@core/services/pokemon/pokemon.service';
import { PokemonDetail } from '@core/interfaces/pokemon.interface';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';
import { FavouriteService } from '@core/services/favourite/favourite.service';
import { ToastService } from '@core/services/toast/toast.service';
import { NgTemplateOutlet } from '@angular/common';
import { PokemonEmptyStateComponent } from '@feature/pokemon/components/pokemon-empty-state/pokemon-empty-state.component';
import { PokemonDetailHeroComponent } from '@feature/pokemon/components/detail/pokemon-detail-hero/pokemon-detail-hero.component';
import { PokemonDetailInfoComponent } from '@feature/pokemon/components/detail/pokemon-detail-info/pokemon-detail-info.component';
import { PokemonDetailAbilitiesComponent } from '@feature/pokemon/components/detail/pokemon-detail-abilities/pokemon-detail-abilities.component';
import { PokemonDetailStatsComponent } from '@feature/pokemon/components/detail/pokemon-detail-stats/pokemon-detail-stats.component';

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
    IonButton,
    IonIcon,
    IonSkeletonText,
    NgTemplateOutlet,
    PokemonEmptyStateComponent,
    PokemonDetailHeroComponent,
    PokemonDetailInfoComponent,
    PokemonDetailAbilitiesComponent,
    PokemonDetailStatsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailPageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly pokemonService = inject(PokemonService);
  private readonly favouriteService = inject(FavouriteService);
  private readonly toastService = inject(ToastService);

  public readonly isLoading = signal<boolean>(false);
  public readonly errorMessage = signal<string | null>(null);
  public readonly pokemon = signal<PokemonDetail | null>(null);

  constructor() {
    addIcons({
      heart,
      heartOutline,
    });
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

  protected isFavourite(pokemonId: string): boolean {
    return this.favouriteService.isFavourite(pokemonId);
  }

  public async toggleFavourite(): Promise<void> {
    const pokemon = this.pokemon();
    if (!pokemon) return;

    const wasFavourite = this.isFavourite(pokemon.id);
    if (wasFavourite) {
      this.favouriteService.removeFavourite(pokemon);
      await this.toastService.info(`${pokemon.name} removed from favourites`);
    } else {
      this.favouriteService.addFavourite(pokemon);
      await this.toastService.success(`${pokemon.name} added to favourites`);
    }
  }

  private loadPokemonDetail(pokemonId: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.pokemonService
      .getPokemonDetail(pokemonId)
      .pipe(
        tap((pokemon) => {
          this.pokemon.set(pokemon);
        }),
        catchError(() => {
          this.errorMessage.set('Failed to load Pokémon details');
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe();
  }
}
