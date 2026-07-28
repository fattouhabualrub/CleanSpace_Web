import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Base URL of the CleanSpace Admin API that serves the legal documents.
 * Dev default is the local Laravel server. For production set it without a
 * rebuild by adding to index.html BEFORE the app bundle:
 *   <script>window.__LEGAL_API_BASE__ = 'https://your-admin-domain';</script>
 */
export const LEGAL_API_BASE: string =
  (typeof window !== 'undefined' && (window as unknown as { __LEGAL_API_BASE__?: string }).__LEGAL_API_BASE__) ||
  'https://admin.cleaningspace.app';

export interface LegalDoc {
  type: string;
  requestedLocale: string;
  servedLocale: string;
  title: string | null;
  body: string | null;
  rtl: boolean;
  updatedAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class LegalService {
  private http = inject(HttpClient);

  /** Fetch a legal document (terms|privacy) for a locale; API falls back to English. */
  get(type: 'terms' | 'privacy', locale: string): Observable<LegalDoc> {
    return this.http.get<LegalDoc>(`${LEGAL_API_BASE}/api/legal/${type}/${encodeURIComponent(locale)}`);
  }
}
