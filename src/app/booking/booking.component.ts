import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
})
export class BookingComponent {
  bookingDetails: {
    totalPrice: number;
    persons: number;
    tripPlace: string;
    name: string;
    email: string;
    bookingDate?: string;
  } = {
    totalPrice: 0,
    persons: 1,
    tripPlace: '',
    name: '',
    email: '',
  };

  mode: 'register' | 'login' = 'register';
  user: any = {};
  selectedTrip: any;
  message: string = '';
  selectedFile: File | null = null;
  showBookingForm: boolean = false;

  constructor(private router: Router, private http: HttpClient) {
    const nav = this.router.getCurrentNavigation();
    this.selectedTrip = nav?.extras?.state?.['selectedTrip'];

    if (this.selectedTrip) {
      this.bookingDetails.tripPlace = this.selectedTrip.title;
      this.bookingDetails.totalPrice = this.selectedTrip.price;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submitBooking() {
    if (!this.showBookingForm) {
      if (this.mode === 'register') {
        this.registerUser();
        this.message = 'Registered successfully!';
      } else {
        this.loginUser();
      }
    } else {
      this.confirmBooking();
    }
  }

  registerUser() {
    if (!this.selectedFile) {
      this.message = 'Please upload proof document.';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.user.name);
    formData.append('email', this.user.email);
    formData.append('password', this.user.password);
    formData.append('gender', this.user.gender);
    formData.append('age', this.user.age);
    formData.append('address', this.user.address);
    formData.append('proof', this.selectedFile);

    this.http
      .post('http://localhost:5000/api/users/register', formData)
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'Registered successfully!';
          this.showBookingForm = true;

          if (res.user) {
            this.user = res.user;
            this.bookingDetails.name = this.user.name;
            this.bookingDetails.email = this.user.email;
          } else {
            this.message = 'User data missing from response.';
          }
        },
        error: (err) => {
          this.message = err.error.message || 'Registration failed!';
        },
      });
  }

  loginUser() {
    this.http
      .post('http://localhost:5000/api/users/login', {
        email: this.user.email,
        password: this.user.password,
      })
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'Login successful!';
          this.showBookingForm = true;

          if (res.user) {
            this.user = res.user;
            this.bookingDetails.name = this.user.name;
            this.bookingDetails.email = this.user.email;
          } else {
            this.message = 'User data missing from response.';
          }
        },
        error: (err) => {
          this.message = err.error.message || 'Login failed!';
        },
      });
  }

  updateTotalPrice() {
    if (this.selectedTrip) {
      this.bookingDetails.totalPrice =
        this.selectedTrip.price * (this.bookingDetails.persons || 1);
    }
  }

  confirmBooking() {
    if (!this.bookingDetails.bookingDate) {
      this.message = 'Please select a booking date.';
      return;
    }

    const formData = new FormData();
    formData.append('userId', this.user._id);
    formData.append('tripPlace', this.bookingDetails.tripPlace);
    formData.append('name', this.bookingDetails.name);
    formData.append('email', this.bookingDetails.email);
    formData.append('tripPlace', this.bookingDetails.tripPlace);
    formData.append('bookingDate', this.bookingDetails.bookingDate!);
    formData.append('persons', this.bookingDetails.persons.toString());
    formData.append('totalPrice', this.bookingDetails.totalPrice.toString());

    if (this.selectedFile) {
      formData.append('proof', this.selectedFile);
    }

    this.http.post('http://localhost:5000/api/bookings', formData).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Booking confirmed successfully!';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err) => {
        this.message = err.error.message || 'Booking failed!';
      },
    });
  }
}
