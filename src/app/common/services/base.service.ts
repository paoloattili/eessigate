import { Injectable } from "@angular/core";
import { Breadcrumb } from "../../class/breadcrumb";
import { User } from "../../model/user";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  private $unsubscribe: Subject<boolean> = new Subject<boolean>();
  
  constructor(protected httpClient: HttpClient) { }

  protected doCall<T>(method: 'GET' | 'DOWNLOAD' | 'POST', url: string, params?: HttpParams, data?: any): Observable<T>;

  protected doCall<T>(
    method: 'GET' | 'DOWNLOAD' | 'POST',
    url: string,
    parameters? : HttpParams,
    data?: any
  ) : Observable<T>{
    let obs: Observable<T>;
    switch (method) {
      case 'GET':
        obs = this.httpClient.get(url, {params : parameters}) as Observable<T>;
        break;
      case 'DOWNLOAD':
        obs = this.httpClient.get(url, {params : parameters, responseType: 'blob', observe: 'response'}) as Observable<any>;
        break;
      case 'POST':
        obs = this.httpClient.post(url, data) as Observable<T>;
        break;
    }
    return obs.pipe(takeUntil(this.$unsubscribe)) as Observable<T>;
  }

}
