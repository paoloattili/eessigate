import { Injectable } from '@angular/core';
import { HttpClientRequest } from '../_utility/http-client-request';
import { DocumentiHomeBean } from './../_model/documenti-home-bean';
import { JsonContentsHome } from './../_model/json-contents-home';
import { JsonResponseBean } from './../_model/json-response-bean';
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  constructor(private http: HttpClientService) { }

  getUltimiDocumenti(): Promise<JsonResponseBean<DocumentiHomeBean>> {
    const request: HttpClientRequest = HttpClientRequest
      .toPath('/area-privata/documenti/ultimi-documenti');
    return this.http.get<DocumentiHomeBean>(request);
  }

  getDocumentiTopCommentati(): Promise<JsonResponseBean<DocumentiHomeBean>> {
    const request: HttpClientRequest = HttpClientRequest
      .toPath('/area-privata/documenti/documenti-top-commentati');
    return this.http.get<DocumentiHomeBean>(request);
  }

  getHomeContent(): Promise<JsonResponseBean<JsonContentsHome>> {
    const request: HttpClientRequest = HttpClientRequest
      .toPath('/area-riservata/content/home');
    return this.http.get<JsonContentsHome>(request);
  }

}
