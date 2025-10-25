import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  jwtToken: string;
  usuario: string;
  nombreUsuario: string;
  rol: number;
  cui: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, { headers })
      .pipe(
        tap(response => {
          sessionStorage.setItem('token', response.jwtToken);
          sessionStorage.setItem('usuario', response.usuario);
          sessionStorage.setItem('nombre', response.nombreUsuario);
          sessionStorage.setItem('rol', response.rol.toString());
          sessionStorage.setItem('cui', response.cui);
        })
      );
  }

  logout(): void {
    console.log('🚪 Cerrando sesión...');
    sessionStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUsuario(): string | null {
    return sessionStorage.getItem('usuario');
  }

  getNombre(): string | null {
    return sessionStorage.getItem('nombre');
  }

  getRol(): number | null {
    const rol = sessionStorage.getItem('rol');
    return rol ? parseInt(rol, 10) : null;
  }

  /**
   * ✅ Verifica si el usuario está autenticado Y si el token es válido
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }

    return this.isTokenValid(token);
  }

  /**
   * ✅ Valida si el token JWT no ha expirado (SIN jwt-decode)
   */
  private isTokenValid(token: string): boolean {
    try {
      // Decodificar manualmente el JWT
      const payload = this.decodeToken(token);
      
      if (!payload || !payload.exp) {
        console.warn('⚠️ Token no tiene fecha de expiración');
        return false;
      }

      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp < currentTime) {
        console.warn('⚠️ Token expirado');
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error al validar el token:', error);
      return false;
    }
  }

  /**
   * ✅ Decodifica el JWT manualmente (sin librerías externas)
   */
  private decodeToken(token: string): any {
    try {
      // Un JWT tiene 3 partes separadas por puntos: header.payload.signature
      const parts = token.split('.');
      
      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }

      // Decodificar el payload (segunda parte)
      const payload = parts[1];
      
      // Decodificar de Base64URL a JSON
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      
      return JSON.parse(decoded);
    } catch (error) {
      console.error('❌ Error al decodificar token:', error);
      return null;
    }
  }

  /**
   * ✅ Verifica si el token está expirado
   */
  checkTokenExpiration(): void {
    if (!this.isAuthenticated()) {
      console.warn('⚠️ Token expirado o inválido detectado al cargar la app');
      this.logout();
    }
  }
}