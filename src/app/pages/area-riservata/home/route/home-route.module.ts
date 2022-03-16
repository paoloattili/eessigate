import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {HomeComponent} from "../home.component";
import { LoggedGuard } from "src/app/common/guards/logged.guard";
import { BreadcrumbResolver } from "../../../../common/services/breadcrumb.resolver";
import { NotFoundGuard } from "src/app/common/guards/not-found.guard";
import { NotAuthorizeGuard } from "src/app/common/guards/not-authorize.guard";


@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: HomeComponent,
      canActivate: [LoggedGuard],
      canActivateChild: [LoggedGuard],
      canDeactivate: [LoggedGuard],
      canLoad: [LoggedGuard],
      data: {
        breadcrumb: 'Home'
      },
      resolve: {
        result: BreadcrumbResolver
      }
    },
    {
      path: 'not-found',
      component: HomeComponent,
      canActivate: [NotFoundGuard],
      canActivateChild: [NotFoundGuard],
      canDeactivate: [NotFoundGuard],
      canLoad: [NotFoundGuard],
      data: {breadcrumb: 'Home', not_found: true},
      resolve: {
        result: BreadcrumbResolver
      }
    },
    {
      path: 'not-authorize',
      component: HomeComponent,
      canActivate: [NotAuthorizeGuard],
      canActivateChild: [NotAuthorizeGuard],
      canDeactivate: [NotAuthorizeGuard],
      canLoad: [NotAuthorizeGuard],
      data: {breadcrumb: 'Home', not_authorize: true},
      resolve: {
        result: BreadcrumbResolver
      }
    }
  ])],
  exports: [RouterModule],
})
export class HomeRouteModule {
}
