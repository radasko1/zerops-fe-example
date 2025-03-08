import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppFeature } from './app/app.feature';

bootstrapApplication(AppFeature, appConfig).catch((err) => console.error(err));
