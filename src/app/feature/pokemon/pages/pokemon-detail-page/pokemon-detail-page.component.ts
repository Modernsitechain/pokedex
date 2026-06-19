import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonSpinner, IonChip, IonLabel,
  IonButton, IonIcon
} from '@ionic/angular/standalone';
import { PokemonService } from '@core/services/pokemon/pokemon.service';
import { PokemonDetail } from '@core/interfaces/pokemon.interface';
import { addIcons } from 'ionicons';
import { heart, heartOutline, chevronBack, chevronForward } from 'ionicons/icons';

@Component({
  selector: 'app-pokemon-detail-page',
  templateUrl: './pokemon-detail-page.component.html',
  styleUrls: ['./pokemon-detail-page.component.scss'],
  imports: [
    IonContent, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonBackButton, IonSpinner, IonChip, IonLabel,
    IonButton, IonIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  public readonly pokemonService = inject(PokemonService);

  public readonly detail = signal<PokemonDetail | null>(null);
  public readonly loading = signal<boolean>(true);
  public readonly error = signal<boolean>(false);
  public readonly currentPokemon = signal<string>('');

  public readonly maxStat = 255;
  public readonly maxPokemonId = 1025; // batas atas saat ini di PokeAPI

  constructor() {
    addIcons({ heart, heartOutline, chevronBack, chevronForward });
    // paramMap observable: re-load otomatis saat prev/next mengubah :id
    this.route.paramMap.subscribe((params) => {
      const name = params.get('name');
      if (name) {
        this.currentPokemon.set(name);
        this.load(name);
      }
    });
  }

  private async load(name: string): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const data = await firstValueFrom(this.pokemonService.getPokemonDetail(name));
      this.detail.set(data);
    } catch {
      this.error.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  public goTo(id: number): void {
    if (id < 1 || id > this.maxPokemonId) return;
    this.router.navigate(['/pokemon', id]);
  }

  public statPercent(value: number): number {
    return Math.min(100, (value / this.maxStat) * 100);
  }

  public toggleFavorite(): void {
    const d = this.detail();
    if (!d) return;
    this.pokemonService.toggleFavorite({
      name: d.name,
      imageUrl: d.imageUrl,
    });
  }
}