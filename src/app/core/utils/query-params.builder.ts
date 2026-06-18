// query-params.builder.ts
import { HttpParams } from '@angular/common/http';

export function buildHttpParams(params: Record<string, unknown>): HttpParams {
  let httpParams = new HttpParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      // append untuk repeated keys: ?fields=a&fields=b
      value.forEach((v) => {
        httpParams = httpParams.append(key, serialize(v));
      });
    } else if (typeof value === 'object') {
      // object kompleks → JSON string
      httpParams = httpParams.set(key, JSON.stringify(value));
    } else {
      httpParams = httpParams.set(key, String(value));
    }
  }

  return httpParams;
}

function serialize(value: unknown): string {
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}