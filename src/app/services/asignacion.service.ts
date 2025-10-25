import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DetalleSalon {
  seccion: string;
  curso: string;
  profesor: string;
}

export interface HorarioSalones {
  [nombreSalon: string]: DetalleSalon | null;
}

export interface HorarioDetalle {
  hora: string;
  salones: HorarioSalones;
}

export interface ResponseHorarios {
  horarios: HorarioDetalle[];
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private apiUrl = environment.apiUrl; // Quitado el /app

  constructor(private http: HttpClient) {}

  generarHorarios(): Observable<any> {
    return this.http.post(`${this.apiUrl}/horarios`, {});
  }

  obtenerDetalleHorarios(): Observable<ResponseHorarios> {
    return this.http.get<ResponseHorarios>(`${this.apiUrl}/horarios/detalle-salon`);
  }

  obtenerAsignaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/app/asignaciones`);
  }

  obtenerAsignacionPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/app/asignaciones/${id}`);
  }

  obtenerAsignacionesPorAlumno(cuiAlumno: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/app/asignaciones/alumno/${cuiAlumno}`);
  }

  obtenerAsignacionesPorCiclo(ciclo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/app/asignaciones/ciclo/${ciclo}`);
  }

  reiniciarHorarios(): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl}/horarios/reiniciar`);
}
}