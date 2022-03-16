import { JsonContentsHome } from "./../../../../model/json-contents-home";
import { GruppiSelectBean } from "./../../spazio-lavoro/model/tipologiche.model";
import { ContentStatusUpdateForm } from "./../../../../model/content-status-update-form";
import { ContentByStatus } from "./../../../../model/content-by-status";
import { DettaglioContenuto } from "./../../../../model/dettaglio-contenuto";
import { ContentTypeHome } from "../../../../model/content-type-home";
import { JsonResponseBean } from "../../../../common/json-response-bean";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService } from "../../../../common/services/base.service";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { ContentTypeSelect } from "src/app/model/content-type-select";
import { NominativoUtente } from "src/app/model/nominativo-utente";
import { RoleSelect } from "src/app/model/role-select";
import { NuovoContenutoForm } from "src/app/model/nuovo-contenuto-form";
import { ContentDeleteForm } from "src/app/model/content-delete-form";

@Injectable({
  providedIn: 'root'
})
export class ContentService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  creaContenuto(form: NuovoContenutoForm, img?: File, attachments?: File[], gallery?: File[]) {
    const params = new HttpParams();
    let formData = new FormData();
    formData.append('form',JSON.stringify(form));
    if(img) formData.append('immagine',img);
    if(attachments) {
      attachments.forEach(a => formData.append('allegati', a));
    }
    if(gallery) {
      gallery.forEach(i => formData.append('galleria', i));
    }
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/content/crea', params, formData);
  }

  modificaContenuto(form: NuovoContenutoForm, img?: File, attachments?: File[], gallery?: File[]) {
    const params = new HttpParams();
    let formData = new FormData();
    formData.append('form',JSON.stringify(form));
    if(img) formData.append('immagine',img);
    if(attachments) {
      attachments.forEach(a => formData.append('allegati', a));
    }
    if(gallery) {
      gallery.forEach(i => formData.append('galleria', i));
    }
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/content/modifica', params, formData);
  }

  getListaContenutiHome() {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<JsonContentsHome>>('GET',environment.baseUrl + '/area-riservata/content/visualizza-contenuti', params);
  }

  getContenutiInBozza(token?: string) {
    if(token) {
      const params = new HttpParams().append('t', token);
      return this.doCall<JsonResponseBean<ContentByStatus>>('GET', environment.baseUrl + '/area-riservata/content/lista-contenuti-bozza', params);
    } else return this.doCall<JsonResponseBean<ContentByStatus>>('GET', environment.baseUrl + '/area-riservata/content/lista-contenuti-bozza');
  }

  getContenutiDaApprovare(token?: string) {
    if(token) {
      const params = new HttpParams().append('t', token);
      return this.doCall<JsonResponseBean<ContentByStatus>>('GET', environment.baseUrl + '/area-riservata/content/lista-contenuti-da-approvare', params);
    } else return this.doCall<JsonResponseBean<ContentByStatus>>('GET', environment.baseUrl + '/area-riservata/content/lista-contenuti-da-approvare');
  }

  getContenutiDaPubblicare(token?: string) {
    if(token) {
      const params = new HttpParams().append('t', token);
      return this.doCall<JsonResponseBean<ContentByStatus>>('GET', environment.baseUrl + '/area-riservata/content/lista-contenuti-da-pubblicare', params);
    } else return this.doCall<JsonResponseBean<ContentByStatus>>('GET', environment.baseUrl + '/area-riservata/content/lista-contenuti-da-pubblicare');
  }

  getDettaglioContenuto(token: string) {
    const params = new HttpParams().append('t', token);
    return this.doCall<JsonResponseBean<DettaglioContenuto>>('GET', environment.baseUrl + '/area-riservata/content/dettaglio', params);
  }

  getContentPreview(token?: string, cryptKey?: string) {
    let params;
    if(token)
      params = new HttpParams().append('t', token);
    else if(cryptKey)
      params = new HttpParams().append('cryptKey', cryptKey);
    else
      throw new Error('Nessun parametro settato')

    return this.doCall<JsonResponseBean<DettaglioContenuto>>('GET', environment.baseUrl + '/area-riservata/content/preview', params);
  }

  downloadAttachment(token: string) {
    const params = new HttpParams().append('t', token);
    return this.doCall<any>('DOWNLOAD',environment.baseUrl + '/area-riservata/content/download',params);
  }

  doPubblica(form: ContentStatusUpdateForm) {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/content/pubblica', params, form);
  }

  doApprova(form: ContentStatusUpdateForm) {
    console.warn(form);
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/content/approva', params, form);
  }

  dePubblica(form: ContentStatusUpdateForm) {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/content/depubblica', params, form);
  }

  rigetta(form: ContentStatusUpdateForm) {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/content/rigetta', params, form);
  }

  elimina(token: string) {
    const params = new HttpParams();
    const formData: FormData = new FormData();
    formData.append('t', token);
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/content/elimina', params, formData);
  }

  eliminaImg(token: string) {
    const params = new HttpParams();
    const formData: FormData = new FormData();
    formData.append('t', token);
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/content/elimina-img', params, formData);
  }

  eliminaAllegato(form: ContentDeleteForm) {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/content/elimina-blob', params, form);
  }

  eliminaImgGallery(form: ContentDeleteForm) {
    const params = new HttpParams();
    return this.doCall<JsonResponseBean<any>>('POST',environment.baseUrl + '/area-riservata/content/elimina-img-gallery', params, form);
  }

}
