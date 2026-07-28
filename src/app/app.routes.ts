import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';
import { LegalPageComponent } from './pages/legal-page';
import { SupportPageComponent } from './pages/support';
import { DownloadPageComponent } from './pages/download';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'download', component: DownloadPageComponent },
  // Short alias for QR codes / bio links.
  { path: 'get', redirectTo: 'download' },
  { path: 'support', component: SupportPageComponent },
  { path: 'terms', component: LegalPageComponent, data: { type: 'terms' } },
  { path: 'privacy', component: LegalPageComponent, data: { type: 'privacy' } },
  { path: '**', redirectTo: '' },
];
