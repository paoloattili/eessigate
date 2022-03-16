import { DashboardRolloutBucService } from "./service/dashboard-rollout-buc.service";
import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard.component";
import {SharedModule} from "../../../shared/shared.module";
import {DashboardRoutingModule} from "./route/dashboard-routing.module";

@NgModule({
  imports: [SharedModule, DashboardRoutingModule],
  declarations: [DashboardComponent],
  exports: [],
  providers: [
    DashboardRolloutBucService,
  ]
})
export class DashboardModule {}
