import { Component, OnInit } from '@angular/core';
import { EventService } from '../core/event.service';
import { Event } from '../pages/events/event.model';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  eventForm: FormGroup;
  editing: boolean = false;
  currentId?: number;

  constructor(private eventService: EventService, private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      titre: [''],
      type: [''],
      nombrePlase: [0],
      description: [''],
      dateDebut: [''],
      dateFin: ['']
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe(data => this.events = data);
  }

  saveEvent(): void {
    if (this.editing && this.currentId) {
      this.eventService.updateEvent(this.currentId, this.eventForm.value).subscribe(() => {
        this.loadEvents();
        this.resetForm();
      });
    } else {
      this.eventService.createEvent(this.eventForm.value).subscribe(() => {
        this.loadEvents();
        this.resetForm();
      });
    }
  }

  editEvent(event: Event): void {
    this.editing = true;
    this.currentId = event.idEvenement;
    this.eventForm.patchValue(event);
  }

  deleteEvent(id: number): void {
    this.eventService.deleteEvent(id).subscribe(() => this.loadEvents());
  }

  resetForm(): void {
    this.editing = false;
    this.currentId = undefined;
    this.eventForm.reset();
  }
}
