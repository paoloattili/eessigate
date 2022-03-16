import { ContenutiResolver } from "./route/contenuti.resolver";
import {NgModule} from "@angular/core";
import {ListContenutiComponent} from "./list-contenuti/list-contenuti.component";
import {SharedModule} from "../../../shared/shared.module";
import { ContenutiRoutingModule } from "./route/contenuti-routing.module";
import { NewContentComponent } from './new/new-content.component';
import { DirectivesModule } from "src/app/common/directives/directives.module";
import { VisualizzaComponent } from "./visualizza/visualizza.component";
import { DettaglioComponent } from "./dettaglio/dettaglio.component";
import { AreaContenutiComponent } from "./layout/area-contenuti.component";
import { ConfirmDialogComponent } from "./list-contenuti/confirm-dialog/confirm-dialog.component";
import { ContentService } from "./service/content.service";
import { BreadcrumbResolver } from "../../../common/services/breadcrumb.resolver";
import { ContenutoResolver } from "./route/contenuto.resolver";

@NgModule({
  imports: [
    SharedModule,
    ContenutiRoutingModule,
    DirectivesModule
  ],
  declarations: [ListContenutiComponent, NewContentComponent, VisualizzaComponent, DettaglioComponent, AreaContenutiComponent, ConfirmDialogComponent],
  entryComponents: [ConfirmDialogComponent],
  exports: [],
  providers: [
    ContentService,
    BreadcrumbResolver,
    ContenutiResolver,
    ContenutoResolver
  ]
})
export class ContenutiModule {}
