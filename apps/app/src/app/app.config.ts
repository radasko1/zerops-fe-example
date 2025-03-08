import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { CORE_EFFECTS, CORE_STATE } from './core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideAnimations(),
    provideEffects(),
    provideStore(),
    provideRouter(routes),
    provideHttpClient(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !process.env.Z_PRODUCTION,
    }),
    ...CORE_EFFECTS,
    ...CORE_STATE,
  ],
};
