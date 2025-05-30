import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent implements OnInit {
  totalUsers = 0;
  totalBookings = 0;

   users: User[] = []; 

  constructor(
    private userService: UserService,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;      
        this.totalUsers = users.length;
      },
      error: err => console.error(err),
    });

    this.bookingService.getAllBookings().subscribe({
      next: bookings => this.totalBookings = bookings.length,
      error: err => console.error(err),
    });
  }
}
