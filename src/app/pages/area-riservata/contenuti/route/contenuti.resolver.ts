import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { Constants } from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class ContenutiResolver implements Resolve<number> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> | Observable<never> {
    const breadcrumb = route.data['breadcrumb'];

    if( breadcrumb ){
      return of(this.getSezioneContenuti(breadcrumb));
    }

    return EMPTY;
  }

  getSezioneContenuti(breadcrumb: string): number {
    const sezioneTypeName = breadcrumb;
    let sezione;
    switch (sezioneTypeName) {
      case 'Modifica Contenuti' :
        sezione = Constants.modificaContenuto;
        break;
      case 'Approva Contenuti' :
        sezione = Constants.approvaContenuto;
        break;
      case 'Pubblica Contenuti' :
        sezione = Constants.pubblicaContenuto;
        break;
      default:
        throw new Error('Nessun valore settato');
    }

    return sezione;
  }
}
