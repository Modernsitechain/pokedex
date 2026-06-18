import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  protected getApi<
    R,
    P extends Record<string, unknown> = Record<string, unknown>,
  >(endpoint: string, params?: P): Observable<R> {
    return this.http.get<R>(this.buildUrl(endpoint), {
      params: buildHttpParams(params ?? {}),
    });
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  }
}
