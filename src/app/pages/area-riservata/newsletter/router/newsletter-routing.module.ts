import { NewsletterResolver } from "./newsletter.resolver";
import { DetailNewsletterComponent } from "./../detail-newsletter/detail-newsletter.component";
import { RicercaNewsletterComponent } from "./../ricerca-newsletter/ricerca-newsletter.component";
import { NewsletterGuard } from "./../../../../common/guards/newsletter.guard";
import { InviaNewsletterComponent } from "./../invia-newsletter/invia-newsletter.component";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BreadcrumbResolver} from "../../../../common/services/breadcrumb.resolver";
import {VisualizzaNewsletterComponent} from "../visualizza-newsletter/visualizza-newsletter.component";
import { LoggedGuard } from "src/app/common/guards/logged.guard";

const spazioLavoroRoute: Routes = [
  {
    path: 'visualizza',
    canActivate: [LoggedGuard],
    canActivateChild: [LoggedGuard],
    canDeactivate: [LoggedGuard],
    canLoad: [LoggedGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Visualizza Newsletter'
    },
    resolve: {
      result: BreadcrumbResolver
    },
    component: VisualizzaNewsletterComponent,
  },
  {
    path: 'invia',
    canActivate: [NewsletterGuard],
    canActivateChild: [NewsletterGuard],
    canDeactivate: [NewsletterGuard],
    canLoad: [NewsletterGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Invia Newsletter'
    },
    resolve: {
      result: BreadcrumbResolver
    },
    component: InviaNewsletterComponent,
  },
  {
    path: 'ricerca',
    canActivate: [NewsletterGuard],
    canActivateChild: [NewsletterGuard],
    canDeactivate: [NewsletterGuard],
    canLoad: [NewsletterGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Ricerca Newsletter'
    },
    resolve: {
      result: BreadcrumbResolver
    },
    component: RicercaNewsletterComponent
  },
  {
    path: 'dettaglio',
    canActivate: [NewsletterGuard],
    canActivateChild: [NewsletterGuard],
    canDeactivate: [NewsletterGuard],
    canLoad: [NewsletterGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'Dettaglio Newsletter'
    },
    resolve: {
      result: BreadcrumbResolver,
      newsletter: NewsletterResolver,
    },
    component: DetailNewsletterComponent
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
export class NewsletterRoutingModule {
}
