import { ChangeDetectionStrategy, Component, contentChild, input } from '@angular/core';
import { IonItem, IonLabel, IonThumbnail } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { PokemonItem } from '@core/interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-item',
  templateUrl: './pokemon-item.component.html',
  styleUrls: ['./pokemon-item.component.scss'],
  imports: [IonItem, IonLabel, IonThumbnail, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonItemComponent {
  public readonly pokemon = input.required<PokemonItem>();

   public readonly actionsSlot = contentChild('actionsRef');
}
