import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiService } from './services/kanban-api.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: ApiService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {


      const currentUser  = this.authService.getUserRole();
      if (currentUser) {
          const allowedRoles : string []= route.data['roles'] as Array<string>;
          if (allowedRoles &&  !allowedRoles.includes(currentUser)) {
             this.router.navigate(['/home']);
              return false;
          }

          return true;

      }

      this.router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
      return false;
     
  }

}