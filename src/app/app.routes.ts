import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { EventComponent } from './event/event.component';
import {ReservationComponent} from './reservation/reservation.component'
import { ClientComponent } from './client/client.component';
//import { AuthGuard } from './core/auth.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'event', component: EventComponent },
  { path: 'reserve', component: ReservationComponent},
  { path: 'client', component: ClientComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
