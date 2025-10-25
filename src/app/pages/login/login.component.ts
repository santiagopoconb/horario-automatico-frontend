import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  mostrarPassword: boolean = false;
  cargando: boolean = false;
  errorMensaje: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit(): void {
    // Limpiar mensaje de error
    this.errorMensaje = '';

    // Validar campos vacíos
    if (!this.usuario.trim() || !this.password.trim()) {
      this.errorMensaje = 'Por favor, complete todos los campos';
      return;
    }

    this.cargando = true;

    const credentials: LoginRequest = {
      usuario: this.usuario,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.cargando = false;
        
        // Navegar según el rol
        switch (response.rol) {
          case 1:
            this.router.navigate(['/inicio']);
            break;
          case 2:
            this.router.navigate(['/inicio-profesor']);
            break;
          case 3:
            this.router.navigate(['/inicio']);
            break;
          default:
            this.errorMensaje = 'Rol no válido';
            this.authService.logout();
        }
      },
      error: (error) => {
        this.cargando = false;
        console.error('Error en login:', error);
        
        if (error.status === 401) {
          this.errorMensaje = 'Usuario o contraseña incorrectos';
        } else if (error.status === 0) {
          this.errorMensaje = 'No se pudo conectar con el servidor';
        } else {
          this.errorMensaje = 'Error al iniciar sesión. Intente nuevamente';
        }
      }
    });
  }
}