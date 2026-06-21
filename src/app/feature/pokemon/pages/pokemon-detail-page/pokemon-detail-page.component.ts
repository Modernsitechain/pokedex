import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
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
import {
  heart,
  heartOutline,
  chevronBack,
  chevronForward,
  volumeHighOutline,
  scaleOutline,
  resizeOutline,
  flashOutline,
} from 'ionicons/icons';
import { FavouriteService } from '@core/services/favourite/favourite.service';
import { ToastService } from '@core/services/toast/toast.service';
import { NgTemplateOutlet } from '@angular/common';
import { PokemonEmptyStateComponent } from '@feature/pokemon/components/pokemon-empty-state/pokemon-empty-state.component';
import { PokemonDetailHeroComponent } from '@feature/pokemon/components/detail/pokemon-detail-hero/pokemon-detail-hero.component';
import { PokemonDetailInfoComponent } from '@feature/pokemon/components/detail/pokemon-detail-info/pokemon-detail-info.component';
import { PokemonDetailAbilitiesComponent } from '@feature/pokemon/components/detail/pokemon-detail-abilities/pokemon-detail-abilities.component';
import { PokemonDetailStatsComponent } from '@feature/pokemon/components/detail/pokemon-detail-stats/pokemon-detail-stats.component';
import { PokemonDetailMovesComponent } from '@feature/pokemon/components/detail/pokemon-detail-moves/pokemon-detail-moves.component';

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
    PokemonDetailMovesComponent
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

  // gambar yang sedang dipilih di galeri
  public readonly selectedImage = signal<string>('');

  public readonly maxStat = 255;
  public readonly maxPokemonId = 1025;

  // daftar thumbnail galeri (artwork, normal, shiny) yang tersedia
  public readonly gallery = computed<{ label: string; url: string }[]>(() => {
    const p = this.pokemon();
    if (!p) return [];
    const items: { label: string; url: string }[] = [];
    if (p.sprites.officialArtwork) {
      items.push({ label: 'Artwork', url: p.sprites.officialArtwork });
    }
    if (p.sprites.front) {
      items.push({ label: 'Normal', url: p.sprites.front });
    }
    if (p.sprites.frontShiny) {
      items.push({ label: 'Shiny', url: p.sprites.frontShiny });
    }
    return items;
  });

  constructor() {
    addIcons({
      heart,
      heartOutline,
      chevronBack,
      chevronForward,
      volumeHighOutline,
      scaleOutline,
      resizeOutline,
      flashOutline,
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

  private loadPokemonDetail(pokemonId: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.pokemonService
      .getPokemonDetail(pokemonId)
      .pipe(
        tap((pokemon) => {
          this.pokemon.set(pokemon);
          this.selectedImage.set(pokemon.imageUrl); // reset gambar utama
        }),
        catchError(() => {
          this.errorMessage.set('Failed to load Pokémon details');
          return EMPTY;
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

  public selectImage(url: string): void {
    this.selectedImage.set(url);
  }

  public playCry(): void {
    const url = this.pokemon()?.cryUrl;
    if (!url) return;
    const audio = new Audio(url);
    audio.volume = 0.4; // cry PokeAPI cukup keras, redam sedikit
    void audio.play().catch(() => undefined);
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
}