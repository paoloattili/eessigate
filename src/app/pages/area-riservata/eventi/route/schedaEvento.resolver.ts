import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {map} from "rxjs/operators";
import { SpinnerService } from 'src/app/common/services/spinner.service';
import {EventiService} from "../service/eventi.service";
import {SchedaEventiBean} from "../model/eventi.model";

@Injectable()
export class SchedaEventoResolver implements Resolve<SchedaEventiBean> {

  constructor(
    protected eventiService: EventiService,
    private spinnerService: SpinnerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<SchedaEventiBean> | Observable<never> {
    console.warn("Evento resolve", route);
    const tokenId = route.queryParams['t'];
    const cryptKey = route.queryParams['cryptKey'];
    console.warn('tokenId',tokenId);
    console.warn('cryptKey',cryptKey);
    this.spinnerService.activeSpinner();

    if (tokenId || cryptKey) {
      return this.eventiService.schedaEvento(tokenId,cryptKey).pipe(
        map((resp) => {
          console.warn('evento',resp.obj);
          return resp.obj;
        }),
      );
    }

    return EMPTY;
  }
}
