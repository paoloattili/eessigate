import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {Constants} from "../../../../utils/constants";

@Injectable()
export class SpazioLavoroResolver implements Resolve<number> {

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> | Observable<never>{
    const parentActivatedRoute = route.parent;
    const breadcrumb = parentActivatedRoute.data['breadcrumb'];
    console.warn("workspace resolver",route);

    if( breadcrumb ){
      return of(this.getWorkspaceById(breadcrumb));
    }

    return EMPTY;
  }

  getWorkspaceById(breadcrumb: string): number {
    const workspaceTypeName = breadcrumb;

    let workspaceId;
    switch (workspaceTypeName) {
      case 'NG.EDE Accounting & Deliverables' :
        workspaceId = Constants.accountDeliverables;
        break;
      case 'NG.EDE Documentation' :
        workspaceId = Constants.ngDocumentation;
        break;
      case 'EESSI News & Documentation' :
        workspaceId = Constants.eessiNewsDocumentation;
        break;
      case 'RINA Handover' :
        workspaceId = Constants.rina_handover;
        break;
      default:
        throw new Error('Nessun valore settato');
    }

    return workspaceId;
  }
}
