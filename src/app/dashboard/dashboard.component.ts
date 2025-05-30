import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../services/user.service'; 


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {} 

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {     
        this.users = data;
        console.log('Users loaded:', this.users);
      },
      error: (err: any) => {      
        console.error('Error loading users:', err);
      }
    });
  }
}
