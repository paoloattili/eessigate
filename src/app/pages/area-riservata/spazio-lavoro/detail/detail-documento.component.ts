import { SpinnerService } from "../../../../common/services/spinner.service";
import { DettaglioDocumento } from "../../../../model/dettaglio-documento";
import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {CommentoForm} from "../../../../model/commento";
import {HttpResponse} from "@angular/common/http";
import {MessageUtils} from "../../../../utils/message-utils";
import {Location} from "@angular/common";
import {Like} from "../../../../model/like";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginService} from "../../../../common/services/login.service";
import {Tag} from "../../../../model/tag";
import { DocumentoService } from "../service/documento.service";
import { DownloadUtils } from "src/app/utils/download-utils";
import { LikeBean } from "../model/social.model";
import { User } from "src/app/model/user";
import { WebsocketNotifiche } from "src/app/utils/websocket-notifiche";

@Component({
  selector: 'app-dettaglio-documento',
  templateUrl: './detail-documento.component.html',
  styleUrls: ['./detail-documento.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailDocumentoComponent implements OnInit, OnDestroy {

  title: string = "Dettaglio documento";
  documento: DettaglioDocumento;
  tokenIdDocumento: string; // necessario per il get detail document
  urlDocumento: string;
  tagsDocumento: Tag[];
  canDo: boolean;
  user: User;

  likeAttivato: boolean = true;

  constructor(
    private documentoService: DocumentoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    private _snackBar: MatSnackBar,
    private loginService: LoginService
  ) {
  }

  ngOnInit(): void {
    this.getUser();

    this.activatedRoute.data.subscribe(data => {
      console.warn("DATA detail documento", data);
      this.documento = data['documento'];
      this.tagsDocumento = Array.from(this.documento.tags);
      this.documento.likes.forEach( (like:Like) => {
        if (like.author ===  this.loginService.getUserLogged().denominazione) {
          this.likeAttivato = false;
        }
      });
      this.canDoActions();
      this.spinnerService.closeSpinner();
    });

    this.activatedRoute.queryParams.subscribe( queryParams => {
      console.warn("PARAMS detail documento", queryParams);
      this.tokenIdDocumento = queryParams['t'];
    });

    // todo da cambiare con il localhost corretto
    console.warn('this.location',this.location);
    
    this.urlDocumento = location.host + '/AS0207/EESSIGateWEB/#' + this.location.path();

  }

  ngOnDestroy(): void {
  }

  /**
   * AZIONI BOTTONI
   */
  inviaComment(commentoFormEvent: CommentoForm): void {
    console.warn("Invia comment", commentoFormEvent);
    const commentoForm = {
      ...commentoFormEvent,
      tokenDocumentId: this.tokenIdDocumento,
    }
    this.spinnerService.activeSpinner();
    this.documentoService.inserisciCommento(commentoForm).subscribe(resp => {
      console.warn("INSERIMENTO COMMENTO RESP",resp);
      this.documento.comments = resp.listObj;
      this.spinnerService.closeSpinner();
      // setTimeout(t => this.websocketNotifiche._send(resp.obj), 2000);
    });
  }

  editDocumento(): void {
    const tokenId: string = this.tokenIdDocumento ? this.tokenIdDocumento : '';
    this.spinnerService.activeSpinner();
    this.router.navigate(['../edit-documento'], {queryParams: {t: tokenId}, relativeTo: this.activatedRoute})
      .then(() => this.spinnerService.closeSpinner());
  }

  deleteDocumento(): void {
    this.spinnerService.activeSpinner();
    const tokenId: string = this.tokenIdDocumento ? this.tokenIdDocumento : '';
    this.spinnerService.activeSpinner();
    this.documentoService.eliminaDocumento(tokenId).subscribe(resp => {
      this.router.navigate(['../'], {queryParams: {t: tokenId}, relativeTo: this.activatedRoute})
        .then(() => {
          this.spinnerService.closeSpinner();
          this.messageUtils.alertSuccess(resp.messaggio.messaggio);
        });
      console.warn("[detail-documento][deleteDocumento]Documento eliminato",resp)
    },
    (err) => {
      // console.error(err);
      // this.spinnerService.closeSpinner()
      // this.messageUtils.alertError('Errore nell\'eliminazione del documento');
    },
    () => this.spinnerService.closeSpinner());
  }

  downloadDocumento(): void {
    const tokenId: string = this.tokenIdDocumento ? this.tokenIdDocumento : '';
    this.spinnerService.activeSpinner()
    this.documentoService.downloadAttachment(tokenId).subscribe(
      (resp: HttpResponse<any>) => {
        if(resp && resp.headers) {
          const headers = resp.headers;
          DownloadUtils.downloadAttachments(resp.body, headers.get('content-type'),headers.get('content-disposition'));
        }else this.messageUtils.alertError('Errore nel download del documento!')
      },
      (err) => {
        // this.messageUtils.alertError('Errore nel download del documento!')
        // this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    );
  }

  /**
   * Azioni bottoni social
   */
  likeToogle(): void {
    let likes: LikeBean[] = [];
    const tokenId: string = this.tokenIdDocumento ? this.tokenIdDocumento : '';
    this.documentoService.clickLike(tokenId).subscribe(resp => {
      likes = resp.listObj;
      this.likeAttivato = !this.likeAttivato;
      this.documento.likes = new Set(likes);
      console.warn("Riposta server like:",resp);
      this.documento.countLike = this.documento.likes.size;
      // setTimeout(t => this.websocketNotifiche._send(resp.obj), 2000);
    });
  }


  eliminaCommento(event: any): void {
    const tokenId: string = event ? event : '';
    console.warn("ELIMINA COMMENTO TOKEN ID",tokenId);
    this.spinnerService.activeSpinner();
    this.documentoService.eliminaCommento(tokenId).subscribe(resp => {
      console.warn("Riposta server comments:",resp);
      this.documento.comments = resp.listObj;
      this.spinnerService.closeSpinner();
    });
  }

  canDoActions() {
    const uploader = this.documento.uploader;
    if(uploader && (uploader === this.user.userId || this.user.amministratore))
      this.canDo = true
  }

  getUser() {
    this.user = localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')) : null;
    if(!this.user) {
      this.messageUtils.alertError('Dati utente non recuperati.');
      location.reload();
    }
  }

  // metodi utili
  openSnackBar(): void {
    this._snackBar.open("URL copiata!", '',{duration: 2000});
  }


}
