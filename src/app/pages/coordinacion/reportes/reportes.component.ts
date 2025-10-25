import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReportesService, AlumnoReporte, ReporteSalon, PaginacionResponse } from '../../../services/reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  nombreUsuario: string = 'Administrador';
  rolUsuario: number = 0;
  
  // Control de vista
  vistaSeleccionada: 'menu' | 'alumnos' | 'salones' = 'menu';
  
  // Datos de Reporte de Alumnos
  alumnosReporte: AlumnoReporte[] = [];
  paginaActualAlumnos: number = 0;
  totalPaginasAlumnos: number = 1;
  totalElementosAlumnos: number = 0;
  
  // Datos de Reporte de Alumnos por Salón
  salonesReporte: ReporteSalon[] = [];
  paginaActualSalones: number = 0;
  totalPaginasSalones: number = 1;
  totalElementosSalones: number = 0;
  
  cargando: boolean = false;
  error: string = '';

  constructor(
    private reportesService: ReportesService,
    private router: Router
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
  }

  // Navegación del menú lateral
  navegarInicio(): void {
    this.router.navigate(['/inicio']);
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

  navegarCursos(): void {
    this.router.navigate(['/cursos']);
  }

  navegarReportes(): void {
    this.router.navigate(['/reportes']);
  }

  navegarAulas(): void {
    this.router.navigate(['/aulas']);
  }

  cerrarSesion(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  // Selección de reportes
  seleccionarReporte(tipo: 'alumnos' | 'salones'): void {
    this.vistaSeleccionada = tipo;
    this.error = '';
    
    if (tipo === 'alumnos') {
      this.cargarReporteAlumnos(0);
    } else if (tipo === 'salones') {
      this.cargarReporteSalones(0);
    }
  }

  volverAlMenu(): void {
    this.vistaSeleccionada = 'menu';
    this.alumnosReporte = [];
    this.salonesReporte = [];
  }

  // Reporte de Alumnos
  cargarReporteAlumnos(pagina: number): void {
    this.cargando = true;
    this.error = '';

    this.reportesService.obtenerReporteAlumnos(pagina, 20).subscribe({
      next: (response: PaginacionResponse<AlumnoReporte>) => {
        this.alumnosReporte = response.content || [];
        this.paginaActualAlumnos = response.page?.number || 0;
        this.totalPaginasAlumnos = response.page?.totalPages || 1;
        this.totalElementosAlumnos = response.page?.totalElements || 0;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el reporte de alumnos';
        console.error('Error:', err);
        this.cargando = false;
        // Inicializar valores por defecto en caso de error
        this.alumnosReporte = [];
        this.paginaActualAlumnos = 0;
        this.totalPaginasAlumnos = 1;
        this.totalElementosAlumnos = 0;
      }
    });
  }

  anteriorPaginaAlumnos(): void {
    if (this.paginaActualAlumnos > 0) {
      this.cargarReporteAlumnos(this.paginaActualAlumnos - 1);
    }
  }

  siguientePaginaAlumnos(): void {
    if (this.paginaActualAlumnos < this.totalPaginasAlumnos - 1) {
      this.cargarReporteAlumnos(this.paginaActualAlumnos + 1);
    }
  }

  descargarExcelAlumnos(): void {
    this.reportesService.descargarExcelAlumnos().subscribe({
      next: (blob) => {
        this.descargarArchivo(blob, 'reporte_alumnos.xlsx');
      },
      error: (err) => {
        this.error = 'Error al descargar Excel de alumnos';
        console.error('Error:', err);
      }
    });
  }

  descargarPdfAlumnos(): void {
    this.reportesService.descargarPdfAlumnos().subscribe({
      next: (blob) => {
        this.descargarArchivo(blob, 'reporte_alumnos.pdf');
      },
      error: (err) => {
        this.error = 'Error al descargar PDF de alumnos';
        console.error('Error:', err);
      }
    });
  }

  // Reporte de Alumnos por Salón
  cargarReporteSalones(pagina: number): void {
    this.cargando = true;
    this.error = '';

    this.reportesService.obtenerReporteAlumnosPorSalon(pagina, 20).subscribe({
      next: (response: PaginacionResponse<ReporteSalon>) => {
        this.salonesReporte = response.content || [];
        this.paginaActualSalones = response.page?.number || 0;
        this.totalPaginasSalones = response.page?.totalPages || 1;
        this.totalElementosSalones = response.page?.totalElements || 0;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el reporte de alumnos por salón';
        console.error('Error:', err);
        this.cargando = false;
        // Inicializar valores por defecto en caso de error
        this.salonesReporte = [];
        this.paginaActualSalones = 0;
        this.totalPaginasSalones = 1;
        this.totalElementosSalones = 0;
      }
    });
  }

  anteriorPaginaSalones(): void {
    if (this.paginaActualSalones > 0) {
      this.cargarReporteSalones(this.paginaActualSalones - 1);
    }
  }

  siguientePaginaSalones(): void {
    if (this.paginaActualSalones < this.totalPaginasSalones - 1) {
      this.cargarReporteSalones(this.paginaActualSalones + 1);
    }
  }

  descargarExcelSalones(): void {
    this.reportesService.descargarExcelAlumnosSalon().subscribe({
      next: (blob) => {
        this.descargarArchivo(blob, 'reporte_alumnos_salon.xlsx');
      },
      error: (err) => {
        this.error = 'Error al descargar Excel de alumnos por salón';
        console.error('Error:', err);
      }
    });
  }

  descargarPdfSalones(): void {
    this.reportesService.descargarPdfAlumnosSalon().subscribe({
      next: (blob) => {
        this.descargarArchivo(blob, 'reporte_alumnos_salon.pdf');
      },
      error: (err) => {
        this.error = 'Error al descargar PDF de alumnos por salón';
        console.error('Error:', err);
      }
    });
  }

  // Método auxiliar para descargar archivos
  private descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // Método para calcular correlativo
  obtenerCorrelativo(index: number): number {
    if (this.vistaSeleccionada === 'alumnos') {
      return (this.paginaActualAlumnos * 20) + index + 1;
    } else if (this.vistaSeleccionada === 'salones') {
      return (this.paginaActualSalones * 20) + index + 1;
    }
    return index + 1;
  }

  obtenerCorrelativoAlumnoSalon(salonIndex: number, alumnoIndex: number): number {
    // El correlativo se reinicia en cada salón, simplemente devuelve el índice + 1
    return alumnoIndex + 1;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}