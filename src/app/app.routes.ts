import { Routes } from '@angular/router';
import { AuthGuard } from '../../src/app/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.component').then(m => m.InicioComponent),
    canActivate: [AuthGuard] // ✅ AGREGADO
  },
  {
    path: 'inicio-profesor',
    loadComponent: () => import('./pages/profesor/inicio-profesor/asignacion.component').then(m => m.AsignacionComponent),
    canActivate: [AuthGuard] // ✅ AGREGADO
  },
  {
    path: 'aulas',
    loadComponent: () => import('./pages/coordinacion/aulas/aulas.component').then(m => m.AulasComponent),
    canActivate: [AuthGuard] // ✅ AGREGADO
  },  
  {
    path: 'estudiantes/inscripcion',
    loadComponent: () => import('./pages/coordinacion/inscripcion/inscripcion.component').then(m => m.InscripcionComponent),
    canActivate: [AuthGuard] // ✅ AGREGADO
  },
  {
    path: 'catedraticos',
    loadComponent: () => import('./pages/coordinacion/catedratico/catedraticos.component').then(m => m.CatedraticosComponent),
    canActivate: [AuthGuard] // ✅ AGREGADO
  },
  {
    path: 'asignacion',
    loadComponent: () => import('./pages/coordinacion/asignacion/asignacion.component').then(m => m.AsignacionComponent),
    canActivate: [AuthGuard] // ✅ AGREGADO
  },
  {
    path: 'reportes',
    loadComponent: () => import('./pages/coordinacion/reportes/reportes.component').then(m => m.ReportesComponent),
    canActivate: [AuthGuard] // ✅ AGREGADO
  },
  {
    path: 'reporte-profesor',
    loadComponent: () => import('./pages/profesor/reporte-profesor/reporte-profesor.component').then(m => m.ReporteProfesorComponent),
    canActivate: [AuthGuard] // ✅ AGREGADO
  }
];