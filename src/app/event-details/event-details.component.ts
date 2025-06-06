import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../core/event.service';
import { Event } from '../pages/events/event.model';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventId!: number;
  event?: Event;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchEventDetails();
  }

  fetchEventDetails(): void {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data:any) => {
        this.event = data;
        this.loading = false;
      },
      error: (err:any) => {
        this.error = 'Failed to load event.';
        this.loading = false;
      }
    });
  }
}
