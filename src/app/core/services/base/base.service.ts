import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { buildHttpParams } from '@src/app/core/utils/query-params.builder';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.BASE_URL.POKEAPI;

  /**
   * Sends a GET request to the PokeAPI.
   *
   * @param endpoint - relative path like `/pokemon`, or a full URL if `absoluteUrl` is true
   * @param params - query params (e.g. `{ limit: 20 }`)
   * @param options.absoluteUrl - use `endpoint` as a full URL
   */
  protected getApi<R, P = unknown>(
    endpoint: string,
    params?: P,
    options?: {
      absoluteUrl?: boolean;
    },
  ): Observable<R> {
    const isAbsoluteUrl = options?.absoluteUrl;
    const url = isAbsoluteUrl ? endpoint : this.buildUrl(endpoint);

    const httpParams = buildHttpParams(params ?? {});

    return this.http.get<R>(url, {
      params: httpParams,
    });
  }

  /** Joins baseUrl + endpoint into one URL, avoiding double slashes. */
  private buildUrl(endpoint: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  }
}