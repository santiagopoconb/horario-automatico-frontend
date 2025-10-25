import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EstadisticasService, Estadisticas, EstadisticasAula } from '../../services/estadisticas.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  nombreUsuario: string = 'Nombre de Usuario';
  rolUsuario: number = 0;
  estadisticas: Estadisticas | null = null;
  estadisticasAulas: EstadisticasAula[] = [];
  cargando: boolean = true;
  error: string = '';

  constructor(
    private router: Router,
    private estadisticasService: EstadisticasService
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
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando = true;
    forkJoin({
      inicio: this.estadisticasService.obtenerEstadisticasInicio(),
      aulas: this.estadisticasService.obtenerEstadisticasAulas()
    }).subscribe({
      next: (data) => {
        this.estadisticas = data.inicio;
        this.estadisticasAulas = data.aulas;
        console.log('Estadísticas de aulas:', this.estadisticasAulas); // DEBUG
        console.log('¿Tiene asignaciones?', this.tieneAsignaciones()); // DEBUG
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar estadísticas:', err);
        this.error = 'Error al cargar las estadísticas';
        this.cargando = false;
      }
    });
  }

  calcularPorcentaje(valor: number, total: number): number {
    return total > 0 ? (valor / total) * 100 : 0;
  }

  tieneAsignaciones(): boolean {
    return this.estadisticasAulas.length > 0;
  }

  navegarAgregarEstudiante(): void {
    this.router.navigate(['/estudiantes/inscripcion']);
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