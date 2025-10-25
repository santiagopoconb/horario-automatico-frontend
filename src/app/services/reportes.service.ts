import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment';

export interface AlumnoReporte {
  carne: string;
  nombreCompleto: string;
  estado: string;
  fechaInscripcion: string;
}

export interface AlumnoSalon {
  carne: string;
  nombreCompleto: string;
}

export interface ReporteSalon {
  nombreSalon: string;
  alumnos: AlumnoSalon[];
}

export interface PaginacionResponse<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerReporteAlumnos(page: number = 0, size: number = 20): Observable<PaginacionResponse<AlumnoReporte>> {
    return this.http.get<PaginacionResponse<AlumnoReporte>>(
      `${this.apiUrl}/inscripciones/alumnos?page=${page}&size=${size}`
    );
  }

  descargarExcelAlumnos(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/inscripciones/alumnos/excel`, {
      responseType: 'blob'
    });
  }

  descargarPdfAlumnos(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/inscripciones/alumnos/pdf`, {
      responseType: 'blob'
    });
  }

  obtenerReporteAlumnosPorSalon(page: number = 0, size: number = 20): Observable<PaginacionResponse<ReporteSalon>> {
    return this.http.get<PaginacionResponse<ReporteSalon>>(
      `${this.apiUrl}/reportes/alumnos-salon?page=${page}&size=${size}`
    );
  }

  descargarExcelAlumnosSalon(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reportes/alumnos-salon-excel`, {
      responseType: 'blob'
    });
  }

  descargarPdfAlumnosSalon(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/reportes/alumnos-salon-pdf`, {
      responseType: 'blob'
    });
  }
}