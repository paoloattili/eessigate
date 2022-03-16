import { Confapp } from "../../model/confapp";
import { JsonResponseBean } from "../json-response-bean";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfappService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getConfAppByCode(code: string) {
    const params = new HttpParams().append('code',code);

    return this.doCall<JsonResponseBean<Confapp>>(
              'GET', 
              environment.baseUrl + '/admin/configurazione/confapp-by-code',
              params
            );
  }
}
