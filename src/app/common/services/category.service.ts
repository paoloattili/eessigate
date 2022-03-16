import { Category } from "src/app/model/tree";
import { JsonResponseBean } from "../json-response-bean";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService{

  constructor(httpClient: HttpClient) {
    super(httpClient);
   }

   getTree(categoryType: number) {
     const params = new HttpParams().append('categoryType', categoryType);

     return this.doCall<JsonResponseBean<Category>>('GET', environment.baseUrl + '/area-riservata/documenti/tree', params);
   }
}
