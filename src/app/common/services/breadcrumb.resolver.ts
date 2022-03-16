import {Injectable} from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import {EMPTY, Observable, of} from 'rxjs';
import {BreadcrumbsService} from "./breadcrumbs.service";
import {Breadcrumb} from "../../class/breadcrumb";

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbResolver implements Resolve<number> {

  constructor(
    private breadcrumbsService: BreadcrumbsService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<number> | Observable<never> {
    let breadcrumbArray: Breadcrumb[] = [];
    let parentActivatedRoute: ActivatedRouteSnapshot;

    console.warn("[breadcrumb] START");

    parentActivatedRoute = route;

    console.warn('parentActivatedRoute',parentActivatedRoute)

    while (parentActivatedRoute) {

        if ((parentActivatedRoute.data['breadcrumb'] && parentActivatedRoute.routeConfig.path) || (parentActivatedRoute.data['breadcrumb'] === 'Home')) {
          // console.warn("[breadcrumb] breadcrumb && routeconfig");

          if (Array.isArray(parentActivatedRoute.data['breadcrumb'])){
            // console.warn("[breadcrumb] breadcrumb length > 1");
            // console.warn("[breadcrumb] data",parentActivatedRoute.data['breadcrumb']);
            let labelsTemp = parentActivatedRoute.data['breadcrumb'];
            let pathsTemp = parentActivatedRoute.routeConfig.path.split("/");

            let count = 0;
            for (let labelTemp of labelsTemp) {
              let path: string = "";
              let label: string = "";
              path = this.generatePath(parentActivatedRoute, pathsTemp[count]);
              label = labelTemp;
              if (parentActivatedRoute.data['activeBreadcrumbLink']){
                breadcrumbArray.push(new Breadcrumb(label,path));
              }
              count++;
            }


          } else {
            let path: string = "";
            let label: string = "";
            label = parentActivatedRoute.data['breadcrumb'];
            if (parentActivatedRoute.data['activeBreadcrumbLink']){
              path = this.generatePath(parentActivatedRoute,parentActivatedRoute.routeConfig.path);
            }
            breadcrumbArray.unshift(new Breadcrumb(label,path));
          }

        }
      parentActivatedRoute = parentActivatedRoute.parent;
    }


    if (breadcrumbArray.length >= 1) {
      this.generateBreadcrumbs(breadcrumbArray);
      return of(0);
    }


    return of(0);
  }

  generateBreadcrumbs(breadcrumbs: Breadcrumb[]) {
    this.breadcrumbsService.generateBreadcrumbs(
      breadcrumbs
    );
  }


  generatePath(activatedRouteSnapshot: ActivatedRouteSnapshot, routePath: string): string  {
      let path = "";
      let urls = [];
      activatedRouteSnapshot['_urlSegment'].segments.forEach(segment => urls.push(segment.path));
      for (let url of urls) {
        console.warn("[breadcrumb] urls", url);
        path += "/" + url;
        if (url === routePath) break;
      }
      return path;
  }
}
