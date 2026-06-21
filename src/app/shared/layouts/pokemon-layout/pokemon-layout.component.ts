import {
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { listOutline, heartOutline, personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pokemon-layout',
  templateUrl: './pokemon-layout.component.html',
  styleUrls: ['./pokemon-layout.component.scss'],
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonLayoutComponent {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ listOutline, heartOutline, personCircleOutline });
  }
}
