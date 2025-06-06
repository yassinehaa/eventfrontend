import { Component } from '@angular/core';
import {EventListComponent} from '../../event-list/event-list.component';
import {NavbarComponent} from '../../navbar/navbar.component';

@Component({
  selector: 'app-home',
  imports: [
    EventListComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
