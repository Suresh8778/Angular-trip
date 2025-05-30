import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface BookingPayload {
  userId: string;
  name: string;   
  email: string;
  tripPlace: string;
  persons: number;
  bookingDate: string;
  totalPrice: number;
  tripId: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = 'http://localhost:5000/api/bookings';

  constructor(private http: HttpClient) {}

  bookTrip(payload: BookingPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.baseUrl, payload);
  }

  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:5000/api/users/login', { email, password });
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }


  deleteBooking(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
