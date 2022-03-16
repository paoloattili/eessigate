import { ServiceDeskGuard } from "./../../../../common/guards/service-desk.guard";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BreadcrumbResolver} from "../../../../common/services/breadcrumb.resolver";
import {NewTicketComponent} from "../nuova-richiesta/new-ticket.component";
import {GestioneTicketComponent} from "../gestione-ticket/gestione-ticket.component";
import {MieRichiesteComponent} from "../mie-richieste/mie-richieste.component";
import {TicketResolver} from "./ticket.resolver";
import {DetailTicketComponent} from "../dettaglio-richiesta/detail-ticket.component";
import {RiferimentiComponent} from "../riferimenti/riferimenti.component";

const spazioLavoroRoute: Routes = [
  {
    path: 'nuova-richiesta',
    canActivate: [ServiceDeskGuard],
    canActivateChild: [ServiceDeskGuard],
    canDeactivate: [ServiceDeskGuard],
    canLoad: [ServiceDeskGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Nuova richiesta'
    },
    resolve: {
      result: BreadcrumbResolver
    },
    component: NewTicketComponent,
  },
  {
    path: 'gestione-ticket',
    canActivate: [ServiceDeskGuard],
    canActivateChild: [ServiceDeskGuard],
    canDeactivate: [ServiceDeskGuard],
    canLoad: [ServiceDeskGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Gestione ticket'
    },
    resolve: {
      result: BreadcrumbResolver
    },
    component: GestioneTicketComponent,
  },
  {
    path: 'mie-richieste',
    canActivate: [ServiceDeskGuard],
    canActivateChild: [ServiceDeskGuard],
    canDeactivate: [ServiceDeskGuard],
    canLoad: [ServiceDeskGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Mie richieste'
    },
    resolve: {
      result: BreadcrumbResolver,
    },
    component: MieRichiesteComponent,
  },
  {
    path: 'mie-richieste/dettaglio-richiesta',
    canActivate: [ServiceDeskGuard],
    canActivateChild: [ServiceDeskGuard],
    canDeactivate: [ServiceDeskGuard],
    canLoad: [ServiceDeskGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: ['Mie richieste','Dettaglio Richiesta']
    },
    resolve: {
      result: BreadcrumbResolver,
      richiesta: TicketResolver,
    },
    component: DetailTicketComponent,
  },
  {
    path: 'gestione-ticket/dettaglio-richiesta',
    canActivate: [ServiceDeskGuard],
    canActivateChild: [ServiceDeskGuard],
    canDeactivate: [ServiceDeskGuard],
    canLoad: [ServiceDeskGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: ['Gestione ticket','Dettaglio Richiesta']
    },
    resolve: {
      result: BreadcrumbResolver,
      richiesta: TicketResolver,
    },
    component: DetailTicketComponent,
  },
  {
    path: 'riferimenti',
    canActivate: [ServiceDeskGuard],
    canActivateChild: [ServiceDeskGuard],
    canDeactivate: [ServiceDeskGuard],
    canLoad: [ServiceDeskGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Riferimenti'
    },
    resolve: {
      result: BreadcrumbResolver,
    },
    component: RiferimentiComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/not-found'
  },
];

@NgModule({
  imports: [RouterModule.forChild(spazioLavoroRoute)],
  exports: [RouterModule]
})
export class ServiceDeskRoutingModule {
}
