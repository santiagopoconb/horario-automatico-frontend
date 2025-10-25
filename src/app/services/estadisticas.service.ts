import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment';

export interface Estadisticas {
  alumnos: {
    totalInscritos: number;
    totalAsignados: number;
    porGenero: {
      hombres: number;
      mujeres: number;
    };
  };
  profesores: {
    total: number;
    porProfesion: Array<{
      profesion: string;
      cantidad: number;
    }>;
  };
  aulas: {
    totalDisponible: number;
    capacidadTotal: number;
  };
}

export interface EstadisticasAula {
  idAula: number;
  nombreAula: string;
  capacidad: number;
  totalAlumnos: number;
  totalHombres: number;
  totalMujeres: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private apiUrl = `${environment.apiUrl}/estadisticas`;

  constructor(private http: HttpClient) {}

  obtenerEstadisticasInicio(): Observable<Estadisticas> {
    return this.http.get<Estadisticas>(`${this.apiUrl}/inicio`);
  }

  obtenerEstadisticasAulas(): Observable<EstadisticasAula[]> {
    return this.http.get<EstadisticasAula[]>(`${this.apiUrl}/aulas`);
  }
}