import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../services/kanban-api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  providers: [ApiService],
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showNavbar: boolean = true;
  isLoggedIn: boolean = false;
  username: string | null = null;
  mobileMenuOpen: boolean = false;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    console.log('Navbar initialized');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/register'].includes(event.urlAfterRedirects);
      }
    });
  
    // Check login status initially
    this.isLoggedIn = this.apiService.isLoggedIn();
    this.username = this.apiService.getUsername();
  
    // Subscribe to changes in login status
    this.apiService.loginStatus.subscribe((loggedIn) => {
      console.log('Login status changed:', loggedIn);
      this.isLoggedIn = loggedIn;
      this.username = this.apiService.getUsername();
    });
  }
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  logout() {
    this.apiService.logout().subscribe(
      () => {
        console.log('Logout successful');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Logout error:', error);
      }
    );
  }
}
