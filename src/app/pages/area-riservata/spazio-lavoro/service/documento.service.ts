import { DettaglioDocumento } from "../../../../model/dettaglio-documento";
import { DocumentiWorkspace } from "../../../../model/documenti-workspace";
import { JsonResponseBean } from "../../../../common/json-response-bean";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../common/services/base.service";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import {Observable} from "rxjs";
import {CommentoForm} from "../../../../model/commento";
import {RicercaAvanzataForm} from "../model/documentoForm.model";
import {Like} from "../../../../model/like";
import {LikeBean} from "../model/social.model";

@Injectable()
export class DocumentoService extends BaseService{

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  // GESTIONE DOCUMENTI

  /**
   * documenti-per-categoria
   */
  getDocumentiWorkspace(treeMap: string) {
    const params = new HttpParams().append('t', treeMap);

    return this.doCall<JsonResponseBean<DocumentiWorkspace>>('GET', environment.baseUrl + '/area-riservata/documenti/documenti-per-categoria', params);
  }


  /**
   * documenti-ricerca-avanzata
   */
  ricercaListaDocWorkspace(ricercaAvanzataForm: RicercaAvanzataForm) {
    console.warn("Ricerca avanzata", ricercaAvanzataForm);
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<DocumentiWorkspace>>('POST', environment.baseUrl + '/area-riservata/documenti/documenti-ricerca-avanzata', params, ricercaAvanzataForm);
  }


  /**
   * dettaglio
   */
  getDettaglioDocumento(token?: string, cryptKey?: string): Observable<JsonResponseBean<DettaglioDocumento>> {
    let params;
    if(token) params = new HttpParams().append('t', token);
    else params = new HttpParams().append('cryptKey',cryptKey);
    return this.doCall<JsonResponseBean<DettaglioDocumento>>('GET', environment.baseUrl + '/area-riservata/documenti/dettaglio', params);
  }

  /**
   * download
   */
  downloadAttachment(token: string): Observable<any>{
    console.warn("DOWNLOAD",token);
    const params = new HttpParams().append('t', token);
    return this.doCall<any>('DOWNLOAD',environment.baseUrl + '/area-riservata/documenti/download',params);
  }

  /**
   * carica-documento
   */
  caricaDocumento(form: any, file : File): Observable<JsonResponseBean<any>> {
    const params = new HttpParams();
    let formData: FormData = new FormData();
    formData.append('form', JSON.stringify(form));
    formData.append('file', file);
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/documenti/carica-documento',params,formData);
  }

  /**
   * modifica-documento
   */
  modificaDocumento(form: any, file : File): Observable<JsonResponseBean<any>> {
    const params = new HttpParams();
    let formData: FormData = new FormData();
    formData.append('form', JSON.stringify(form));
    if(file)
      formData.append('file', file);
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/documenti/modifica-documento',params,formData);
  }

  /**
   * elimina
   */
  eliminaDocumento(id: string): Observable<JsonResponseBean<any>> {
    const params = new HttpParams();
    const formData: FormData = new FormData();
    formData.append('t', id);
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/documenti/elimina',params, formData);
  }

  /**
   * documenti-lista-autore
   */
  listaAutori(): Observable<JsonResponseBean<any>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<DettaglioDocumento>>('GET', environment.baseUrl + '/area-riservata/documenti/documenti-lista-autore', params);
  }


  // GESTIONE SOCIAL

  /**
   * inserisci-commento
   */
  inserisciCommento(commentoForm: CommentoForm): Observable<JsonResponseBean<any>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/documenti/inserisci-commento',params, commentoForm);
  }

  eliminaCommento(id: string): Observable<JsonResponseBean<any>> {
    console.warn("[POST] [eliminaCommento] t: ",id);
    const params = new HttpParams();
    const formData: FormData = new FormData();
    formData.append('t', id);
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/documenti/elimina-commento',params, formData);
  }

  /**
   * click-like
   */
  clickLike(id: string): Observable<JsonResponseBean<LikeBean>> {
    const params = new HttpParams();
    const formData: FormData = new FormData();
    formData.append('t', id);
    return this.doCall<JsonResponseBean<LikeBean>>('POST',environment.baseUrl + '/area-riservata/documenti/click-like',params, formData);
  }




}
