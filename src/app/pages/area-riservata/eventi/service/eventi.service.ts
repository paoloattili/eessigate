import { JsonResponseBean } from "../../../../common/json-response-bean";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../common/services/base.service";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import {Observable} from "rxjs";
import {
  DestinatariBean,
  EventiDettaglioBean,
  EventoForm,
  EventPlanningBean,
  SchedaEventiBean
} from "../model/eventi.model";
import {Category} from "../../../../model/tree";

@Injectable()
export class EventiService extends BaseService{

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }


  /**
   * /area-riservata/eventi/planning-eventi
   */
  listaEventi(month: number, year: number, token?: string) : Observable<JsonResponseBean<EventPlanningBean>> {
      const params = new HttpParams()
        .append('month', month)
        .append('year', year);

      if (token) {
        params.append('t', token);
      }

      return this.doCall<JsonResponseBean<EventPlanningBean>>('GET', environment.baseUrl + '/area-riservata/eventi/planning-eventi', params);
  }

  /**
   * /area-riservata/eventi/crea
   */
  creazioneEvento(form: EventoForm): Observable<JsonResponseBean<any>> {
    return this.doCall<JsonResponseBean<any>>('POST', environment.baseUrl + '/area-riservata/eventi/crea', null, form);
  }

  /**
   * /area-riservata/eventi/modifica
   */
  modificaEvento(form: EventoForm): Observable<JsonResponseBean<any>> {
    console.warn("[eventi service - modificaEvento ]",form);
    return this.doCall<JsonResponseBean<any>>('POST', environment.baseUrl + '/area-riservata/eventi/modifica', null, form);
  }

  /**
   * /area-riservata/eventi/dettaglio
   */
  dettaglio(token?: string, cryptKey?: string) : Observable<JsonResponseBean<EventiDettaglioBean>> {
    const params = new HttpParams().append('t', token);
    return this.doCall<JsonResponseBean<EventiDettaglioBean>>('GET', environment.baseUrl + '/area-riservata/eventi/dettaglio', params);
  }

  /**
   * /area-riservata/eventi/scheda-evento
   */
  schedaEvento(token?: string, cryptKey?: string) : Observable<JsonResponseBean<SchedaEventiBean>> {
    let params;
    if(token) params = new HttpParams().append('t', token);
    else params = new HttpParams().append('cryptKey',cryptKey);
    return this.doCall<JsonResponseBean<SchedaEventiBean>>('GET', environment.baseUrl + '/area-riservata/eventi/scheda-evento', params);
  }

  /**
   * lista-destinatari
   */
  selectDestinatari(): Observable<JsonResponseBean<DestinatariBean>> {
    return this.doCall<JsonResponseBean<DestinatariBean>>('GET', environment.baseUrl + '/area-riservata/eventi/lista-destinatari', null);
  }

  /**
   * export-invitati
   */
  exportInvitati(): Observable<any> {
    const params = new HttpParams();
    return this.doCall<any>('DOWNLOAD', environment.baseUrl + '/area-riservata/eventi/export-invitati', params);
  }

  getTreeEvents(token: string): Observable<JsonResponseBean<Category>> {
    console.warn("gettreeevents token",token);
    const params = new HttpParams()
      .append('t', token);
    return this.doCall<JsonResponseBean<Category>>('GET', environment.baseUrl + '/area-riservata/eventi/tree-events', params);
  }

  /**
   * scelta-partecipazione
   */
  scegliPartecipazione(scelta: number, token: string): Observable<any> {
    const formData = new FormData();
    formData.append('t',token)
    formData.append('choice',scelta.toString())

    console.warn("scelta", scelta.toString());
    return this.doCall<JsonResponseBean<Category>>('POST', environment.baseUrl + '/area-riservata/eventi/scelta-partecipazione', null,formData);
  }



}
