import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  alertCircleOutline,
  informationCircleOutline,
  close,
} from 'ionicons/icons';

type ToastColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'medium'
  | 'dark';

interface ToastOptions {
  message: string;
  duration?: number;
  color?: ToastColor;
  icon?: string;
  position?: 'top' | 'bottom' | 'middle';
}

/**
 * Centralised service for showing toast (snackbar) notifications.
 *
 * Provides ready-made helpers for the common cases (`success`, `error`,
 * `info`) plus a fully customisable `show` method. Registers its own icons,
 * so callers only need to provide a message.
 *
 * @example
 * this.toastService.success('Saved successfully');
 * this.toastService.error('Something went wrong');
 * this.toastService.show({ message: 'Custom', color: 'primary', position: 'top' });
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastController = inject(ToastController);

  constructor() {
    addIcons({
      checkmarkCircleOutline,
      alertCircleOutline,
      informationCircleOutline,
      close,
    });
  }

  /**
   * Shows a success toast (green) with a checkmark icon.
   * @param message - the text to display
   */
  public async success(message: string): Promise<void> {
    await this.show({
      message,
      color: 'success',
      icon: 'checkmark-circle-outline',
    });
  }

  /**
   * Shows an error toast (red) with an alert icon and a longer duration,
   * giving the user more time to read the message.
   * @param message - the text to display
   */
  public async error(message: string): Promise<void> {
    await this.show({
      message,
      color: 'danger',
      icon: 'alert-circle-outline',
      duration: 2500,
    });
  }

  /**
   * Shows a neutral informational toast (grey) with an info icon.
   * @param message - the text to display
   */
  public async info(message: string): Promise<void> {
    await this.show({
      message,
      color: 'medium',
      icon: 'information-circle-outline',
    });
  }

  /**
   * Shows a fully customisable toast. Used internally by the helper methods,
   * but can be called directly when you need control over colour, position,
   * duration, or icon.
   * @param options - the toast configuration
   */
  public async show(options: ToastOptions): Promise<void> {
    const toast = await this.toastController.create({
      message: options.message,
      duration: options.duration ?? 1800,
      position: options.position ?? 'bottom',
      color: options.color ?? 'dark',
      icon: options.icon,
      buttons: [{ icon: 'close', role: 'cancel' }],
    });
    await toast.present();
  }

  /**
   * Dismisses the currently visible toast, if any.
   * Safely ignores the error thrown when no toast is active.
   */
  public async dismissAll(): Promise<void> {
    await this.toastController.dismiss().catch(() => undefined);
  }
}
