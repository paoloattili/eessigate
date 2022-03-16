import { AccessDeniedGuard } from "./common/guards/access-denied.guard";
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';

const routes: Routes = [
  //REDIRECT HOME APPLICAZIONE
  {
    path: '',
    loadChildren: () => import('./pages/area-riservata/home/home.module').then(m => m.HomeModule),
  },
  //AREA RISERVATA
  {
    path: 'area-riservata',
    loadChildren: () => import('./pages/area-riservata/area-riservata-routing.module').then(m => m.AreaRiservataRoutingModule),
  },

  //TODO DA IMPLEMENTARE AREA ADMIN
  //TODO DA IMPLEMENTARE AREA PUBBLICA (SVILUPPO FUTURO)

  //ACCESSO NEGATO
  {
    path: 'access-denied',
    canActivate: [AccessDeniedGuard],
    canActivateChild: [AccessDeniedGuard],
    canDeactivate: [AccessDeniedGuard],
    canLoad: [AccessDeniedGuard],
    component: AccessDeniedComponent
  },
  //PAGINA NON TROVATA
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/not-found'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
