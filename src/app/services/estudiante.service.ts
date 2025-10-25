import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/inscripciones`;

  constructor(private http: HttpClient) {}

  inscribirEstudiante(estudiante: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, estudiante);
  }

    // Envía el archivo directamente al backend
  inscripcionMasiva(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    
    return this.http.post(`${this.apiUrl}/masivo`, formData);
  }

  obtenerEstudiantes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}