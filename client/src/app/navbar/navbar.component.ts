import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../services/kanban-api.service';
import { ReactiveFormsModule,NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  providers: [ApiService],
  imports:[ReactiveFormsModule,CommonModule ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showNavbar: boolean = true;
  isLoggedIn: boolean = false;
  username: string | null = null;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/register', '/home'].includes(event.url);
      }
    });

    // Check login status initially
    this.isLoggedIn = this.apiService.isLoggedIn();
    this.username = this.apiService.getUsername();

    // Subscribe to changes in login status
    this.apiService.loginStatus.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.username = this.apiService.getUsername();
    });
  }

  logout() {
    this.apiService.logout().subscribe(
      () => {
        console.log('Logout successful');
        this.apiService.clearToken();
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Logout error:', error);
        // Handle logout error if needed
      }
    );
  }
}
