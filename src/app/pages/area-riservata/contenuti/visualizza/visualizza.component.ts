import { observable, Observable } from "rxjs";
import { MessageUtils } from "src/app/utils/message-utils";
import { ContentService } from "./../service/content.service";
import { JsonContentsHome } from "./../../../../model/json-contents-home";
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SpinnerService } from "src/app/common/services/spinner.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogPreviewComponent } from "src/app/common/components/dialog-preview/dialog-preview.component";
import { MatDialog } from "@angular/material/dialog";
import { ContentHomeBean } from "src/app/model/content-home-bean";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatCard } from "@angular/material/card";

@Component({
  selector: 'app-visualizza',
  templateUrl: './visualizza.component.html',
  styleUrls: ['./visualizza.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VisualizzaComponent implements OnInit {

  title = 'Tutti i contenuti';
  listaContenutiPerTipo: JsonContentsHome[] = [];
  listaContenutiNews: ContentHomeBean[] = [];
  listaContenutiNewsEsterne: ContentHomeBean[] = [];
  listaContenutiNewsFormazione: ContentHomeBean[] = [];

  obs1 = new Observable<any>();
  obs2 = new Observable<any>();
  obs3 = new Observable<any>();

  dataSourceNews: MatTableDataSource<ContentHomeBean>;
  dataSourceNewsEsterne: MatTableDataSource<ContentHomeBean>;
  dataSourceNewsFormazione: MatTableDataSource<ContentHomeBean>;

  @ViewChild('news') paginatorNews: MatPaginator;
  @ViewChild('newsEsterne') paginatorNewsEsterne: MatPaginator;
  @ViewChild('newsFormazione') paginatorNewsFormazione: MatPaginator;

  constructor(
    private contentService: ContentService,
    private spinnerService: SpinnerService,
    private router: Router,
    private messageUtils: MessageUtils,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getContenuti();

    this.activatedRoute.queryParams.subscribe(params => {
      this.openModalPreview(params['cryptKey'], true);
    });
  }

  getContenuti() {
    this.spinnerService.activeSpinner();
    this.contentService.getListaContenutiHome().subscribe(
      resp => {
        this.listaContenutiPerTipo = resp.listObj;

        this.setListeContenuti()

        this.setDataSource();

        console.warn('this.listaContenutiPerTipo',this.listaContenutiPerTipo);
      },
      (err) => {
        // console.error(err);
        // this.messageUtils.alertError('Errore nel recupero delle news');
        // this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    )
  }

  openModalPreview(token: string, cryptkey: boolean = false) {
    this.spinnerService.activeSpinner();
    if (!cryptkey) {
      console.warn("Call service without cryptkey");
      this.contentService.getContentPreview(token).subscribe(
        resp => {
          console.log('preview',resp.obj)
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
          // this.messageUtils.alertError('Errore nel caricare la preview')
          // this.spinnerService.closeSpinner()
        },
        () => this.spinnerService.closeSpinner()
      )
    } else {
      console.warn("Call service with cryptkey");
      this.contentService.getContentPreview(null,token).subscribe(
        resp => {
          console.log('preview',resp.obj)
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
          // this.messageUtils.alertError('Errore nel caricare la preview')
          // this.spinnerService.closeSpinner()
        },
        () => this.spinnerService.closeSpinner()
      )
    }
  }

  applyFilter(event: Event, descTipo: string) {

    const filterValue = (event.target as HTMLInputElement).value;

    switch(descTipo) {
      case 'News':
        this.dataSourceNews.filter = filterValue.trim().toLowerCase();
        if (this.dataSourceNews.paginator) {
          this.dataSourceNews.paginator.firstPage();
        }
        break;
      case 'News (External)':
        this.dataSourceNewsEsterne.filter = filterValue.trim().toLowerCase();
        if (this.dataSourceNewsEsterne.paginator) {
          this.dataSourceNewsEsterne.paginator.firstPage();
        }
        break;
      case 'Formazione':
        this.dataSourceNewsFormazione.filter = filterValue.trim().toLowerCase();
        if (this.dataSourceNewsFormazione.paginator) {
          this.dataSourceNewsFormazione.paginator.firstPage();
        }
        break;
    }
  }

  setListeContenuti() {
    this.listaContenutiNews = this.listaContenutiPerTipo.filter(l => l.descTipo === 'News')[0].listaContenutiHome;
    this.listaContenutiNewsEsterne = this.listaContenutiPerTipo.filter(l => l.descTipo === 'News (External)')[0].listaContenutiHome;
    this.listaContenutiNewsFormazione = this.listaContenutiPerTipo.filter(l => l.descTipo === 'Formazione')[0].listaContenutiHome;
  }

  setDataSource() {
    this.dataSourceNews = new MatTableDataSource<ContentHomeBean>(this.listaContenutiNews);
    this.dataSourceNewsEsterne = new MatTableDataSource<ContentHomeBean>(this.listaContenutiNewsEsterne);
    this.dataSourceNewsFormazione = new MatTableDataSource<ContentHomeBean>(this.listaContenutiNewsFormazione);

    this.changeDetectorRef.detectChanges();
    this.dataSourceNews.paginator = this.paginatorNews;
    this.obs1 = this.dataSourceNews.connect();
    this.dataSourceNewsEsterne.paginator = this.paginatorNewsEsterne;
    this.obs2 = this.dataSourceNewsEsterne.connect();
    this.dataSourceNewsFormazione.paginator = this.paginatorNewsFormazione;
    this.obs3 = this.dataSourceNewsFormazione.connect();

    console.warn('this.obs1',this.obs1);
    console.warn('this.obs2',this.obs2);
    console.warn('this.obs3',this.obs3);

  }


}
