import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageUtils } from 'src/app/utils/message-utils';
import { LoginService } from '../services/login.service';
import { MenuService } from '../services/menu.service';
import { SpinnerService } from '../services/spinner.service';
import { Location } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AccessDeniedGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(
    private router: Router,
    private service: LoginService,
    private spinnerService: SpinnerService,
    private menuService: MenuService,
    private messages: MessageUtils,
    private location: Location
  ){
    console.warn('Sono in AccessDeniedGuard');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canAccess();
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canAccess();
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canAccess();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canAccess();
  }

  canAccess() {
    localStorage.clear();
    this.menuService.setMenu(null);
    this.spinnerService.closeSpinner();
    return true;
  }
}
