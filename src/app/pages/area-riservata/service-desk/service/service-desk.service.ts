import { JsonResponseBean } from "../../../../common/json-response-bean";
import {HttpClient, HttpParams} from "@angular/common/http";
import { BaseService } from "../../../../common/services/base.service";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import {Observable} from "rxjs";
import {
  ArgomentoHelpDesk, BUCBean, Impatto, MessaggioBean, SettoreArgomentoBean, SettoreTicketBean,
  TicketDettaglioBean,
  TicketInserimentoForm, TicketManageBean,
  TicketMyRequestBean, Urgenza
} from "../model/service-desk.model";
import {OrganizzazioneLiteBean} from "../../spazio-lavoro/model/tipologiche.model";

@Injectable() // todo bisogna cambiare a livello di root?
export class ServiceDeskService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  /**
   * Endpoint: argomenti-help-desk
   */
  listaArgomentoHelpDesk() : Observable<JsonResponseBean<ArgomentoHelpDesk>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<ArgomentoHelpDesk>>('GET', environment.baseUrl + '/area-riservata/services-desk/argomenti-help-desk',params);
  }

  /**
   * select-settore-argomento
   */
  selectSettoreArgomento() : Observable<JsonResponseBean<SettoreArgomentoBean>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<SettoreArgomentoBean>>('GET', environment.baseUrl + '/area-riservata/services-desk/select-settore-argomento',params);
  }

  /**
   * Endpoint: lista-impatto
   */
  listaImpatto() : Observable<JsonResponseBean<Impatto>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<Impatto>>('GET', environment.baseUrl + '/area-riservata/services-desk/lista-impatto',params);
  }

  /**
   * lista-urgenza
   */
  listaUrgenza() : Observable<JsonResponseBean<Urgenza>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<Urgenza>>('GET', environment.baseUrl + '/area-riservata/services-desk/lista-urgenza',params);
  }

  /**
   * select-settore
   */
  settoreSelect() : Observable<JsonResponseBean<SettoreTicketBean>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<SettoreTicketBean>>('GET', environment.baseUrl + '/area-riservata/services-desk/select-settore',params);
  }

  /**w
   * select-organizzazione-by-settore
   */
  selectOrganizzazioneBySettore(idSettore: number) : Observable<JsonResponseBean<OrganizzazioneLiteBean>> {
    const params = new HttpParams().append('t',idSettore);
    return this.doCall<JsonResponseBean<OrganizzazioneLiteBean>>('GET', environment.baseUrl + '/area-riservata/services-desk/select-organizzazione-by-settore',params);
  }

  /**
   * select-buc-by-settore
   */
  selectBUCBySettore(idSettore: number) : Observable<JsonResponseBean<BUCBean>> {
    const params = new HttpParams().append('t',idSettore);
    return this.doCall<JsonResponseBean<BUCBean>>('GET', environment.baseUrl + '/area-riservata/services-desk/select-buc-by-settore',params);
  }

  /**
   * lista-miei-ticket
   */
  listaMieiTicket(argomento: string, stato: number, esito?: string) : Observable<JsonResponseBean<TicketMyRequestBean>> {
    console.warn("[service desk - listaMieiTicket] ",argomento,stato,esito);
    const params = new HttpParams()
      .append('argomento',argomento)
      .append('stato',stato)
      .append('esito',esito);
    return this.doCall<JsonResponseBean<TicketMyRequestBean>>('GET', environment.baseUrl + '/area-riservata/services-desk/lista-miei-ticket',params);
  }

  /**
   * Endpoint: lista-gestione-ticket
   */
  listaGestioneTicket(argomento: string, stato: number, esito?: string): Observable<JsonResponseBean<TicketManageBean>> {
    const params = new HttpParams()
      .append('argomento',argomento)
      .append('stato',stato)
      .append('esito',esito);
    return this.doCall<JsonResponseBean<TicketManageBean>>('GET', environment.baseUrl + '/area-riservata/services-desk/lista-gestione-ticket',params);
  }

  /**
   * Endpoint: dettaglio
   */
  dettaglio(token: string, argomentoHelpDesk: string) : Observable<JsonResponseBean<TicketDettaglioBean>> {
    const params = new HttpParams().append('t', token).append('argomentoHelpDesk', argomentoHelpDesk);
    return this.doCall<JsonResponseBean<TicketDettaglioBean>>('GET', environment.baseUrl + '/area-riservata/services-desk/dettaglio',params);
  }

  /**
   * Endpoint: download
   */
  downloadAttachment(idToken: string) : Observable<any> {
    const params = new HttpParams().append('t', idToken);
    return this.doCall<any>('DOWNLOAD', environment.baseUrl + '/area-riservata/services-desk/download',params);
  }

  /**
   * Endpoint: crea
   */
  nuovoTicket(ticket: TicketInserimentoForm, allegati: File[]) : Observable<JsonResponseBean<any>> {
    const params = null;
    let formData = null;
    if(allegati) {
      formData = new FormData();
      formData.append('gf', JSON.stringify(ticket));
      allegati.forEach(a => formData.append('allegati', a));
    } else {
      formData = ticket;
    }
    // toco chiedere: come aggiungere molteplici file
    // formData.append('allegati', allegati);
    return this.doCall<JsonResponseBean<any>>('POST', environment.baseUrl + '/area-riservata/services-desk/crea',params, formData);
  }

  /**
   * Endpoint: risolvi
   */
  risolviTicket(token: string) : Observable<JsonResponseBean<TicketMyRequestBean>> {
    const params = new HttpParams().append('t', token);
    return this.doCall<JsonResponseBean<TicketMyRequestBean>>('GET', environment.baseUrl + '/area-riservata/services-desk/risolvi',params);
  }

  /**
   * Endpoint: riapri
   */
  riapriTicket(token: string): Observable<JsonResponseBean<TicketMyRequestBean>> {
    const params = new HttpParams().append('t', token);
    return this.doCall<JsonResponseBean<TicketMyRequestBean>>('GET', environment.baseUrl + '/area-riservata/services-desk/riapri', params);
  }

  /**
   * Endpoint: chiudi
   */
  chiudiTicket(token: string, esito: string): Observable<JsonResponseBean<TicketMyRequestBean>> {
    const params = new HttpParams().append('t', token).append('esito', esito);
    return this.doCall<JsonResponseBean<TicketMyRequestBean>>('GET', environment.baseUrl + '/area-riservata/services-desk/chiudi', params);
  }


  /**
   * Endpoint: messaggio
   */
  inviaMessaggio(messaggioBean: MessaggioBean, argomento: string): Observable<JsonResponseBean<TicketDettaglioBean>> {
    const params = new HttpParams();
    let formData = new FormData();
    formData.append('messaggio', JSON.stringify(messaggioBean));
    formData.append('argomentoHelpDesk',argomento);
    return this.doCall<JsonResponseBean<TicketDettaglioBean>>('POST', environment.baseUrl + '/area-riservata/services-desk/messaggio', params, formData);
  }


  /**
   * tokenTicket, file array,
   * Endpoint: carica-allegato,
   */
  caricaAllegati(tokenTicket: string, files: File[]): Observable<JsonResponseBean<TicketDettaglioBean>> {
    let formData: FormData = new FormData();
    formData.append('t', tokenTicket);
    for ( let file of files) {
      formData.append('allegati', file);
      console.warn("formdata",formData.get('allegati'));
    }
    console.warn("carica allegato",tokenTicket,files);
    return this.doCall<JsonResponseBean<TicketDettaglioBean>>('POST', environment.baseUrl + '/area-riservata/services-desk/carica-allegato', null, formData);
  }

  /**
   * modifica-allegati
   */
  modificaAllegati(ticketModificaAllegato:  { token: string, idAllegatiToken: string[] } , files: File[]): Observable<JsonResponseBean<any>> {
    let formData: FormData = new FormData();
    formData.append('form', JSON.stringify(ticketModificaAllegato));
    for ( let file of files) {
      formData.append('allegati', file);
      console.warn("formdata",formData.get('allegati'));
    }
    console.warn("carica allegato",ticketModificaAllegato,files);
    return this.doCall<JsonResponseBean<TicketDettaglioBean>>('POST', environment.baseUrl + '/area-riservata/services-desk/modifica-allegati', null, formData);
  }

  /**
   * get data ultimo passaggio batch
   */
  getDataUltimoPassaggioBatch() {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<Date>>('GET', environment.baseUrl + '/area-riservata/services-desk/data-ultimo-passaggio-batch', params); 
  }

}
