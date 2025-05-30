import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './dashboard/users/users.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { BookComponent } from './dashboard/book/book.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'booking', component: BookingComponent },
  {
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    { path: '', component: DashboardHomeComponent },
    { path: 'users', component: UsersComponent },
     { path: 'bookings', component: BookComponent }, 
  ]
},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
