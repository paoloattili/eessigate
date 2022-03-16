import { RoleSelect } from "./../../model/role-select";
import { NominativoUtente } from "src/app/model/nominativo-utente";
import { ContentTypeSelect } from "./../../model/content-type-select";
import { JsonResponseBean } from "../json-response-bean";
import {HttpClient, HttpParams} from "@angular/common/http";
import { BaseService } from "./base.service";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import {
  EventTypePlanningBean,
  GruppiSelectBean,
  OrganizzazioneLiteBean,
  TipoDocumentoBean
} from "../../pages/area-riservata/spazio-lavoro/model/tipologiche.model";
import {map} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {SettoreTicketBean} from "../../pages/area-riservata/service-desk/model/service-desk.model";

@Injectable({
  providedIn: 'root',
})
export class TipologicheService extends BaseService {
  tipiDocumento: TipoDocumentoBean[];
  listaTag: string[];
  listaGruppi: GruppiSelectBean[];
  listaOrganizzazione: OrganizzazioneLiteBean[];
  listaTipiContenuti: ContentTypeSelect[];
  listaUtenti: NominativoUtente[];
  listaRuoli: RoleSelect[];

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Endpoint: lista-tipi-documento
   */
  getTipiDocumento() {
    if (this.tipiDocumento !== null) {
      return this.doCall<JsonResponseBean<TipoDocumentoBean>>('GET', environment.baseUrl + '/area-riservata/tipologiche/lista-tipi-documento')
        .pipe(map(resp => {
          this.tipiDocumento = resp.listObj;
          console.log("this.documentiService.getTipiDocumento(): ", resp.listObj);
          return resp;
        }));
    }

    const response = new JsonResponseBean<TipoDocumentoBean>();
    response.listObj = this.tipiDocumento;
    return of(response);
  }

  /**
   * Endpoint: lista-tag
   */
  getListaTag() {
    if (this.listaTag !== null) {
      return this.doCall<JsonResponseBean<string>>('GET', environment.baseUrl + '/area-riservata/tipologiche/lista-tag')
        .pipe(map(resp => {
          this.listaTag = resp.listObj;
          return resp;
        }));
    }

    const response = new JsonResponseBean<string>();
    response.listObj = this.listaTag;
    return of(response);
  }

  /**
   * Endpoint: lista-gruppi
   */
  getListaGruppi() {
    if(this.listaGruppi !== null){
      return this.doCall<JsonResponseBean<GruppiSelectBean>>('GET', environment.baseUrl + '/area-riservata/tipologiche/lista-gruppi')
        .pipe(map(resp => {
          this.listaGruppi = resp.listObj;
          return resp;
        }));
    }

    const response = new JsonResponseBean<GruppiSelectBean>();
    response.listObj = this.listaGruppi;
    return of(response);
  }


  /**
   * Endpoint: lista-organizzazione
   */
  getListaOrganizzazioni(){
    if(this.listaOrganizzazione !== null){
      return this.doCall<JsonResponseBean<OrganizzazioneLiteBean>>('GET', environment.baseUrl + '/area-riservata/tipologiche/lista-organizzazioni')
        .pipe(map(resp => {
          this.listaOrganizzazione = resp.listObj;
          return resp;
        }));
    }

    const response = new JsonResponseBean<OrganizzazioneLiteBean>();
    response.listObj = this.listaOrganizzazione;
    return of(response);
  }

  /**
   * Endpoint: lista-contenuti
   */
   getListaTipiContenuti(){
    if(this.listaTipiContenuti !== null){
      return this.doCall<JsonResponseBean<ContentTypeSelect>>('GET', environment.baseUrl + '/area-riservata/tipologiche/tipi-contenuti-select')
        .pipe(map(resp => {
          this.listaTipiContenuti = resp.listObj;
          return resp;
        }));
    }

    const response = new JsonResponseBean<ContentTypeSelect>();
    response.listObj = this.listaTipiContenuti;
    return of(response);
  }

  /**
   * Endpoint: lista-utenti
   */
   getListaUtenti(){
    if(this.listaUtenti !== null){
      return this.doCall<JsonResponseBean<NominativoUtente>>('GET', environment.baseUrl + '/area-riservata/tipologiche/lista-utenti')
        .pipe(map(resp => {
          this.listaUtenti = resp.listObj;
          return resp;
        }));
    }

    const response = new JsonResponseBean<NominativoUtente>();
    response.listObj = this.listaUtenti;
    return of(response);
  }

  /**
   * Endpoint: lista-ruoli
   */
   getListaRuoli(){
    if(this.listaRuoli !== null){
      return this.doCall<JsonResponseBean<RoleSelect>>('GET', environment.baseUrl + '/area-riservata/tipologiche/lista-ruoli')
        .pipe(map(resp => {
          this.listaRuoli = resp.listObj;
          return resp;
        }));
    }

    const response = new JsonResponseBean<RoleSelect>();
    response.listObj = this.listaRuoli;
    return of(response);
  }

  /**
   * Endpoint: planning-eventi-select
   */
  listaTipiEventiSelect(): Observable<JsonResponseBean<EventTypePlanningBean>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<EventTypePlanningBean>>('GET', environment.baseUrl + '/area-riservata/tipologiche/planning-tipi-eventi-select', params);
  }

  /**
   * Endpoint: event-location
   */
  listaEventLocationsSelect(): Observable<JsonResponseBean<EventTypePlanningBean>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<EventTypePlanningBean>>('GET', environment.baseUrl + '/area-riservata/tipologiche/event-location', params);
  }


  /**
   *
   */
  settoreSelectBusiness(): Observable<JsonResponseBean<SettoreTicketBean>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<SettoreTicketBean>>('GET', environment.baseUrl + '/area-riservata/tipologiche/select-settore-business', params);
  }

  settoreSelectTecnico(): Observable<JsonResponseBean<SettoreTicketBean>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<SettoreTicketBean>>('GET', environment.baseUrl + '/area-riservata/tipologiche/select-settore-tecnico', params);
  }


}
