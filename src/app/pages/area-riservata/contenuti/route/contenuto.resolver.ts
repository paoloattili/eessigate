import { SpinnerService } from "src/app/common/services/spinner.service";
import { ContentService } from "./../service/content.service";
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {map} from "rxjs/operators";
import { DettaglioContenuto } from 'src/app/model/dettaglio-contenuto';

@Injectable()
export class ContenutoResolver implements Resolve<DettaglioContenuto> {

  constructor(
    protected contenutoService: ContentService,
    protected spinnerService: SpinnerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DettaglioContenuto> | Observable<never> {
    console.warn("Contenuto resolve", route);
    const tokenId = route.queryParams['t'];
    if (tokenId) {
      this.spinnerService.activeSpinner();
      return this.contenutoService.getDettaglioContenuto(tokenId).pipe(map(
        resp => {
          console.warn("CONTENUTO SERVICE",resp);
          this.spinnerService.closeSpinner();
          return resp.obj as DettaglioContenuto;
        }
      ));
    }

    return EMPTY;
  }
}
