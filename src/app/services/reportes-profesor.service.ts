import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment';

export interface Alumno {
  carne: string;
  nombreCompleto: string;
}

export interface SalonReporte {
  nombreSalon: string;
  alumnos: Alumno[];
}

export interface Paginacion {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface ReporteResponse {
  content: SalonReporte[];
  page: Paginacion;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteProfesorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerReporte(cui: string, page = 0, size = 10): Observable<ReporteResponse> {
    return this.http.get<ReporteResponse>(
      `${this.apiUrl}/reportes-profesor?cuiProfesor=${cui}&page=${page}&size=${size}`
    );
  }

  descargarExcel(cui: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/reportes-profesor/excel?cuiProfesor=${cui}`,
      { responseType: 'blob' }
    );
  }

  descargarPdf(cui: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/reportes-profesor/pdf?cuiProfesor=${cui}`,
      { responseType: 'blob' }
    );
  }
}
