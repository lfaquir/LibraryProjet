import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


@Injectable({
  providedIn:'root'
})


export class AdminGuard implements CanActivate {

  constructor( private authservice: AuthService ){}
  
  canActivate(): boolean {
    return this.authservice.isLoggedIn() && this.authservice.isAdmin()
  }
  
};
