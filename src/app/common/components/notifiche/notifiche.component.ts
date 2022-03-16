import { LoginService } from "src/app/common/services/login.service";
import { MessageUtils } from "./../../../utils/message-utils";
import { NotificheService } from "./../../services/notifiche.service";
import { SpinnerService } from "src/app/common/services/spinner.service";
import { Notifica } from "./../../../model/notifica";
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WebsocketNotifiche } from 'src/app/utils/websocket-notifiche';
import { User } from "src/app/model/user";
import { Router } from "@angular/router";
import { Constants } from "src/app/utils/constants";
import { MatDialog } from "@angular/material/dialog";
import { DialogPreviewComponent } from "../dialog-preview/dialog-preview.component";
import { ContentService } from "src/app/pages/area-riservata/contenuti/service/content.service";

@Component({
  selector: 'app-notifiche',
  templateUrl: './notifiche.component.html',
  styleUrls: ['./notifiche.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotificheComponent implements OnInit {

  notifiche: Notifica[] = [];
  countNotifiche: number = null;

  constructor(
    private notificheService: NotificheService,
    private messageUtils: MessageUtils,
    private router: Router,
    private spinnerService: SpinnerService,
    // private websocketNotifiche: WebsocketNotifiche,
    private service: ContentService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    // this.websocketNotifiche._connect();

    this.getAllNotifiche();

    this.notificheService.getNotifiche().subscribe(n => {
      this.notifiche = n;
      let notificheToRead = this.notifiche?.filter(n => n.toRead == false);
      this.countNotifiche = notificheToRead?.length > 0? notificheToRead?.length : null;
      // console.warn('this.notifiche',this.notifiche);
    });

    // setInterval(n => this.getAllNotifiche(), 5000);
    
  }

  getAllNotifiche() {
    if(localStorage.getItem('user')) {
      this.notificheService.listNotifiche().subscribe(
        resp => {
          this.notificheService.setNotifiche(resp.listObj);
          this.notifiche = resp.listObj;
          if(this.notifiche?.length > 0 ) {
            let notificheToRead = this.notifiche?.filter(n => n.toRead == false);
            this.countNotifiche = notificheToRead?.length > 0? notificheToRead?.length : null;
            // console.warn('this.notifiche',this.notifiche);
          } else {
            this.countNotifiche = null;
          }
          // console.warn('this.countNotifiche',this.countNotifiche);
        },
        (err) => {
          console.error(err);
          this.messageUtils.alertError('Errore nel recupero delle notifiche');
        }
      )
    }
  }

  goToNotifica(notifica: Notifica) {
    if(notifica) {
      this.spinnerService.activeSpinner();
      console.warn('notifica',notifica);  
      this.notificheService.leggiNotifica(notifica.tokenNotificaId).subscribe(
        resp => {

          console.warn(resp.messaggio?.messaggio);

          if(!notifica.toRead) {
            this.countNotifiche = this.countNotifiche > 1 ? this.countNotifiche - 1 : null;
            notifica.toRead = true;
          }

          let tipo = notifica.idNotificationType;

          if(tipo === 1 
            || tipo === 2
            || tipo === 4) {
            let workspace = notifica.workspace;
            switch (workspace) {
              case 'NG.EDE Accounting & Deliverables' :
                this.router.navigate([`/area-riservata/spazio-di-lavoro/accounting-and-deliverables/detail-documento`],{queryParams: {t: notifica.tokenRecordId}});
                break;
              case 'NG.EDE Documentation' :
                this.router.navigate([`/area-riservata/spazio-di-lavoro/ng-documentation/detail-documento`],{queryParams: {t: notifica.tokenRecordId}});
                break;
              case 'EESSI News & Documentation' :
                this.router.navigate([`/area-riservata/spazio-di-lavoro/eessi-news-documentation/detail-documento`],{queryParams: {t: notifica.tokenRecordId}});
                break;
              default:
                throw new Error('Nessun valore settato');
            }
          }

          if(tipo === 3) {
            this.service.getContentPreview(notifica.tokenRecordId).subscribe(
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
                console.error(err);
                this.spinnerService.closeSpinner();
                this.messageUtils.alertError('Errore nel caricare la preview')
              },
              () => this.spinnerService.closeSpinner()
            )
          }

        },
        (err) => {
          console.error(err);
          this.messageUtils.alertError('Errore nella lettura della notifica');
          this.spinnerService.closeSpinner()
        }
      )
    }
  }

}
