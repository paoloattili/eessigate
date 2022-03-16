import { MessageUtils } from "./../../utils/message-utils";
import { SpinnerService } from "src/app/common/services/spinner.service";
import { BehaviorSubject, Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import { User } from "../../model/user";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { distinctUntilChanged, map, take } from "rxjs/operators";
import { P } from "@angular/cdk/keycodes";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService {

  userLogged: Subject<User> = new Subject<User>();
  user: User;
  tokenUpdate: Subject<string> = new Subject<string>();
  token: string;
  interval: any;

  constructor(
    httpClient: HttpClient,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    private router: Router) { 
    super(httpClient);
  }

  public redirect() {
    return this.doCall<User>('GET', environment.baseUrl + '/gestione-utente/redirect');
  }

  public loginUser() {
    return this.doCall<User>('GET', environment.baseUrl + '/gestione-utente/get-utente');
  }

  public isUserLogged(){
    return this.user !== undefined;
  }

  public getUserLogged() {
    this.userLogged.asObservable().pipe(take(1)).subscribe(resp => this.user = resp);
    return this.user;
  }

  public setUserLogged(user: User) {
    this.userLogged.next(user);
  }

  public setAuthToken() {
    this.tokenUpdate.next(this.user?.authToken);
  }

  public setAuthDefaultToken(token:string) {
    this.tokenUpdate.next(token);
  }

  public getAuthToken() {
    this.tokenUpdate.asObservable().pipe(take(1)).subscribe(resp => this.token = resp);
    return this.token;
  }

  // public checkSessionExpire() {
  //   if(localStorage.getItem('lastTimeActive')) {
  //     this.interval = setInterval(() => {
  //       let lastTimeActive = localStorage.getItem('lastTimeActive') as any;
  //       let now = Date.now();
  //       if(now - lastTimeActive > 162000) {
  //         clearInterval(this.interval);
  //         this.messageUtils.alertWarning('Sessione terminata');
  //         this.spinnerService.activeSpinner();
  //         if(environment.env === 'dev') {
  //           setTimeout(() => {
  //             this.logout().subscribe(
  //               resp => {
  //                 this.spinnerService.activeSpinner();
  //                 setTimeout(() => {
  //                   // location.reload()
  //                   this.router.navigate(['']);
  //                 }, 1000);
  //               }
  //             );
  //           },2000)
  //         } else {
  //           this.logout().subscribe(
  //             resp => {
  //               console.warn(resp);
  //             }, 
  //             (err) => {
  //               this.messageUtils.alertError('Errore nell\'effettuare il logout!');
  //               this.spinnerService.closeSpinner();
  //             }
  //           );
  //         }
  //       }
  //     },2000)
  //   }
  // }

  logout() {
    return this.doCall<string>('GET', environment.baseUrl + '/gestione-utente/logout');
  }

}
