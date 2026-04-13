import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription, SubscriptionStats } from '../models/subscription.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/subscriptions`;

  // ============================================================
  // Metodos implementados — usa estos como referencia
  // ============================================================

  /** Obtiene todas las suscripciones */
  getAll(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.apiUrl);
  }

  /** Obtiene estadisticas resumidas */
  getStats(): Observable<SubscriptionStats> {
    return this.http.get<SubscriptionStats>(`${this.apiUrl}/stats/summary`);
  }

  /** Obtiene una suscripcion por su ID */
  getById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/${id}`);
  }

  // ============================================================
  // TODO: Implementa los siguientes metodos
  // Sigue el patron de los metodos anteriores como guia
  // ============================================================

  /**
   * TODO: Crear una nueva suscripcion
   * Metodo HTTP: POST
   * URL: this.apiUrl
   * Body: los datos de la suscripcion (sin id ni createdAt)
   * Retorna: Observable<Subscription>
   */
  create(subscription: Omit<Subscription, 'id' | 'createdAt'>): Observable<Subscription> {
    // TODO: Implementar
    throw new Error('Metodo create() no implementado');
  }

  /**
   * TODO: Actualizar una suscripcion existente
   * Metodo HTTP: PUT
   * URL: `${this.apiUrl}/${id}`
   * Body: los campos a actualizar
   * Retorna: Observable<Subscription>
   */
  update(id: number, subscription: Partial<Subscription>): Observable<Subscription> {
    // TODO: Implementar
    throw new Error('Metodo update() no implementado');
  }

  /**
   * TODO: Eliminar una suscripcion
   * Metodo HTTP: DELETE
   * URL: `${this.apiUrl}/${id}`
   * Retorna: Observable<void>
   */
  delete(id: number): Observable<void> {
    // TODO: Implementar
    throw new Error('Metodo delete() no implementado');
  }
}
