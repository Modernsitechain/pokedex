import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { alertCircleOutline, searchOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pokemon-empty-state',
  templateUrl: './pokemon-empty-state.component.html',
  styleUrls: ['./pokemon-empty-state.component.scss'],
  imports: [IonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonEmptyStateComponent {
  public readonly icon = input<string>('search-outline');
  public readonly title = input<string>('No Pokemon found');
  public readonly message = input<string>(
    'Try a different name or filter to find your Pokemon.',
  );

  constructor() {
    addIcons({ searchOutline, alertCircleOutline });
  }
}
