import { CalendarioGuard } from "./../../../../common/guards/calendario.guard";
import { EventiGuard } from "./../../../../common/guards/eventi.guard";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CalendarioComponent} from "../calendario/calendario.component";
import {NewEventoComponent} from "../nuovo-evento-stepper/new-evento.component";
import {EventoResolver} from "./evento.resolver";
import {DetailEventoComponent} from "../detail/detail-evento.component";
import {EditEventoComponent} from "../edit/edit-evento.component";
import {SchedaEventoResolver} from "./schedaEvento.resolver";
import {BreadcrumbResolver} from "../../../../common/services/breadcrumb.resolver";

const EventiRoute: Routes = [
  {
    path: 'calendario',
    canActivate: [CalendarioGuard],
    canActivateChild: [CalendarioGuard],
    canDeactivate: [CalendarioGuard],
    canLoad: [CalendarioGuard],
    component: CalendarioComponent,
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Calendario'
    },
    resolve: {
      result: BreadcrumbResolver,
    }
  },
  {
    path: 'nuovo',
    canActivate: [EventiGuard],
    canActivateChild: [EventiGuard],
    canDeactivate: [EventiGuard],
    canLoad: [EventiGuard],
    component: NewEventoComponent,
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Nuovo Evento'
    },
    resolve: {
      result: BreadcrumbResolver,
    }
  },
  {
    path: 'dettaglio',
    canActivate: [CalendarioGuard],
    canActivateChild: [CalendarioGuard],
    canDeactivate: [CalendarioGuard],
    canLoad: [CalendarioGuard],
    component: DetailEventoComponent,
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Dettaglio Evento'
    },
    resolve: {
      evento: SchedaEventoResolver,
      result: BreadcrumbResolver,
    }
  },
  {
    path: 'modifica',
    canActivate: [EventiGuard],
    canActivateChild: [EventiGuard],
    canDeactivate: [EventiGuard],
    canLoad: [EventiGuard],
    component: EditEventoComponent,
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Modifica Evento'
    },
    resolve: {
      evento: EventoResolver,
      result: BreadcrumbResolver,
    }
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/not-found'
  },
];

@NgModule({
  imports: [RouterModule.forChild(EventiRoute)],
  exports: [RouterModule]
})
export class EventiRoutingModule {
}
