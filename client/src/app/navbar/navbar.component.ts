import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../services/kanban-api.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  providers: [ApiService],
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  showNavbar: boolean = true;
  isLoggedIn: boolean = false;
  username: string | null = null;
  userId: string | null = null;
  mobileMenuOpen: boolean = false;
  private loginStatusSub!: Subscription;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    console.log('Navbar initialized');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/register'].includes(event.urlAfterRedirects);
      }
    });

    this.loginStatusSub = this.apiService.loginStatus.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.username = this.apiService.getUsername();
      this.userId = this.apiService.getUserIdFromLocalStorage();
      console.log('Login status changed:', loggedIn);
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  logout() {
    this.apiService.logout().subscribe(
      () => {
        console.log('Logout successful');
        window.location.href = '/login';
      },
      (error) => {
        console.error('Logout error:', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.loginStatusSub) {
      this.loginStatusSub.unsubscribe();
    }
  }
}
