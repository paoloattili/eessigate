import { NewsletterRicerca } from "./../model/newsletter-ricerca";
import { DualListboxItem } from "./../../../../class/dual-listbox-item";
import { JsonResponseBean } from "../../../../common/json-response-bean";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../common/services/base.service";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import {Observable, Subject} from "rxjs";
import {DettaglioNewsletterBean} from "../model/newsletter.model";
import { NewsletterForm } from "../model/newsletter-form";
import { ArgomentiNewsletterForm, NewsletterTemplate } from "../model/newsletter-template";

@Injectable()
export class NewsletterService extends BaseService{

  listaSezioniSelezionate: DualListboxItem[] = [];
  sezioniSubject = new Subject<DualListboxItem[]>();

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public getlistaSezioniSelezionate() {
    return this.sezioniSubject.asObservable();
  }

  public setlistaSezioniSelezionate(sezioni: DualListboxItem[]) {
    this.sezioniSubject.next(sezioni);
  }

  // GESTIONE NEWSLETTER

  /**
   * sezioni
   */
  sezioni(): Array<DualListboxItem> {
    return [
      {
        key: '1',
        value: 'News'
      },
      {
        key: '5',
        value: 'News esterne'
      },
      {
        key: '2',
        value: 'Documenti caricati'
      },
      {
        key: '8',
        value: 'Eventi'
      },
    ]
  }

  /**
   * dettaglio
   */
  dettaglioNewsletter(id: number): Observable<JsonResponseBean<DettaglioNewsletterBean>> {
    const params = new HttpParams().append('t', id);
    return this.doCall<JsonResponseBean<DettaglioNewsletterBean>>('GET', environment.baseUrl + '/area-riservata/newsletter/dettaglio', params);
  }

  /**
   * invia
   */
  invia(newsletterForm: NewsletterForm): Observable<JsonResponseBean<NewsletterForm>>{
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<NewsletterForm>>('POST',environment.baseUrl + '/area-riservata/newsletter/invia', params, newsletterForm);
  }

  /**
   * ricerca
   */
  ricerca(newsletterForm: NewsletterForm): Observable<JsonResponseBean<NewsletterRicerca>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<NewsletterRicerca>>('POST',environment.baseUrl + '/area-riservata/newsletter/ricerca', params, newsletterForm);
  }

  /**
   * elenco-newsletter
   */
  elencoNewsletter(): Observable<JsonResponseBean<DettaglioNewsletterBean>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<DettaglioNewsletterBean>>('GET', environment.baseUrl + '/area-riservata/newsletter/elenco-newsletter', params);
  }

  /**
   * argomenti-newsletter
   */
   argomentiNewsletter(form: ArgomentiNewsletterForm): Observable<JsonResponseBean<NewsletterTemplate>> {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<NewsletterTemplate>>('POST', environment.baseUrl + '/area-riservata/newsletter/argomenti-newsletter', params, form);
  }

}
