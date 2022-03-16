import { MessageUtils } from "./../../../../utils/message-utils";
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {DocumentoService} from "../service/documento.service";
import {DettaglioDocumento} from "../../../../model/dettaglio-documento";
import {map} from "rxjs/operators";
import { SpinnerService } from 'src/app/common/services/spinner.service';
import { TIPO_MESSAGGI } from "src/app/utils/enums";

@Injectable()
export class DocumentoResolver implements Resolve<DettaglioDocumento> {

  constructor(
    protected documentoService: DocumentoService,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    private router: Router
  ) {
  }

  resolve(route: ActivatedRouteSnapshot): Observable<DettaglioDocumento> | Observable<never> {
    console.warn("Documento resolve", route);
    const parentActivatedRoute = route.parent;
    console.warn('parentActivatedRoute',parentActivatedRoute);
    const tokenId = route.queryParams['t'];
    const cryptKey = route.queryParams['cryptKey'];
    console.warn('tokenId',tokenId);
    console.warn('cryptKey',cryptKey);
    this.spinnerService.activeSpinner();
    if (tokenId || cryptKey) {
      return this.documentoService.getDettaglioDocumento(tokenId,cryptKey).pipe(map(
        resp => {
          console.warn("DOCUMENT SERVICE RESOLVE",resp);
          if(resp.messaggio?.tipoMessaggio === TIPO_MESSAGGI.WARNING) {
            this.router.navigate([`area-riservata/spazio-di-lavoro/${parentActivatedRoute.routeConfig.path}`]).then(() => {
              this.messageUtils.alertWarning(resp?.messaggio.messaggio);
            });
          } else if(resp.messaggio?.tipoMessaggio === TIPO_MESSAGGI.ERROR) {
            this.router.navigate([`area-riservata/spazio-di-lavoro/${parentActivatedRoute.routeConfig.path}`]).then(() => {
              this.messageUtils.alertError(resp?.messaggio.messaggio);
            });
          } else {
            return resp.obj as DettaglioDocumento;
          }
        },
        (err) => {
          // console.error(err);
          this.router.navigate([`area-riservata/spazio-di-lavoro/${parentActivatedRoute.routeConfig.path}`]).then(() => {
            this.messageUtils.alertError('Errore nel recupero del dettaglio del documento');
            // this.spinnerService.closeSpinner();
          });
        }
      ));
    }

    return EMPTY;
  }

}
