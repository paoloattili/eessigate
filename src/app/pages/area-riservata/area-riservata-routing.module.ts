import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

const areaRiservataRoutes: Routes = [
  {
    path: 'home',
    data: { breadcrumb: 'Home'},
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'dashboard-rollout-buc',
    data: { breadcrumb: 'Dashboard Rollout BUC'},
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'contenuti',
    data: { breadcrumb: 'Contenuti'},
    loadChildren: () => import('./contenuti/contenuti.module').then(m => m.ContenutiModule),
  },
  {
    path: 'spazio-di-lavoro',
    data: { breadcrumb: 'Spazio di lavoro'},
    loadChildren: () => import('./spazio-lavoro/spazio-lavoro.module').then(m => m.SpazioLavoroModule),
  },
  {
    path: 'eventi',
    data: { breadcrumb: 'Eventi'},
    loadChildren: () => import('./eventi/eventi.module').then(m => m.EventiModule),
  },
  {
    path: 'newsletters',
    data: { breadcrumb: 'Newsletter'},
    loadChildren: () => import('./newsletter/newsletter.module').then(m => m.NewsletterModule),
  },
  {
    path: 'service-desk',
    data: { breadcrumb: 'Service Desk'},
    loadChildren: () => import('./service-desk/service-desk.module').then(m => m.ServiceDeskModule),
  },

  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/not-found'
  }
];
@NgModule({
  imports: [RouterModule.forChild(areaRiservataRoutes)]
})
export class AreaRiservataRoutingModule {}
