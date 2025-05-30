import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DestinationComponent } from './destination/destination.component';
import { CardComponent } from './card/card.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './booking/booking.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './dashboard/users/users.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { BookComponent } from './dashboard/book/book.component';
import { BlogComponent } from './blog/blog.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DestinationComponent,
    CardComponent,
    FooterComponent,
    HomeComponent,
    BookingComponent,
    DashboardComponent,
    DashboardHomeComponent,
    UsersComponent,
    BookComponent,
    BlogComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    HttpClientModule,
    CommonModule, 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
