import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {map} from "rxjs/operators";
import { SpinnerService } from 'src/app/common/services/spinner.service';
import {TicketDettaglioBean} from "../model/service-desk.model";
import {ServiceDeskService} from "../service/service-desk.service";

@Injectable()
export class TicketResolver implements Resolve<TicketDettaglioBean> {

  constructor(
    protected serviceDeskService: ServiceDeskService,
    private spinnerService: SpinnerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<TicketDettaglioBean> | Observable<never> {
    console.warn("Ticket resolve", route);
    const tokenId = route.queryParams['t'];
    const tipoTicket = route.queryParams['argomentoHelpDesk'];
    console.warn('tokenId',tokenId);
    this.spinnerService.activeSpinner();
    if (tokenId) {
      return this.serviceDeskService.dettaglio(tokenId,tipoTicket).pipe(
        map((resp) => {
          return resp.obj;
        }),
      );
    }

    return EMPTY;
  }
}
