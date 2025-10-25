import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/interceptor/auth.interceptor';
import { AuthGuard } from './app/auth.guard';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    AuthGuard,
    ...(appConfig.providers || [])
  ]
}).catch((err) => console.error(err));