import { Injectable } from '@angular/core';
import { LocalStorageKeyEnum } from '@core/enums/local-storage-key.enum';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  /**
   * Sets a key in the local storage
   */
  public set(key: LocalStorageKeyEnum, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Gets a item out of the local storage
   */
  public get<T>(key: LocalStorageKeyEnum): T | undefined {
    const value = localStorage.getItem(key);

    switch (value?.toLocaleLowerCase()) {
      case 'true':
        return true as unknown as T;
      case 'false':
        return false as unknown as T;
      default:
        return value ? (JSON.parse(value) as T) : undefined;
    }
  }

  /**
   * Removes a key from the local storage
   */
  public remove(key: LocalStorageKeyEnum): void {
    localStorage.removeItem(key);
  }

  /**
   * Clears the whole local storage
   */
  public clear(): void {
    localStorage.clear();
  }
}
