import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { buildHttpParams } from '@src/app/core/utils/query-params.builder';
import { environment } from '@src/environments/environment';

interface GetApiOptions {
  absoluteUrl?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.BASE_URL.POKEAPI;

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

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  }
}
