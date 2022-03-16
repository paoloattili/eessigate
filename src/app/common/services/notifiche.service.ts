import { MessageUtils } from "src/app/utils/message-utils";
import { NotificheComponent } from "./../components/notifiche/notifiche.component";
import { BaseService } from "./base.service";
import { Notifica } from "./../../model/notifica";
import { Observable, Subject } from "rxjs";
import { Injectable } from '@angular/core';
import { WebsocketNotifiche } from 'src/app/utils/websocket-notifiche';
import { HttpClient, HttpParams } from "@angular/common/http";
import { JsonResponseBean } from "../json-response-bean";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotificheService extends BaseService{

  notificheUpdate: Subject<Notifica[]> = new Subject<Notifica[]>();
  notifiche: Notifica[] = [];
  countNotificheUpdate: Subject<number> = new Subject<number>();
  countNotifiche: number;

  constructor(
    httpClient: HttpClient,
    private messageUtils: MessageUtils) { 
    super(httpClient);
  }

  setNotifiche(notifiche: Notifica[]){
    this.notifiche = notifiche? notifiche : [];
    this.notificheUpdate.next(this.notifiche);
  }

  addNotifica(notifica: Notifica) {
    if(notifica.recordId !== null) {
      this.notifiche.push(notifica);
      this.notificheUpdate.next(this.notifiche);
      this.messageUtils.alertSuccess('Hai ricevuto una notifica')
    }
  }

  getNotifiche(){
    return this.notificheUpdate.asObservable();
  }

  listNotifiche(): Observable<JsonResponseBean<Notifica>> {
    return this.doCall<JsonResponseBean<Notifica>>('GET', environment.baseUrl + '/notifica/all-notifiche');
  }

  leggiNotifica(token) {
    const params = new HttpParams();
    const formData: FormData = new FormData();
    formData.append('t',token)
    return this.doCall<JsonResponseBean<any>>('POST', environment.baseUrl + '/notifica/notifica-letta', params, formData);
  }

}
