import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './services/kanban-api.service';

@Injectable({ providedIn: 'root' })
export class LoginAuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: ApiService
    ) { }
canActivate() {
        if (this.authService.isLoggedIn()) {
            this.router.getCurrentNavigation(); 
            return false;
        }
        return true;
    }
}