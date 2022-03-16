import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {map} from "rxjs/operators";
import { SpinnerService } from 'src/app/common/services/spinner.service';
import {EventiService} from "../service/eventi.service";
import {EventiDettaglioBean} from "../model/eventi.model";

@Injectable()
export class EventoResolver implements Resolve<EventiDettaglioBean> {

  constructor(
    protected eventiService: EventiService,
    private spinnerService: SpinnerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<EventiDettaglioBean> | Observable<never> {
    console.warn("Evento resolve", route);
    const tokenId = route.queryParams['t'];
    console.warn('tokenId',tokenId);
    this.spinnerService.activeSpinner();
    if (tokenId) {
      return this.eventiService.dettaglio(tokenId).pipe(
        map((resp) => {
          return resp.obj;
        }),
      );
    }
    return EMPTY;
  }
}
