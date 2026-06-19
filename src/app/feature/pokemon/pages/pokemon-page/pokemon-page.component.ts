import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pokemon-page',
  templateUrl: './pokemon-page.component.html',
  styleUrls: ['./pokemon-page.component.scss'],
  imports: [IonContent, IonHeader, IonToolbar, IonTitle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonPageComponent {}
