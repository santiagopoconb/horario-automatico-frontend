import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../src/app/services/auth.service'; // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    // Usar el método isAuthenticated que ahora valida la expiración
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      console.warn('🚫 Acceso denegado: Token inválido o expirado');
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }
}