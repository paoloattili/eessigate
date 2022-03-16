import { EessiNewsDocumentationGuard } from "./../../../../common/guards/spazio-di-lavoro/eessi-news-documentation.guard";
import { NgDocumentationGuard } from "./../../../../common/guards/spazio-di-lavoro/ng-documentation.guard";
import { DocumentoResolver } from "./documento.resolver";
import { EditDocumentoComponent } from "./../edit/edit-documento.component";
import { BreadcrumbResolver } from "../../../../common/services/breadcrumb.resolver";
import { AccountingDeliverablesGuard } from "./../../../../common/guards/spazio-di-lavoro/accounting-deliverables.guard";
import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {NewDocumentoComponent} from "../new/new-documento.component";
import {SpazioLavoroComponent} from "../layout/spazio-lavoro.component";
import {DetailDocumentoComponent} from "../detail/detail-documento.component";
import {ListDocumentoComponent} from "../list/list-documento.component";
import {SpazioLavoroResolver} from "./spazio-lavoro.resolver";
import {RinaHandoverGuard} from "../../../../common/guards/spazio-di-lavoro/rina-handover.guard";

const spazioLavoroRoute: Routes = [
  {
    path: 'accounting-and-deliverables',
    canActivate: [AccountingDeliverablesGuard],
    canActivateChild: [AccountingDeliverablesGuard],
    canDeactivate: [AccountingDeliverablesGuard],
    canLoad: [AccountingDeliverablesGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'NG.EDE Accounting & Deliverables'
    },
    children: [
      {
        path: '',
        component: SpazioLavoroComponent, // layout in comune per list e new, contiene l'albero delle cartelle
        data: {breadcrumb: ''},
        resolve: {
          workspaceId: SpazioLavoroResolver,
        },
        children: [
          {
            path: '',
            component: ListDocumentoComponent,
            data: {
              breadcrumb: ''
            },
            resolve: {
              result: BreadcrumbResolver,
            },
          },
          {
            path: 'new-documento',
            component: NewDocumentoComponent,
            data: {
              activeBreadcrumbLink: true,
              breadcrumb: 'Carica documento'
            },
            resolve: {
              result: BreadcrumbResolver,
            },
          },
        ],
      },
      {
        path: 'detail-documento',
        component: DetailDocumentoComponent,
        data: {
          activeBreadcrumbLink: true,
          breadcrumb: 'Dettaglio documento'
        },
        resolve: {
          result: BreadcrumbResolver,
          documento: DocumentoResolver,
        },
      },
      {
        path: 'edit-documento',
        component: EditDocumentoComponent,
        data: {
          activeBreadcrumbLink: true,
          breadcrumb: 'Modifica documento'
        },
        resolve: {
          result: BreadcrumbResolver,
          documento: DocumentoResolver,
          workspaceId: SpazioLavoroResolver,
        },
      }
    ],
  },
  {
    path: 'ng-documentation',
    canActivate: [NgDocumentationGuard],
    canActivateChild: [NgDocumentationGuard],
    canDeactivate: [NgDocumentationGuard],
    canLoad: [NgDocumentationGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'NG.EDE Documentation'
    },
    children: [
      {
        path: '',
        component: SpazioLavoroComponent, // layout in comune per list e new, contiene l'albero delle cartelle
        resolve: {
          workspaceId: SpazioLavoroResolver,
        },
        children: [
          {
            path: '',
            component: ListDocumentoComponent,
            data: {
              breadcrumb: ''
            },
            resolve: {
              result: BreadcrumbResolver,
            },
          },
          {
            path: 'new-documento',
            component: NewDocumentoComponent,
            data: {
              activeBreadcrumbLink: true,
              breadcrumb: 'Carica documento'
            },
            resolve: {
              result: BreadcrumbResolver,
            },
          },
        ],
      },
      {
        path: 'detail-documento',
        component: DetailDocumentoComponent,
        data: {
          activeBreadcrumbLink: true,
          breadcrumb: 'Dettaglio documento'
        },
        resolve: {
          result: BreadcrumbResolver,
          documento: DocumentoResolver,
        },
      },
      {
        path: 'edit-documento',
        component: EditDocumentoComponent,
        data: {
          activeBreadcrumbLink: true,
          breadcrumb: 'Modifica documento'
        },
        resolve: {
          result: BreadcrumbResolver,
          documento: DocumentoResolver,
        },
      }
    ],
  },
  {
    path: 'eessi-news-documentation',
    canActivate: [EessiNewsDocumentationGuard],
    canActivateChild: [EessiNewsDocumentationGuard],
    canDeactivate: [EessiNewsDocumentationGuard],
    canLoad: [EessiNewsDocumentationGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'EESSI News & Documentation'
    },
    children: [
      {
        path: '',
        component: SpazioLavoroComponent, // layout in comune per list e new, contiene l'albero delle cartelle
        resolve: {
          workspaceId: SpazioLavoroResolver,
        },
        children: [
          {
            path: '',
            component: ListDocumentoComponent,
            data: {
              breadcrumb: ''
            },
            resolve: {
              result: BreadcrumbResolver,
            },
          },
          {
            path: 'new-documento',
            component: NewDocumentoComponent,
            data: {
              activeBreadcrumbLink: true,
              breadcrumb: 'Carica documento'
            },
            resolve: {
              result: BreadcrumbResolver,
            },
          },
        ],
      },
      {
        path: 'detail-documento',
        component: DetailDocumentoComponent,
        data: {
          activeBreadcrumbLink: true,
          breadcrumb: 'Dettaglio documento'
        },
        resolve: {
          result: BreadcrumbResolver,
          documento: DocumentoResolver,
        },
      },
      {
        path: 'edit-documento',
        component: EditDocumentoComponent,
        data: {
          activeBreadcrumbLink: true,
          breadcrumb: 'Modifica documento'
        },
        resolve: {
          result: BreadcrumbResolver,
          documento: DocumentoResolver,
        },
      }
    ],
  },
  {
    path: 'rina-handover',
    canActivate: [RinaHandoverGuard],
    canActivateChild: [RinaHandoverGuard],
    canDeactivate: [RinaHandoverGuard],
    canLoad: [RinaHandoverGuard],
    data: {
      activeBreadcrumbLink: true,
      breadcrumb: 'RINA Handover'
    },
    children: [
      {
        path: '',
        component: SpazioLavoroComponent, // layout in comune per list e new, contiene l'albero delle cartelle
        data: {breadcrumb: ''},
        resolve: {
          workspaceId: SpazioLavoroResolver,
        },
        children: [
          {
            path: '',
            component: ListDocumentoComponent,
            data: {
              breadcrumb: ''
            },
            resolve: {
              result: BreadcrumbResolver,
            },
          },
          {
            path: 'new-documento',
            component: NewDocumentoComponent,
            data: {
              activeBreadcrumbLink: true,
              breadcrumb: 'Carica documento'
            },
            resolve: {
              result: BreadcrumbResolver,
            },
          },
        ],
      },
      {
        path: 'detail-documento',
        component: DetailDocumentoComponent,
        data: {
          activeBreadcrumbLink: true,
          breadcrumb: 'Dettaglio documento'
        },
        resolve: {
          result: BreadcrumbResolver,
          documento: DocumentoResolver,
        },
      },
      {
        path: 'edit-documento',
        component: EditDocumentoComponent,
        data: {
          activeBreadcrumbLink: true,
          breadcrumb: 'Modifica documento'
        },
        resolve: {
          result: BreadcrumbResolver,
          documento: DocumentoResolver,
          workspaceId: SpazioLavoroResolver,
        },
      }
    ],
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
export class SpazioLavoroRoutingModule {
}
