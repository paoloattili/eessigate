import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {DashboardComponent} from "../dashboard.component";
import { BucPlannerGuard } from "src/app/common/guards/buc-planner.guard";
import {BreadcrumbResolver} from "../../../../common/services/breadcrumb.resolver";


@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      canActivate: [BucPlannerGuard],
      canActivateChild: [BucPlannerGuard],
      canDeactivate: [BucPlannerGuard],
      canLoad: [BucPlannerGuard],
      data: {
        activeBreadcrumbLink: true,
        breadcrumb: 'Dashboard Rollout Buc'
      },
      children: [
        {
          path: '',
          component: DashboardComponent,
          data: {
            breadcrumb: ''
          },
          resolve: {
            result: BreadcrumbResolver
          }
        }
      ]
    },
  ])],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
}
