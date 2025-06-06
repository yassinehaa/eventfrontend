import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../pages/events/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8081/api/events';

  constructor(private http: HttpClient) {}

  createEvent(eventData: Event): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, eventData);
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  updateEvent(id: number, eventData: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
