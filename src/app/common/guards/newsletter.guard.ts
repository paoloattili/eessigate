import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { User } from 'src/app/model/user';
import { MessageUtils } from 'src/app/utils/message-utils';
import { LoginService } from '../services/login.service';
import { MenuService } from '../services/menu.service';
import { SpinnerService } from '../services/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class NewsletterGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {

  constructor(
    private router: Router,
    private service: LoginService,
    private spinnerService: SpinnerService,
    private menuService: MenuService,
    private messages: MessageUtils,
    private location: Location
  ){
    console.warn('Sono in NewsletterGuard');
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

  canAccess(): Observable<boolean> | boolean {
    if(!localStorage.getItem('user') && !localStorage.getItem('menu')) {
      return this.service.loginUser().pipe(
        take(1),
        map(user => {
          if(user !== null) {
            this.service.setUserLogged(user);
            this.menuService.setMenu(user);
            localStorage.setItem('user',JSON.stringify(this.service.getUserLogged()));
            localStorage.setItem('menu',JSON.stringify(this.menuService.loadMenu()));
            
            if(user.amministratore || user.contentManager) {
              //localStorage.setItem('lastTimeAtive',(user.lastLoginDate?.toString()));
            
              //this.service.checkSessionExpire();

              if(this.service.getAuthToken() === 'Bearer authenticated')
                this.messages.alertSuccess('Bentornato in EESSIGatePortal ' + this.service.getUserLogged().nome + ' ' + this.service.getUserLogged().cognome);
              
              this.spinnerService.closeSpinner();
              return true
            } else {
              this.router.navigate(['not-authorize']);
              this.spinnerService.closeSpinner();
            }
          }else {
            this.messages.alertError('Errore! Dati utente non recuperati.');
            this.router.navigate(['access-denied']);
            this.spinnerService.closeSpinner();
          }
        })
      );
    } else {
      const user: User = JSON.parse(localStorage.getItem('user'));
      if(user.amministratore || user.contentManager) {
        this.service.setUserLogged(user);
        this.menuService.setMenu(user);
        this.spinnerService.closeSpinner();
        return true;
      } else {
        this.router.navigate(['not-authorize']);
        this.spinnerService.closeSpinner();
      }
    }
  }
}
