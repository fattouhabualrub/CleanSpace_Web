import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { HeaderComponent } from './components/header';
import { FooterComponent } from './components/footer';
import { I18n } from './services/i18n';
import { toLangCode } from './services/lang-route';
import { SeoService } from './core/seo/seo.service';
import { StructuredDataService } from './core/seo/structured-data.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  // Constructing the service applies the saved language + document direction.
  readonly i18n = inject(I18n);

  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly jsonLd = inject(StructuredDataService);

  constructor() {
    // Head tags are rewritten per navigation, and once up front so the very
    // first (prerendered) render carries them.
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => {
        const path = pagePath(this.router.url);
        this.seo.update(path);
        this.jsonLd.update(path);
      });
  }
}

/** '/ar/download?x=1#y' → 'download'; '/en' → ''. The language segment is dropped
 *  because the SEO services re-add it for each alternate. */
function pagePath(url: string): string {
  const segments = url.split(/[?#]/)[0].split('/').filter(Boolean);
  if (toLangCode(segments[0])) segments.shift();
  return segments.join('/');
}
