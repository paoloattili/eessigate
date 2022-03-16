import { DocumentoService } from "./service/documento.service";
import {NgModule} from "@angular/core";
import {SpazioLavoroRoutingModule} from "./route/spazio-lavoro-routing.module";
import {SpazioLavoroComponent} from "./layout/spazio-lavoro.component";
import {NewDocumentoComponent} from "./new/new-documento.component";
import {SharedModule} from "../../../shared/shared.module";
import {DetailDocumentoComponent} from "./detail/detail-documento.component";
import {ListDocumentoComponent} from "./list/list-documento.component";
import {TreeService} from "./service/tree.service";
import {FormsModule} from "@angular/forms";
import {SpazioLavoroResolver} from "./route/spazio-lavoro.resolver";
import {DocumentoResolver} from "./route/documento.resolver";
import {RicercaComponent} from "./layout/ricerca/ricerca.component";
import {EditDocumentoComponent} from "./edit/edit-documento.component";
import {DirectivesModule} from "../../../common/directives/directives.module";
import {ComponentsModule} from "../../../common/components/components.module";

@NgModule({
    imports: [
        SpazioLavoroRoutingModule,
        SharedModule,
        FormsModule,
        DirectivesModule,
        ComponentsModule,
    ],
    declarations: [
        SpazioLavoroComponent,
        RicercaComponent,
        ListDocumentoComponent,
        NewDocumentoComponent,
        DetailDocumentoComponent,
        EditDocumentoComponent,
    ],
    providers: [
        TreeService,
        DocumentoService,
        SpazioLavoroResolver,
        DocumentoResolver,
    ],
})
export class SpazioLavoroModule {
  constructor() {
    console.warn("SPAZIOLAVORO MODULE CONSTRUCTOR");
  }
}
