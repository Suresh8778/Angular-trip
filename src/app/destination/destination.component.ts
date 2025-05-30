import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css']
})
export class DestinationComponent implements OnInit {

  tours = [
    { image: 'assets/des1.jpg', price: 600, duration: 2, title: 'Ooty conoor', location: 'TamilNadu, India', type: 'Near Mountain' },
    { image: 'assets/des2.jpg', price: 2000, duration: 3, title: 'Goa', location: 'Goa, India', type: 'Near Beach' },
    { image: 'assets/des3.jpg', price: 1200, duration: 2, title: 'Pondicherry', location: 'Pondicherry, India', type: 'Near Beach' },
    { image: 'assets/des4.jpg', price: 2000, duration: 2, title: 'Varkala Cliff', location: 'Kerala, India', type: 'Near Mountain' },
    { image: 'assets/des5.jpg', price: 2000, duration: 2, title: 'Wayanad', location: 'Kerala, India', type: 'Near Mountain' },
    { image: 'assets/des6.jpg', price: 1000, duration: 2, title: 'Dhanushkodi', location: 'TamilNadu, India', type: 'Near Beach' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
     AOS.init({
          easing: 'ease-in-out',
          once: true,
          mirror: false
        });
  }

bookTour(tour: any) {
    this.router.navigate(['/booking'], { state: { selectedTrip: tour } });
  }
}
