import { Component } from '@angular/core';
import { IonSkeletonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pokemon-item-skeleton',
  templateUrl: './pokemon-item-skeleton.component.html',
  imports: [IonSkeletonText],
  styleUrls: ['./pokemon-item-skeleton.component.scss'],
})
export class PokemonItemSkeletonComponent {}
