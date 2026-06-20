import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { PokemonService } from '@core/services/pokemon/pokemon.service';
import { PokemonItem } from '@core/interfaces/pokemon.interface';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonSpinner,
  IonButtons,
  IonPopover,
} from '@ionic/angular/standalone';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronForward,
  heart,
  heartOutline,
  filter as filterIcon,
} from 'ionicons/icons';
import { EMPTY, Subject, catchError, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PokemonItemComponent } from '@feature/pokemon/components/pokemon-item/pokemon-item.component';

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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonSpinner,
    IonButtons,
    IonPopover,
    PokemonItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonPageComponent {
  public readonly pokemonService = inject(PokemonService);

  public readonly types = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ];

  private readonly searchTerm = signal<string>('');
  private readonly selectedType = signal<string>('');
  private readonly typeResults = signal<PokemonItem[]>([]);
  public readonly typeLoading = signal<boolean>(false);
  private readonly typeSelect$ = new Subject<string>();

  private readonly source = computed<PokemonItem[]>(() =>
    this.selectedType() ? this.typeResults() : this.pokemonService.items(),
  );

  public readonly visiblePokemons = computed<PokemonItem[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.source();
    return term ? list.filter((p) => p.name.toLowerCase().includes(term)) : list;
  });

  public readonly showInfiniteScroll = computed<boolean>(
    () => !this.selectedType(),
  );

  constructor() {
    addIcons({ heart, heartOutline, chevronForward, filter: filterIcon });

    if (this.pokemonService.items().length === 0) {
      this.pokemonService.loadMore();
    }

    this.typeSelect$.pipe(
      distinctUntilChanged(),
      tap((type) => this.selectedType.set(type)),
      switchMap((type) => {
        if (!type) {
          this.typeResults.set([]);
          this.typeLoading.set(false);
          return EMPTY;
        }
        this.typeLoading.set(true);
        return this.pokemonService.getPokemonsByType(type).pipe(
          catchError(() => of([] as PokemonItem[])),
        );
      }),
      takeUntilDestroyed(),
    ).subscribe((data) => {
      this.typeResults.set(data);
      this.typeLoading.set(false);
    });
  }

  public onSearch(event: CustomEvent): void {
    this.searchTerm.set((event.detail as { value?: string }).value ?? '');
  }

  public selectType(type: string): void {
    this.typeSelect$.next(type);
  }

  public async onInfinite(event: InfiniteScrollCustomEvent): Promise<void> {
    await this.pokemonService.loadMore();
    await event.target.complete();
    if (!this.pokemonService.hasMore()) {
      event.target.disabled = true;
    }
  }
}
