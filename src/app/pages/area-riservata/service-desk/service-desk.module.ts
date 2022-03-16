
import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {ServiceDeskRoutingModule} from "./router/service-desk-routing.module";
import { NewTicketComponent } from './nuova-richiesta/new-ticket.component';
import {ServiceDeskService} from "./service/service-desk.service";
import {SpazioLavoroModule} from "../spazio-lavoro/spazio-lavoro.module";
import {DirectivesModule} from "../../../common/directives/directives.module";
import { GestioneTicketComponent } from './gestione-ticket/gestione-ticket.component';
import { DetailTicketComponent } from './dettaglio-richiesta/detail-ticket.component';
import {TicketResolver} from "./router/ticket.resolver";
import { RiferimentiComponent } from './riferimenti/riferimenti.component';
import {MieRichiesteComponent} from "./mie-richieste/mie-richieste.component";
import {ComponentsModule} from "../../../common/components/components.module";

@NgModule({
    imports: [
        SharedModule,
        ServiceDeskRoutingModule,
        SpazioLavoroModule,
        DirectivesModule,
        ComponentsModule,
    ],
  declarations: [
    NewTicketComponent,
    GestioneTicketComponent,
    MieRichiesteComponent,
    DetailTicketComponent,
    RiferimentiComponent,
  ],
  providers: [
    ServiceDeskService,
    TicketResolver,
  ]
})
export class ServiceDeskModule {
  constructor() {
    console.warn("SERVICE DESK MODULE!");
  }
}
