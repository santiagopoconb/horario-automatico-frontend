import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EstudianteService } from '../../../services/estudiante.service';

@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.css']
})
export class InscripcionComponent implements OnInit {
  formularioEstudiante: FormGroup;
  nombreUsuario: string = 'Nombre de Usuario';
  modoInscripcion: 'individual' | 'masivo' = 'masivo';
  archivoSeleccionado: File | null = null;
  nombreArchivo: string = '';
  guardando: boolean = false;
  mensaje: { texto: string; tipo: 'success' | 'error' } | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private estudianteService: EstudianteService
  ) {
    this.formularioEstudiante = this.fb.group({
      cuiAlumno: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      nombreAlumno: ['', [Validators.required, Validators.maxLength(30)]],
      apellidosAlumno: ['', [Validators.required, Validators.maxLength(30)]],
      genero: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const nombre = sessionStorage.getItem('nombre');
    if (nombre) {
      this.nombreUsuario = nombre;
    }
  }

  guardarEstudiante(): void {
    if (this.formularioEstudiante.valid) {
      this.guardando = true;
      
      const estudiante = {
        ...this.formularioEstudiante.value,
        estado: 1
      };

      this.estudianteService.inscribirEstudiante(estudiante).subscribe({
        next: (response) => {
          this.mostrarMensaje('Estudiante inscrito exitosamente', 'success');
          this.formularioEstudiante.reset();
          this.guardando = false;
        },
        error: (error) => {
          this.mostrarMensaje('Error al inscribir estudiante', 'error');
          this.guardando = false;
        }
      });
    }
  }

  cargarArchivo(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      this.archivoSeleccionado = archivo;
      this.nombreArchivo = archivo.name;
      this.mostrarMensaje('Archivo seleccionado correctamente', 'success');
    }
  }

  guardarMasivo(): void {
    if (!this.archivoSeleccionado) {
      this.mostrarMensaje('Debe seleccionar un archivo Excel', 'error');
      return;
    }

    this.guardando = true;
    this.estudianteService.inscripcionMasiva(this.archivoSeleccionado).subscribe({
      next: (response) => {
        this.mostrarMensaje(
          `Inscripción masiva completada exitosamente`,
          'success'
        );
        this.limpiarArchivo();
        this.guardando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error en inscripción masiva: ' + (error.error?.message || error.message), 'error');
        this.guardando = false;
      }
    });
  }

  limpiarArchivo(): void {
    this.nombreArchivo = '';
    this.archivoSeleccionado = null;
  }

  private mostrarMensaje(texto: string, tipo: 'success' | 'error'): void {
    this.mensaje = { texto, tipo };
    setTimeout(() => {
      this.mensaje = null;
    }, 4000);
  }

  cerrarSesion(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}