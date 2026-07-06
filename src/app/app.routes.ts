import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';
import { TermsComponent } from './pages/terms';
import { PrivacyComponent } from './pages/privacy';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: '**', redirectTo: '' },
];
