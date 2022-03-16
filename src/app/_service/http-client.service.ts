import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClientRequest } from '../_utility/http-client-request';
import { JsonResponseBean } from './../_model/json-response-bean';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient) { }

  // TODO: Importare toastr

  public get<T extends any>(request: HttpClientRequest): Promise<JsonResponseBean<T>> {
    return this.http.get<JsonResponseBean<T>>(request.getURI(), { params: request.getParams() })
      .pipe(tap(data => { if (data.exception) { throw new Error(data.messaggio.messaggio); } })).toPromise();
  }

  public post<T extends any>(request: HttpClientRequest, body: any): Promise<JsonResponseBean<T>> {
    return this.http.post<JsonResponseBean<T>>(request.getURI(), body, { params: request.getParams() })
      .pipe(tap(data => { if (data.exception) { throw new Error(data.messaggio.messaggio); } })).toPromise();
  }

  public put<T extends any>(request: HttpClientRequest, body: any): Promise<JsonResponseBean<T>> {
    return this.http.put<JsonResponseBean<T>>(request.getURI(), body, { params: request.getParams() })
      .pipe(tap(data => { if (data.exception) { throw new Error(data.messaggio.messaggio); } })).toPromise();
  }

  public delete<T extends any>(request: HttpClientRequest): Promise<JsonResponseBean<T>> {
    return this.http.delete<JsonResponseBean<T>>(request.getURI(), { params: request.getParams() })
      .pipe(tap(data => { if (data.exception) { throw new Error(data.messaggio.messaggio); } })).toPromise();
  }

}
