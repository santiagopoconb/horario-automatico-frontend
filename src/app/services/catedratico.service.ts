import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../AppAsignacionFrontend/src/environments/enviroment';

export interface Profesion {
  idProfesion: number;
  profesion: string;
}

export interface Profesor {
  cuiProfesor: string;
  nombreProfesor: string;
  apellidosProfesor: string;
  profesion: string | number;
  horasMinimas: number;
  horasMaximas: number;
  estado?: string;
}

export interface ProfesorRequest {
  cuiProfesor: string;
  nombreProfesor: string;
  apellidosProfesor: string;
  profesion: number;
  horasMinimas: number;
  horasMaximas: number;
}

export interface CursosAsignados {
  cursosAsignados: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProfesorService {
  private apiUrl = `${environment.apiUrl}/profesores`;
  private apiProfesionesUrl = `${environment.apiUrl}/profesores/profesiones`;

  constructor(private http: HttpClient) {}

  obtenerProfesores(): Observable<Profesor[]> {
    return this.http.get<Profesor[]>(this.apiUrl);
  }

  obtenerProfesiones(): Observable<Profesion[]> {
    return this.http.get<Profesion[]>(this.apiProfesionesUrl);
  }

  guardarProfesor(profesor: Profesor): Observable<any> {
    return this.http.post(this.apiUrl, profesor);
  }

  obtenerCursosAsignados(cuiProfesor: string): Observable<CursosAsignados> {
    return this.http.get<CursosAsignados>(`${this.apiUrl}/asignacion/${cuiProfesor}/cursos`);
  }

  eliminarProfesor(cuiProfesor: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${cuiProfesor}`);
  }
}