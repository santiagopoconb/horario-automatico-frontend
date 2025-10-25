import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../AppAsignacionFrontend/src/environments/enviroment';

export interface Aula {
  salon: string;
  capacidad: number;
  seccion?: string;
}

export interface CrearAulaRequest {
  salon: string;
  capacidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class AulaService {
  private apiUrl = `${environment.apiUrl}/aulas`;

  constructor(private http: HttpClient) {}

  obtenerAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.apiUrl}/lista`);
  }

  crearAula(aula: CrearAulaRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, aula);
  }

  eliminarAula(salon: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${salon}`, { observe: 'response' });
    }
}