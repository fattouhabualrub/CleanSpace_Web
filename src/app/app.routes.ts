import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';
import { LegalPageComponent } from './pages/legal-page';
import { SupportPageComponent } from './pages/support';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'support', component: SupportPageComponent },
  { path: 'terms', component: LegalPageComponent, data: { type: 'terms' } },
  { path: 'privacy', component: LegalPageComponent, data: { type: 'privacy' } },
  { path: '**', redirectTo: '' },
];
