import { Component, OnInit } from '@angular/core';
import { EventService } from '../core/event.service';
import { Event } from '../pages/events/event.model';
import { Router } from '@angular/router';
import {SlicePipe} from '@angular/common';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  imports: [
    SlicePipe
  ],
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error = '';

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load events.';
        this.loading = false;
      }
    });
  }

  goToDetails(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }
}
