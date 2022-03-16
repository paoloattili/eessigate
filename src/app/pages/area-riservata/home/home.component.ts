import { DocumentoService } from "./../spazio-lavoro/service/documento.service";
import { ContentService } from "./../contenuti/service/content.service";
import { DocumentiHomeBean } from "./../../../model/documenti-home-bean";
import { MessageUtils } from "./../../../utils/message-utils";
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs-compat';
import { filter, map } from 'rxjs/operators';
import { Breadcrumb } from 'src/app/class/breadcrumb';
import { User } from 'src/app/model/user';
import { SpinnerService } from 'src/app/common/services/spinner.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HomepageService } from "./service/homepage.service";
import { JsonContentsHome } from "src/app/model/json-contents-home";
import { MatDialog } from "@angular/material/dialog";
import { DialogPreviewComponent } from "src/app/common/components/dialog-preview/dialog-preview.component";
import { Constants } from "src/app/utils/constants";
import { DownloadUtils } from "src/app/utils/download-utils";
import { HttpResponse } from "@angular/common/http";
import {BreadcrumbsService} from "../../../common/services/breadcrumbs.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  title = 'Novità';
  user: User;
  ultimiDocumenti: DocumentiHomeBean[] = [];
  documentiTopCommentati: DocumentiHomeBean[] = [];
  ultimeNews: JsonContentsHome[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService,
    private messageutils: MessageUtils,
    private homeService: HomepageService,
    private contentServices: ContentService,
    private documentoServices: DocumentoService,
    private breadcrumbsService: BreadcrumbsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
     this.activatedRoute.data.subscribe(data => {

      // this.breadcrumbsService.generateBreadcrumbs([new Breadcrumb("","")]);

      //CONTROLLO REDIRECT DA NOT FOUND
      this.checkNotFound(this.activatedRoute);
      //CONTROLLO REDIRECT DA NOT AUTHORIZE
      this.checkNotAuth(this.activatedRoute);
    });

    this.getHomeContents();

  }

  getHomeContents() {
    this.spinnerService.activeSpinner();
    Observable.forkJoin(
      this.homeService.getUltimiDocumenti(),
      this.homeService.getDocumentiTopCommentati(),
      this.homeService.getHomeContent()
    ).subscribe(
      resp => {
        console.warn('ULTIMI DOCUMENTI',resp[0]?.listObj);
        this.ultimiDocumenti = resp[0]?.listObj;
        console.warn('DOCUMENTI TOP COMMENTATI',resp[1]?.listObj);
        this.documentiTopCommentati = resp[1]?.listObj;
        console.warn('ULTIME NEWS',resp[2]?.listObj);
        this.ultimeNews = resp[2]?.listObj;
      },
      (err) => {
        // console.error(err);
        // this.spinnerService.closeSpinner()
        // this.messageutils.alertError('Errore nel recupero dei contenuti della home');
      },
      () => this.spinnerService.closeSpinner()
    )
  }

  private checkNotFound(route: ActivatedRoute) {
    const isNotFound = route.routeConfig? route.routeConfig.data['not_found'] : false;

    if(isNotFound) {
      this.messageutils.alertWarning('Errore 404! Risorsa non trovata.', 2000);
      this.router.navigate(['']);
    }
  }

  private checkNotAuth(route: ActivatedRoute) {
    const isNotFound = route.routeConfig? route.routeConfig.data['not_authorize'] : false;

    if(isNotFound) {
      this.messageutils.alertWarning('Errore 401! Non sei autorizzato ad accedere alla risorsa.', 1000);
      this.router.navigate(['']);
    }
  }

  openModalPreview(token: string) {
    this.spinnerService.activeSpinner();
    this.contentServices.getContentPreview(token).subscribe(
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
        // this.spinnerService.closeSpinner()
        // this.messageutils.alertError('Errore nel caricare la preview')
      },
      () => this.spinnerService.closeSpinner()
    )
  }

  vaiANews() {
    this.router.navigate(['area-riservata/contenuti/visualizza-contenuti']);
  }

  goToDetail(d: DocumentiHomeBean) {

    if(!d) this.messageutils.alertError('Non è stato possibile andare al dettaglio del documento');
    else {
      console.warn('documento: ',d);
      let url;

      switch(d.workspace) {
        case 'NG.EDE Accounting & Deliverables' :
              url = 'accounting-and-deliverables';
              break;
        case 'NG.EDE Documentation' :
              url = 'ng-documentation';
              break;
        case 'EESSI News & Documentation' :
              url = 'eessi-news-documentation';
              break;
        default: throw new Error('Nessun valore settato');
      }

      this.spinnerService.activeSpinner();
      this.router.navigate([`area-riservata/spazio-di-lavoro/${url}/detail-documento`],{queryParams: {t: d.token}}).then(() => this.spinnerService.closeSpinner());
    }

  }

  downloadDocumento(tokenId: string) {
    this.spinnerService.activeSpinner();
    this.documentoServices.downloadAttachment(tokenId).subscribe(
      (resp: HttpResponse<any>) => {
        if(resp && resp.headers) {
          const headers = resp.headers;
          DownloadUtils.downloadAttachments(resp.body, headers.get('content-type'),headers.get('content-disposition'));
        }else this.messageutils.alertError('Errore nel download del documento!')
      },
      (err) => {
        // this.messageutils.alertError('Errore nel download del documento!')
        // this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    );
  }

}
