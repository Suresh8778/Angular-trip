import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  
  constructor(public router: Router) {}

  hideFooter(): boolean {
    return this.router.url.startsWith('/dashboard');
  }
  
}
