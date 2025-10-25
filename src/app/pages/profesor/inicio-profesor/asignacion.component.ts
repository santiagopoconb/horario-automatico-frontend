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
  nombreUsuario: string = '';
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

    if (nombre) this.nombreUsuario = nombre;
    if (rol) this.rolUsuario = Number(rol);

    this.cargarAsignaciones();
  }

    cargarAsignaciones(): void {
    this.cargando = true;

    this.asignacionService.obtenerDetalleHorarios().subscribe({
        next: (response) => {
        if (response?.horarios?.length > 0) {
            const nombreFiltro = this.nombreUsuario.trim().toLowerCase();

            // Mantener todas las horas y salones, pero solo mostrar datos del profesor
            this.horarios = response.horarios.map((horario) => {
            const salonesFiltrados: { [nombreSalon: string]: DetalleSalon | null } = {};

            Object.entries(horario.salones).forEach(([nombreSalon, detalle]) => {
                if (detalle && detalle.profesor?.trim().toLowerCase().includes(nombreFiltro)) {
                // Coincide el profesor → mantener detalle completo
                salonesFiltrados[nombreSalon] = detalle;
                } else {
                // No coincide → mostrar celda vacía
                salonesFiltrados[nombreSalon] = null;
                }
            });

            return {
                hora: horario.hora,
                salones: salonesFiltrados
            };
            });

            // Extraer los nombres de los salones (usando el primer horario)
            this.salones = Object.keys(this.horarios[0].salones).sort();

            // Determinar si hay al menos una asignación real
            this.hayAsignaciones = this.horarios.some(h =>
            Object.values(h.salones).some(detalle => detalle !== null)
            );
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

  obtenerAsignacion(hora: string, salon: string): DetalleSalon | null {
    const horario = this.horarios.find(h => h.hora === hora);
    if (horario && horario.salones[salon]) {
      return horario.salones[salon];
    }
    return null;
  }

  irInicio(): void { this.router.navigate(['/inicio-profesor']); }
  //irAgregarEstudiante(): void { this.router.navigate(['/estudiantes/inscripcion']); }
  //irCatedraticos(): void { this.router.navigate(['/catedraticos']); }
  irReportes(): void { this.router.navigate(['/reporte-profesor']); }
  cerrarSesion(): void { sessionStorage.clear(); this.router.navigate(['/login']); }
}
