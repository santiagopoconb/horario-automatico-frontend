import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AsignacionService, HorarioDetalle, DetalleSalon } from '../../../services/asignacion.service';

@Component({
  selector: 'app-asignacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {
  horarios: HorarioDetalle[] = [];
  nombreUsuario: string = 'Nombre de Usuario';
  rolUsuario: number = 0;
  salones: string[] = [];
  hayAsignaciones: boolean = false;
  cargando: boolean = false;
  mensajeError: string = '';

  constructor(
    private router: Router,
    private asignacionService: AsignacionService
  ) {}

  ngOnInit(): void {
    const nombre = sessionStorage.getItem('nombre');
    const rol = sessionStorage.getItem('rol');
    if (nombre) {
      this.nombreUsuario = nombre;
    }
    if (rol) {
    this.rolUsuario = Number(rol);
    }
    this.cargarAsignaciones();
  }

  cargarAsignaciones(): void {
    this.cargando = true;
    this.asignacionService.obtenerDetalleHorarios().subscribe({
      next: (response) => {
        if (response && response.horarios && response.horarios.length > 0) {
          this.horarios = response.horarios;
          this.extraerNombresSalones();
          this.hayAsignaciones = true;
        } else {
          this.hayAsignaciones = false;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar asignaciones:', error);
        this.hayAsignaciones = false;
        this.cargando = false;
      }
    });
  }

  extraerNombresSalones(): void {
    if (this.horarios.length > 0) {
      const primerHorario = this.horarios[0];
      this.salones = Object.keys(primerHorario.salones).sort();
    }
  }

  generarHorarios(): void {
    this.cargando = true;
    this.mensajeError = '';
    
    this.asignacionService.generarHorarios().subscribe({
      next: (response) => {
        console.log('Horarios generados exitosamente:', response);
        this.cargarAsignaciones();
      },
      error: (error) => {
        console.error('Error al generar horarios:', error);
        this.mensajeError = 'Error al generar los horarios. Intente nuevamente.';
        this.cargando = false;
      }
    });
  }

  obtenerAsignacion(hora: string, salon: string): DetalleSalon | null {
    const horario = this.horarios.find(h => h.hora === hora);
    if (horario && horario.salones[salon]) {
      return horario.salones[salon];
    }
    return null;
  }

  reiniciarHorarios(): void {
      if (!confirm('¿Está seguro de reiniciar todos los horarios? Esta acción no se puede deshacer.')) {
        return;
      }

      this.cargando = true;
      this.mensajeError = '';

      this.asignacionService.reiniciarHorarios().subscribe({
        next: (response) => {
          // Muestra el mensaje devuelto por el backend
          alert(response?.mensaje || 'Reinicio completado exitosamente.');

          // Recarga los datos
          this.cargarAsignaciones();
        },
        error: (error) => {
          console.error('Error al reiniciar horarios:', error);
          alert(error.error?.mensaje || 'Error al reiniciar los horarios.');
          this.cargando = false;
        }
      });
  }

  irInicio(): void {
    this.router.navigate(['/inicio']);
  }

  irAgregarEstudiante(): void {
    this.router.navigate(['/estudiantes/inscripcion']);
  }

  irCatedraticos(): void {
    this.router.navigate(['/catedraticos']);
  }

  irCursos(): void {
    this.router.navigate(['/cursos']);
  }

  irReportes(): void {
    this.router.navigate(['/reportes']);
  }

  navegarAulas(): void {
    this.router.navigate(['/aulas']);
  }

  cerrarSesion(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}