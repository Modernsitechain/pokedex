import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { PokemonDetailAbility } from '@core/interfaces/pokemon.interface';
import { ChipComponent } from '@src/app/shared/components/chip/chip.component';

@Component({
  selector: 'app-pokemon-detail-abilities',
  templateUrl: './pokemon-detail-abilities.component.html',
  styleUrls: ['./pokemon-detail-abilities.component.scss'],
  imports: [ChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailAbilitiesComponent {
  public readonly abilities = input.required<PokemonDetailAbility[]>();
}