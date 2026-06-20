import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import {
  IonButton, IonButtons, IonIcon, IonPopover,
  IonContent, IonList, IonItem, IonLabel, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { filter as filterIcon } from 'ionicons/icons';
import { firstValueFrom } from 'rxjs';
import { PokemonService } from '@core/services/pokemon/pokemon.service';

@Component({
  selector: 'app-pokemon-filter-button',
  templateUrl: './pokemon-filter-button.component.html',
  styleUrls: ['./pokemon-filter-button.component.scss'],
  imports: [
    IonButton, IonButtons, IonIcon, IonPopover,
    IonContent, IonList, IonItem, IonLabel, IonSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonFilterButtonComponent {
  private readonly pokemonService = inject(PokemonService);

  public readonly selectedType = model<string>('');

  public readonly types = signal<string[]>([]);
  public readonly loading = signal<boolean>(false);

  constructor() {
    addIcons({ filter: filterIcon });
    void this.loadTypes();
  }

  public select(type: string): void {
    this.selectedType.set(type);
  }

  private async loadTypes(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await firstValueFrom(this.pokemonService.getTypes());
      this.types.set(data);
    } catch {
      this.types.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}