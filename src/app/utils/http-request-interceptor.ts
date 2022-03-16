import { TIPO_MESSAGGI } from "./enums";
import { MessageUtils } from "./message-utils";
import { LoginService } from "../common/services/login.service";
import { SpinnerService } from "../common/services/spinner.service";
import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import {EMPTY, Observable, throwError} from "rxjs";
import {catchError, tap, timeout} from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor{

    constructor(
        private messagetUtils: MessageUtils,
        private spinnerService: SpinnerService,
        private loginServie: LoginService,
        private router: Router
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if(this.checkSessionIfExpire()) {
            setTimeout(t => this.logoutSessionExpire(), 1000);
            return EMPTY;
        }

        const newReq = req.clone(
            {
                headers: req.headers
                            .set('Access-Control-Allow-Origin', '*')
                            .set('Access-Control-Expose-Headers','Content-Disposition'),
                withCredentials: true
            }
        );

        return next.handle(newReq).pipe(
                timeout(2*60*1000),
                catchError((err) => {console.error(err.message); return throwError(err.message)}),
                tap(response => {
                    let res: HttpResponse<any> = response as HttpResponse<any>;
                    if(res.status && res.body) {

                        if(res.status === 404) {

                            console.error('Response: ', res.body.exception.exception);
                            this.messagetUtils.alertError('Errore 404! Problema nella comunicazione con il server.');
                            if (this.spinnerService.isSpinnerActive()) this.spinnerService.closeSpinner();
                            throw new Error(res.body.exception.exception);

                        } else if(res.body.messaggio && res.body.messaggio.tipoMessaggio === TIPO_MESSAGGI.WARNING) {

                          console.error('Response: ', res.body);
                          this.messagetUtils.alertWarning('Warning! '+res.body.messaggio.messaggio);
                          if (this.spinnerService.isSpinnerActive()) this.spinnerService.closeSpinner();
                          throw new Error(res.body.messaggio.messaggio);

                        } else if(res.body.messaggio && res.body.messaggio.tipoMessaggio === TIPO_MESSAGGI.ERROR) {

                            console.error('Response: ', res.body);
                            this.messagetUtils.alertError('Errore! '+res.body.messaggio.messaggio);
                            if (this.spinnerService.isSpinnerActive()) this.spinnerService.closeSpinner();
                            throw new Error(res.body.messaggio.messaggio);

                        } else if(res.status === 500 || res.body.exception) {

                            console.error('Response: ', res.body.exception.exception);
                            this.messagetUtils.alertError('Errore! Qualcosa è andato storto');
                            if (this.spinnerService.isSpinnerActive()) this.spinnerService.closeSpinner();
                            throw new Error(res.body.exception.exception);

                        }

                        if(res.status !== 200) {

                            console.error('Response: ',res);
                            this.messagetUtils.alertError('Errore '+res.status+'! Problema nella comunicazione con il server.');
                            if (this.spinnerService.isSpinnerActive()) this.spinnerService.closeSpinner();
                            throw new Error(res.status.toString());

                        }

                        localStorage.setItem('lastTimeActive',Date.now().toString());
                    }
                }),
            );
    }

    checkSessionIfExpire(): boolean {
        if(localStorage.getItem('lastTimeActive')) {
            let lastTimeActive = localStorage.getItem('lastTimeActive') as any;
            let now = Date.now();
            if(now - lastTimeActive > 1620000) {
                return true;
            }
        }
        return false;
    }

    logoutSessionExpire() {
        localStorage.clear();

        const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
        for (let i = 1; i < interval_id; i++) {
            window.clearInterval(i);
        }

        this.messagetUtils.alertWarning('Sessione terminata');
        this.spinnerService.activeSpinner();
        if(environment.env === 'dev') {
            setTimeout(() => {
                this.loginServie.logout().subscribe(
                    resp => {
                        this.spinnerService.activeSpinner();
                        setTimeout(() => {
                            // location.reload()
                            this.router.navigate(['']);
                        }, 1000);
                    }
                );
            },2000)
        } else {
            this.loginServie.logout().subscribe(
                resp => {
                    console.warn(resp);
                },
                (err) => {
                    // this.messagetUtils.alertError('Errore nell\'effettuare il logout!');
                    // this.spinnerService.closeSpinner();
                }
            );
        }
    }

    getUserLoggedToken() {
        this.loginServie.setAuthToken();
        return this.loginServie.getAuthToken();
    }

    getUserLoggedTokenDefault(token?: string) {
        this.loginServie.setAuthDefaultToken(token);
        return this.loginServie.getAuthToken();
    }

}
