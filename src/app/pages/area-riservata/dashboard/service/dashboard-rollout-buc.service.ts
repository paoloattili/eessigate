import { HttpClient } from "@angular/common/http";
import { BaseService } from "../../../../common/services/base.service";
import { environment } from "../../../../../environments/environment";
import { DashboardRolloutBuc } from "../../../../model/dashboard-rollout-buc";
import { Injectable } from '@angular/core';
import { JsonResponseBean } from "../../../../common/json-response-bean";

@Injectable({
  providedIn: 'root'
})
export class DashboardRolloutBucService extends BaseService {

    constructor(httpClient: HttpClient) { 
        super(httpClient);
    }

    getDashboardRolloutBuc() {
        return this.doCall<JsonResponseBean<DashboardRolloutBuc>>('GET', environment.baseUrl + '/area-riservata/rollout-buc/dashboard');
    }
}
