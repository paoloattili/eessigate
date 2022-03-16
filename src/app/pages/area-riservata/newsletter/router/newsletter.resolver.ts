import { NewsletterService } from "./../service/newsletter.service";
import { DettaglioNewsletterBean } from "./../model/newsletter.model";
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { SpinnerService } from "src/app/common/services/spinner.service";
import { map } from "rxjs/operators";
import { DocumentoTemplateObj, EventoTemplateObj, NewsTemplateObj } from "../model/newsletter-template";

@Injectable({
  providedIn: 'root'
})
export class NewsletterResolver implements Resolve<DettaglioNewsletterBean> {

  constructor(
    protected newsletterService: NewsletterService,
    private spinnerService: SpinnerService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DettaglioNewsletterBean> {
    console.warn("Newsletter Resolver", route);
    const tokenId = route.queryParams['t'];
    console.warn('tokenId',tokenId);

    this.spinnerService.activeSpinner();
    if (tokenId) {
      return this.newsletterService.dettaglioNewsletter(tokenId).pipe(map(
        resp => {
          console.warn("NEWSLETTER DETTAGLIO RESOLVE",resp);
          return resp.obj as DettaglioNewsletterBean;
        }
      ));
    }

    return EMPTY;
  }


}
