import { ContenutiGuard } from "./../../../../common/guards/contenuti.guard";
import { ListContenutiComponent } from "../list-contenuti/list-contenuti.component";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import { ContenutiResolver } from "./contenuti.resolver";
import { NewContentComponent } from "../new/new-content.component";
import { AreaContenutiComponent } from "../layout/area-contenuti.component";
import { BreadcrumbResolver } from "../../../../common/services/breadcrumb.resolver";
import { DettaglioComponent } from "../dettaglio/dettaglio.component";
import { ContenutoResolver } from "./contenuto.resolver";
import { VisualizzaComponent } from "../visualizza/visualizza.component";
import { VisualizzaContenutiGuard } from "src/app/common/guards/visualizza-contenuti.guard";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'crea-contenuti',
      canActivate: [ContenutiGuard],
      canActivateChild: [ContenutiGuard],
      canDeactivate: [ContenutiGuard],
      canLoad: [ContenutiGuard],
      data: {
        activeBreadcrumbLink: true,
        breadcrumb: 'Nuovo Contenuto'
      },
      children: [
        {
          path: '',
          component: NewContentComponent,
          data: {
            breadcrumb: ''
          },
          resolve: {
            result: BreadcrumbResolver
          }
        }
      ]
    },
    {
      path: 'modifica-contenuti',
      canActivate: [ContenutiGuard],
      canActivateChild: [ContenutiGuard],
      canDeactivate: [ContenutiGuard],
      canLoad: [ContenutiGuard],
      data: {
        activeBreadcrumbLink: true,
        breadcrumb: 'Modifica Contenuti'
      },
      children: [
        {
          path: '',
          component: AreaContenutiComponent,
          resolve: {
            sezione: ContenutiResolver
          },
          children: [
            {
              path: '',
              component: ListContenutiComponent,
              data: {
                breadcrumb: ''
              },
              resolve: {
                result: BreadcrumbResolver
              },
            },
            {
              path: 'detail-contenuto',
              component: DettaglioComponent,
              data: {
                activeBreadcrumbLink: true,
                breadcrumb: 'Dettaglio Contenuto'
              },
              resolve: {
                result: BreadcrumbResolver,
                contenuto: ContenutoResolver,
              },
            }
          ]
        }
      ]
    },
    {
      path: 'approva-contenuti',
      canActivate: [ContenutiGuard],
      canActivateChild: [ContenutiGuard],
      canDeactivate: [ContenutiGuard],
      canLoad: [ContenutiGuard],
      data: {
        activeBreadcrumbLink: true,
        breadcrumb: 'Approva Contenuti'
      },
      children: [
        {
          path: '',
          component: AreaContenutiComponent,
          resolve: {
            sezione: ContenutiResolver,
          },
          children: [
            {
              path: '',
              component: ListContenutiComponent,
              data: {
                breadcrumb: ''
              },
              resolve: {
                result: BreadcrumbResolver
              }
            },
              {
                path: 'detail-contenuto',
                component: DettaglioComponent,
                data: {
                  activeBreadcrumbLink: true,
                  breadcrumb: 'Dettaglio Contenuto'
                },
                resolve: {
                  result: BreadcrumbResolver,
                  contenuto: ContenutoResolver,
                },
              },
          ]
        }
      ]
    },
    {
      path: 'pubblica-contenuti',
      canActivate: [ContenutiGuard],
      canActivateChild: [ContenutiGuard],
      canDeactivate: [ContenutiGuard],
      canLoad: [ContenutiGuard],
      data: {
        activeBreadcrumbLink: true,
        breadcrumb: 'Pubblica Contenuti'
      },
      children: [
        {
          path: '',
          component: AreaContenutiComponent,
          resolve: {
            sezione: ContenutiResolver,
          },
          children: [
            {
              path: '',
              component: ListContenutiComponent,
              data: {
                breadcrumb: ''
              },
              resolve: {
                result: BreadcrumbResolver
              },
              children: [
                {
                  path: 'detail-contenuto',
                  component: DettaglioComponent,
                  data: {
                    activeBreadcrumbLink: true,
                    breadcrumb: 'Dettaglio Contenuto'
                  },
                  resolve: {
                    result: BreadcrumbResolver,
                    contenuto: ContenutoResolver,
                  },
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: 'visualizza-contenuti',
      canActivate: [VisualizzaContenutiGuard],
      canActivateChild: [VisualizzaContenutiGuard],
      canDeactivate: [VisualizzaContenutiGuard],
      canLoad: [VisualizzaContenutiGuard],
      data: {
        activeBreadcrumbLink: true,
        breadcrumb: 'Tutti i contenuti'
      },
      component: VisualizzaComponent,
      resolve: {
        result: BreadcrumbResolver
      }
    },
  ])],
  exports: [RouterModule],
})
export class ContenutiRoutingModule {
}
