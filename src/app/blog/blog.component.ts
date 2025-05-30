import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  blogs = [
    {
      image: 'assets/blog4.jpg',
      date: 11,
      month: 'December',
      title: 'Most Popular Place In This World',
    },
    {
      image: 'assets/blog2.jpg',
      date: 1,
      month: 'October',
      title: 'Most Popular Place In This World',
    },
    {
      image: 'assets/blog5.jpg',
      date: 27,
      month: 'August',
      title: 'Most Popular Place In This World',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    AOS.init({
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }

  readMore() {
    this.router.navigate(['/']);
  }
}
