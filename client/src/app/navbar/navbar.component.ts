import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from '../services/kanban-api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  providers: [ApiService],
  imports: [ReactiveFormsModule, CommonModule, TitleCasePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() currentUser: any;
  showNavbar: boolean = true;
  isLoggedIn: boolean = false;
  username: string | null = null;
  userId: string | null = null;
  mobileMenuOpen: boolean = false;
  currentUrl: string | undefined;
  userRole!: string | null;
  loginDate: Date | null = null;
  showUserInfo: boolean = false;

  constructor(private router: Router, private apiService: ApiService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  ngOnInit() {
    //console.log('Navbar initialized');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/register'].includes(event.urlAfterRedirects);
      }
    });
  
    // Check login status initially
    this.isLoggedIn = this.apiService.isLoggedIn();
    this.username = this.apiService.getUsername();
    this.userId = this.apiService.getUserIdFromLocalStorage();
  
    // Subscribe to changes in login status
    this.apiService.loginStatus.subscribe((loggedIn) => {
      //console.log('Login status changed:', loggedIn);
      this.isLoggedIn = loggedIn;
      this.username = this.apiService.getUsername();
      this.userId = this.apiService.getUserIdFromLocalStorage();
      this.loginDate = new Date();
    });

    this.userRole = this.apiService.getUserRole();
    

  }
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserInfo() {
    this.showUserInfo = !this.showUserInfo;
  }

  // Method to close popup when clicking away
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = event.target && (event.target as HTMLElement).closest('.relative');
    if (!clickedInside) {
      this.showUserInfo = false;
    }
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
    this.isLoggedIn = false;
    this.username = '';
    this.userRole = '';
    this.loginDate = null; // Clear login date
  }
}
