import { Constants } from "./../../../../utils/constants";
import { AfterContentChecked, AfterViewChecked, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Breadcrumb } from 'src/app/class/breadcrumb';
import { SpinnerService } from 'src/app/common/services/spinner.service';
import { ContentByStatus } from "src/app/model/content-by-status";
import { MessageUtils } from "src/app/utils/message-utils";
import { FormControl } from "@angular/forms";
import { MatDialog,  } from "@angular/material/dialog";
import { ContentTypeSelect } from "src/app/model/content-type-select";
import { ContentService } from "../service/content.service";
import { TipologicheService } from "src/app/common/services/tipologiche.service";
import { DialogPreviewComponent } from "src/app/common/components/dialog-preview/dialog-preview.component";
import { ConfirmDialogComponent } from "./confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-list-contenuti',
  templateUrl: './list-contenuti.component.html',
  styleUrls: ['./list-contenuti.component.scss']
})
export class ListContenutiComponent implements OnInit {

  statusBySezione: number;
  contentTypes: ContentTypeSelect[] = [];
  tokenIdContentType: string;

  dataSource: MatTableDataSource<ContentByStatus>;
  displayedColumns: string[] = [
    'dataModifica', 'titolo', 'status', 'wfNote', 'preview', 'actions'
  ];

  filtraTipoContenuti: FormControl = new FormControl();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: ContentService,
    private tipologicheService: TipologicheService,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    public dialog: MatDialog
  ) { }

  ngOnInit() {

    console.warn('sono in list-component')
    this.activatedRoute.data.subscribe(data => {
      this.statusBySezione = data['sezione'];
      this.getContenuti(this.statusBySezione);
    });

    this.filtraTipoContenuti.valueChanges.subscribe(t => {
      this.getContenuti(this.statusBySezione,t);
    });

    this.getTipiContenuto();
  }

  getContenuti(status: number, tipo?: string) {
    this.spinnerService.activeSpinner()
    switch(status) {
      case Constants.modificaContenuto:
        this.service.getContenutiInBozza(tipo).subscribe(
          resp => {
            this.dataSource = new MatTableDataSource(resp.listObj);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          (err) => {
            // console.error(err);
            // this.spinnerService.closeSpinner();
            // this.messageUtils.alertError('Errore nel recupero dei contenuti')
          },
          () => this.spinnerService.closeSpinner()
        );
        break;
      case Constants.approvaContenuto:
        this.service.getContenutiDaApprovare(tipo).subscribe(
          resp => {
            this.dataSource = new MatTableDataSource(resp.listObj);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          (err) => {
            // console.error(err);
            // this.messageUtils.alertError('Errore nel recupero dei contenuti');
            // this.spinnerService.closeSpinner();
          },
          () => this.spinnerService.closeSpinner()
        );
        break;
      case Constants.pubblicaContenuto:
        this.service.getContenutiDaPubblicare(tipo).subscribe(
          resp => {
            this.dataSource = new MatTableDataSource(resp.listObj);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          (err) => {
            // console.error(err);
            // this.messageUtils.alertError('Errore nel recupero dei contenuti');
            // this.spinnerService.closeSpinner();
          },
          () => this.spinnerService.closeSpinner()
        );
        break;
      default: throw new Error('Nessun valore settato');
    }
  }

  changeContentType(event) {
    console.warn("[event]",event);
    console.warn("[event.target]",event.target);
  }

  getTipiContenuto() {
    this.spinnerService.activeSpinner();
    this.tipologicheService.getListaTipiContenuti().subscribe(
      resp => {
        const genericType = new ContentTypeSelect();
        genericType.nome = 'Tutti';
        genericType.token = null;
        let arrTemp = [genericType];
        this.contentTypes = arrTemp.concat(resp.listObj);
      },
      (err) => {
        // this.spinnerService.closeSpinner();
        // this.messageUtils.alertError('Errore nel recupero delle tipologie di contenuto');
        // console.error(err);
      },
      () => this.spinnerService.closeSpinner()
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openModalPreview(token: string) {
    this.spinnerService.activeSpinner();
    this.service.getContentPreview(token).subscribe(
      resp => {
        const dialogRef = this.dialog.open(
          DialogPreviewComponent,
          {
            data: resp.obj,
            width: '50rem',
            disableClose: true,
            autoFocus: false
          }
        );
      },
      (err) => {
        // console.error(err);
        // this.spinnerService.closeSpinner();
        // this.messageUtils.alertError('Errore nel caricare la preview')
      },
      () => this.spinnerService.closeSpinner()
    )
  }

  goToDetail(token: string) {
    this.router.navigate(['detail-contenuto'],{queryParams: {t: token}, relativeTo: this.activatedRoute});
  }

  doApprove(token: string) {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          tipo: 1,
          stato: 'DA_APPROVARE',
          token: token,
          isElimina: false
        },
        width: '35rem',
        disableClose: true
      }
    );
  }

  doPubblica(token: string) {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          tipo: 2,
          stato: 'DA_PUBBLICARE',
          token: token,
          isElimina: false
        },
        width: '35rem',
        disableClose: true
      }
    );
  }

  dePubblica(token: string) {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          tipo: 2,
          stato: 'PUBBLICATO',
          token: token,
          isElimina: false
        },
        width: '35rem',
        disableClose: true
      }
    );
  }

  delete(token: string) {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          tipo: null,
          stato: null,
          token: token,
          isElimina: true
        },
        width: '35rem',
        disableClose: true
      }
    );
  }

  rigetta(token: string) {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          tipo: 1 | 2,
          stato: 'RIGETTA',
          token: token,
          isElimina: false
        },
        width: '35rem',
        disableClose: true
      }
    );
  }

}
