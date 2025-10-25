import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AulaService, Aula, CrearAulaRequest } from '../../../services/aula.service';

@Component({
  selector: 'app-aulas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {
  aulaForm: FormGroup;
  nombreUsuario: string = 'Nombre de Usuario';
  rolUsuario: number = 0;
  aulas: Aula[] = [];
  mostrarFormulario = false;

  constructor(
    private fb: FormBuilder,
    private aulaService: AulaService,
    private router: Router
  ) {
    this.aulaForm = this.fb.group({
      salon: ['', [Validators.required, Validators.maxLength(10)]],
      capacidad: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  ngOnInit(): void {
    const nombre = sessionStorage.getItem('nombre');
    const rol = sessionStorage.getItem('rol');

    if (nombre) {
      this.nombreUsuario = nombre;
    }

    if (rol) {
      this.rolUsuario = Number(rol);
    }

    this.cargarAulas();
  }

  cargarAulas(): void {
    this.aulaService.obtenerAulas().subscribe({
      next: (data) => {
        this.aulas = data;
      },
      error: (error) => {
        console.error('Error al cargar aulas:', error);
      }
    });
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.aulaForm.reset();
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.aulaForm.reset();
  }

  guardarAula(): void {
        if (this.aulaForm.valid) {
            const nuevaAula = this.aulaForm.value;

            this.aulaService.crearAula(nuevaAula).subscribe({
            next: (respuesta) => {
                // Algunos backends no envían JSON, solo un 200 OK
                alert(respuesta?.mensaje || 'Aula creada correctamente');

                // 🔹 Cierra el formulario y limpia campos
                this.cerrarFormulario();

                // 🔹 Recarga la tabla
                this.cargarAulas();
            },
            error: (error) => {
                console.error('Error al crear aula:', error);
                alert(error.error?.mensaje || 'Error al registrar el aula');
            }
            });
        }
    }

    eliminarAula(salon: string): void {
        if (!confirm(`¿Está seguro de eliminar el salón ${salon}?`)) {
            return;
        }

        this.aulaService.eliminarAula(salon).subscribe({
            next: (response) => {
            if (response.status === 204) {
                alert('Aula eliminada correctamente.');
            } else {
                alert('Operación completada.');
            }

            // 🔄 recargar lista después de eliminar
            this.cargarAulas();
            },
            error: (error) => {
            console.error('Error al eliminar aula:', error);
            alert(error.error?.mensaje || 'Error al eliminar el aula.');
            }
        });
    }

  irInicio(): void {
    this.router.navigate(['/inicio']);
  }

  navegarAgregarCatedratico(): void {
    this.router.navigate(['/catedraticos']);
  }

  navegarAsignacion(): void {
    this.router.navigate(['/asignacion']);
  }

  navegarAulas(): void {
    this.router.navigate(['/aulas']);
  }

  navegarReportes(): void {
    this.router.navigate(['/reportes']);
  }

  cerrarSesion(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
