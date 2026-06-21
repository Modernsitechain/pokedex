import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PokemonDetailStat } from '@core/interfaces/pokemon.interface';

const POKEMON_BASE_STAT_MAX = 255;

@Component({
  selector: 'app-pokemon-detail-stats',
  templateUrl: './pokemon-detail-stats.component.html',
  styleUrls: ['./pokemon-detail-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailStatsComponent {
  public readonly stats = input.required<PokemonDetailStat[]>();

  public statPercent(value: number): number {
    return Math.min(100, (value / POKEMON_BASE_STAT_MAX) * 100);
  }
}