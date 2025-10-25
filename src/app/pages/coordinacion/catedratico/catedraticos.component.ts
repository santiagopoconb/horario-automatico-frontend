import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfesorService, Profesor, Profesion, ProfesorRequest } from '../../../services/catedratico.service';

@Component({
  selector: 'app-catedraticos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './catedraticos.component.html',
  styleUrls: ['./catedraticos.component.css']
})
export class CatedraticosComponent implements OnInit {
  profesorForm: FormGroup;
  nombreUsuario: string = 'Nombre de Usuario';
  rolUsuario: number = 0;
  profesores: Profesor[] = [];
  profesiones: Profesion[] = [];
  mostrarFormulario = false;
  cursosExpandidos: { [key: string]: { visible: boolean, cursos: string[], cargando: boolean } } = {};

  constructor(
    private fb: FormBuilder,
    private profesorService: ProfesorService,
    private router: Router
  ) {
    this.profesorForm = this.fb.group({
      cuiProfesor: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      nombreProfesor: ['', [Validators.required, Validators.maxLength(30)]],
      apellidosProfesor: ['', [Validators.required, Validators.maxLength(30)]],
      profesion: ['', Validators.required],
      horasMinimas: ['', [Validators.required, Validators.min(2), Validators.max(4)]],
      horasMaximas: ['', [Validators.required, Validators.min(2), Validators.max(4)]]
    });
  }

  ngOnInit(): void {
    const nombre = sessionStorage.getItem('nombre');
    const rol = sessionStorage.getItem('rol')
    if (nombre) {
      this.nombreUsuario = nombre;
    }
    
    if (rol) {
    this.rolUsuario = Number(rol);
    }
    this.cargarProfesores();
    this.cargarProfesiones();
  }

  cargarProfesores(): void {
    this.profesorService.obtenerProfesores().subscribe({
      next: (data) => {
        this.profesores = data;
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
      }
    });
  }

  cargarProfesiones(): void {
    this.profesorService.obtenerProfesiones().subscribe({
      next: (data) => {
        this.profesiones = data;
      },
      error: (error) => {
        console.error('Error al cargar profesiones:', error);
      }
    });
  }

  toggleCursos(cuiProfesor: string): void {
    if (!this.cursosExpandidos[cuiProfesor]) {
      this.cursosExpandidos[cuiProfesor] = { visible: true, cursos: [], cargando: true };
      
      this.profesorService.obtenerCursosAsignados(cuiProfesor).subscribe({
        next: (data) => {
          this.cursosExpandidos[cuiProfesor].cursos = data.cursosAsignados;
          this.cursosExpandidos[cuiProfesor].cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar cursos:', error);
          this.cursosExpandidos[cuiProfesor].cursos = [];
          this.cursosExpandidos[cuiProfesor].cargando = false;
        }
      });
    } else {
      this.cursosExpandidos[cuiProfesor].visible = !this.cursosExpandidos[cuiProfesor].visible;
    }
  }

  estaCursosVisible(cuiProfesor: string): boolean {
    return this.cursosExpandidos[cuiProfesor]?.visible || false;
  }

  obtenerCursos(cuiProfesor: string): string[] {
    return this.cursosExpandidos[cuiProfesor]?.cursos || [];
  }

  estaCargandoCursos(cuiProfesor: string): boolean {
    return this.cursosExpandidos[cuiProfesor]?.cargando || false;
  }

  abrirFormulario(): void {
    this.mostrarFormulario = true;
    this.profesorForm.reset();
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.profesorForm.reset();
  }

  guardarProfesor(): void {
    if (this.profesorForm.valid) {
      const profesor: ProfesorRequest = this.profesorForm.value;
      
      this.profesorService.guardarProfesor(profesor).subscribe({
        next: () => {
          this.cargarProfesores();
          this.cerrarFormulario();
          alert('Catedrático registrado exitosamente');
        },
        error: (error) => {
          console.error('Error al guardar profesor:', error);
          alert('Error al registrar catedrático');
        }
      });
    }
  }

  irInicio(): void {
    this.router.navigate(['/inicio']);
  }

  navegarAgregarEstudiante() {
    this.router.navigate(['/estudiantes/inscripcion']);
  }

  navegarAsignacion() {
    this.router.navigate(['/asignacion']);
  }

  navegarReportes(): void {
    this.router.navigate(['/reportes']);
  }

  cerrarSesion(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  navegarAulas(): void {
    this.router.navigate(['/aulas']);
  }

  
  eliminarProfesor(cuiProfesor: string): void {
      if (!confirm('¿Está seguro de eliminar este profesor?')) {
        return;
      }

      this.profesorService.eliminarProfesor(cuiProfesor).subscribe({
          next: (respuesta) => {
            // Si la respuesta es exitosa (HTTP 200)
            alert(respuesta.mensaje || 'Operación completada.');

            if (respuesta.exitoso === true) {
              this.cargarProfesores();
            }
          this.cargarProfesores();
          },
          error: (error) => {
            console.error('Error al eliminar profesor:', error);

            // Si el backend envía un mensaje en el cuerpo del error (por ejemplo 409)
            if (error.status === 409 && error.error?.mensaje) {
              alert(error.error.mensaje);
            } else if (error.error?.mensaje) {
              alert(error.error.mensaje);
            } else {
              alert('Error al eliminar profesor.');
            }
          }
        });
  }

}