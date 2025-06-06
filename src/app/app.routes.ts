import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventComponent } from './event/event.component';
import { Home } from './pages/home/home';
import { AuthGuard } from './core/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'event/:id', component: EventDetailsComponent, canActivate: [AuthGuard] },
  { path: 'event-list', component: EventListComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
