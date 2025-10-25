import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const token = authService.getToken();

  // Si hay token y NO es la ruta de login
  if (token && !req.url.includes('/login')) {
    // Verificar si el token es válido antes de enviarlo
    if (!authService.isAuthenticated()) {
      console.warn('⚠️ Token expirado detectado en interceptor');
      authService.logout();
      return throwError(() => new Error('Token expirado'));
    }

    // Agregar token a la petición
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      console.error('❌ Error HTTP:', error.status, error.url);

      // Si es 401 o 403 y NO es login, cerrar sesión
      if ((error.status === 401 || error.status === 403) && !req.url.includes('/login')) {
        console.error('🚨 Error de autenticación - Cerrando sesión');
        authService.logout();
      }

      return throwError(() => error);
    })
  );
};