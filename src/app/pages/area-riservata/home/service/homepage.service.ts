import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentiHomeBean } from '../../../../model/documenti-home-bean';
import { JsonContentsHome } from '../../../../model/json-contents-home';
import { JsonResponseBean } from "../../../../common/json-response-bean";
import { BaseService } from "src/app/common/services/base.service";

@Injectable({
  providedIn: 'root'
})
export class HomepageService extends BaseService{

  constructor(httpClient: HttpClient) { 
    super(httpClient);
  }

  getUltimiDocumenti(): Observable<JsonResponseBean<DocumentiHomeBean>> {
    return this.doCall<JsonResponseBean<DocumentiHomeBean>>('GET', environment.baseUrl + '/area-riservata/documenti/ultimi-documenti');
  }

  getDocumentiTopCommentati(): Observable<JsonResponseBean<DocumentiHomeBean>> {
    return this.doCall<JsonResponseBean<DocumentiHomeBean>>('GET', environment.baseUrl + '/area-riservata/documenti/documenti-top-commentati');
  }

  getHomeContent(): Observable<JsonResponseBean<JsonContentsHome>> {
    return this.doCall<JsonResponseBean<JsonContentsHome>>('GET', environment.baseUrl + '/area-riservata/content/contenuti-home');
  }

}
