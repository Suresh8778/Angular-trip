import { Component, OnInit,  AfterViewInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import * as AOS from 'aos';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  booking = {
    destination: '',
    email: '',
    password: ''
  };

  constructor(private bookingService: BookingService) { }

  ngOnInit(): void {
     AOS.init({
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }


  bookTrip() {
    if (!this.booking.destination || !this.booking.email || !this.booking.password) {
      alert('Please fill all fields');
      return;
    }

    this.bookingService.login(this.booking.email, this.booking.password).subscribe(
  res => {
    const userId = res.user?._id || 'someUserId';
    this.bookingService.bookTrip({
      userId: userId,
       name: 'John Doe',
      email: this.booking.email,
      tripPlace: this.booking.destination,
      persons: 1,
      bookingDate: new Date().toISOString().split('T')[0],
      totalPrice: 600,
      tripId: 'someTripId'
    }).subscribe(
      () => alert('Booking successful!'),
      () => alert('Booking failed')
    );
  },
  err => alert('Login failed. Please check your credentials.')
);

  }

} 
