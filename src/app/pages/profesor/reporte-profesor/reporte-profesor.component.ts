import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReporteProfesorService, SalonReporte } from '../../../services/reportes-profesor.service';

@Component({
  selector: 'app-reporte-profesor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reporte-profesor.component.html',
  styleUrls: ['./reporte-profesor.component.css']
})
export class ReporteProfesorComponent implements OnInit {
  nombreUsuario = '';
  cuiProfesor = '';
  cargando = false;
  error = '';
  salones: SalonReporte[] = [];

  paginaActual = 0;
  totalPaginas = 1;
  totalElementos = 0;
  size = 10;

  constructor(private srv: ReporteProfesorService, private router: Router) {}

  ngOnInit(): void {
    this.nombreUsuario = sessionStorage.getItem('nombre') || 'Profesor';
    this.cuiProfesor = sessionStorage.getItem('cui') || '';

    if (!this.cuiProfesor) {
      this.error = 'No se encontró el CUI del profesor en sessionStorage.';
      return;
    }
    this.cargarReporte(0);
  }

  cargarReporte(page: number): void {
    this.cargando = true;
    this.error = '';

    this.srv.obtenerReporte(this.cuiProfesor, page, this.size).subscribe({
      next: (data) => {
        this.salones = data.content;
        this.paginaActual = data.page.number;
        this.totalPaginas = data.page.totalPages;
        this.totalElementos = data.page.totalElements;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar el reporte del profesor.';
        this.cargando = false;
      }
    });
  }

  anteriorPagina(): void {
    if (this.paginaActual > 0) this.cargarReporte(this.paginaActual - 1);
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas - 1) this.cargarReporte(this.paginaActual + 1);
  }

  descargarExcel(): void {
    this.srv.descargarExcel(this.cuiProfesor).subscribe({
      next: (blob) => this.descargarArchivo(blob, 'reporte_profesor.xlsx'),
      error: (err) => (this.error = 'Error al descargar Excel.')
    });
  }

  descargarPdf(): void {
    this.srv.descargarPdf(this.cuiProfesor).subscribe({
      next: (blob) => this.descargarArchivo(blob, 'reporte_profesor.pdf'),
      error: (err) => (this.error = 'Error al descargar PDF.')
    });
  }

  private descargarArchivo(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  // Menú lateral
  //navegarInicio()           { this.router.navigate(['/inicio-profesor']); }
  //navegarAgregarEstudiante(){ this.router.navigate(['/estudiantes/inscripcion']); }
  //navegarAgregarCatedratico(){ this.router.navigate(['/catedraticos']); }
  navegarAsignacion()       { this.router.navigate(['/inicio-profesor']); }
  navegarReportes()         { this.router.navigate(['/reporte-profesor']); }
  cerrarSesion(): void { sessionStorage.clear(); this.router.navigate(['/login']); }

  correlativo(alumnoIndex: number): number {
    return alumnoIndex + 1;
  }
}
