import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {MessaggioBean, TicketDettaglioBean, TicketFileBean} from "../model/service-desk.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SpinnerService} from "../../../../common/services/spinner.service";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ValidateFileName, ValidateFileSize, ValidateFileType} from "../../../../utils/utils.validator";
import {MatStepper} from "@angular/material/stepper";
import {MessageUtils} from "../../../../utils/message-utils";
import {ServiceDeskService} from "../service/service-desk.service";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Commento, CommentoForm} from "../../../../model/commento";
import {WebsocketNotifiche} from "../../../../utils/websocket-notifiche";
import {HttpResponse} from "@angular/common/http";
import {DownloadUtils} from "../../../../utils/download-utils";
import { TIPO_MESSAGGI } from 'src/app/utils/enums';

@Component({
  selector: 'app-dettaglio-richiesta',
  templateUrl: './detail-ticket.component.html',
  styleUrls: ['./detail-ticket.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailTicketComponent implements OnInit, AfterViewInit {
  title: string;
  ticket: TicketDettaglioBean;
  stato: number; // aperto 1 - risolto 2 - chiuso 3
  selectedIndex: number;
  nuovoStato: number;
  esito: string;
  path: string; // gestione ticket - mie richieste
  argomentoHelpDesk: string;

  @ViewChild('matStepper') stepper: MatStepper;
  @ViewChild('dialog') dialogTemplate: TemplateRef<any>;

  richiestaForm = this.fb.group({
    attachments: this.fb.array([]),
  });

  constructor(
    readonly dialog: MatDialog,
    private fb: FormBuilder,
    private serviceDeskService: ServiceDeskService,
    private messageUtils: MessageUtils,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService
  ) {
  }

  ngOnInit(): void {
    this.title = "Dettaglio richiesta";

    this.activatedRoute.queryParams.subscribe(
      params => {
        this.stato = params.stato;
      }
    );

    this.activatedRoute.url.subscribe( val => this.path = val[0].path );

    this.spinnerService.activeSpinner();
    this.activatedRoute.data.subscribe(data => {
      console.warn("DATA detail documento", data);
      this.ticket = data['richiesta'];
      this.aggiornaFormAllegati(this.ticket.allegati);
      console.warn('this.ticket',this.ticket);
      this.spinnerService.closeSpinner();
    });

    this.activatedRoute.queryParams.subscribe(
      param => {
        console.warn('param',param);
        this.argomentoHelpDesk = param['argomentoHelpDesk'];
      }
    )

  }

  ngAfterViewInit() {
    if (this.stato) {

      switch (this.stato.toString()) {
        case '1':
          this.selectedIndex = 0;
          this.stepper.steps.get(0).editable = false;
          this.stepper.steps.get(0).completed = true;
          break;

        case '2':
          this.selectedIndex = 1;
          this.stepper.steps.get(0).editable = false;
          this.stepper.steps.get(1).editable = false;
          this.stepper.steps.get(0).completed = true;
          this.stepper.steps.get(1).completed = true;
          break;

        case '3':
          this.selectedIndex = 2;
          //console("this.selectedIndex",this.selectedIndex);
          this.stepper.steps.get(0).editable = false;
          this.stepper.steps.get(1).editable = false;
          this.stepper.steps.get(2).editable = false;
          this.stepper.steps.get(0).completed = true;
          this.stepper.steps.get(1).completed = true;
          this.stepper.steps.get(2).completed = true;
          break;
      }
    }
  }

  /**
   * Gestione attachments
   */
  get attachments() {
    return this.richiestaForm.get(['attachments']) as FormArray;
  }

  cleanAttachments(): void {
    this.attachments.controls.splice(0, this.attachments.controls.length);
  }

  addItemAttachment() {
    this.attachments.push(
      this.fb.group({
        name: [],
        token: [],
        fileSource: [null, [ValidateFileType, ValidateFileName, ValidateFileSize]]
      })
    );
  }

  allegatoSelezionato(fileList: any) {
    //console("Selected file:", fileList);
    if (fileList.length >= 0) {
      for (let file of fileList) {
        if (!this.attachments.controls) {

          this.addItemAttachment();
          const attachment = this.attachments.controls[this.attachments.controls.length - 1] as FormGroup;
          attachment.get(['fileSource']).setValue(file);
          attachment.get(['name']).setValue(file.name);

        } else if (this.attachments.controls.length < 3) {
          this.addItemAttachment();
          const attachment = this.attachments.controls[this.attachments.controls.length - 1] as FormGroup;
          attachment.get(['fileSource']).setValue(file);
          attachment.get(['name']).setValue(file.name);
        } else {
          this.messageUtils.alertWarning("Puoi aggiungere solo 3 file.")
        }
      }
    }

    console.warn('this.attachments',this.attachments);

  }

  rimuoviAllegato(i: number) {
    this.attachments.controls.splice(i, 1);
    this.attachments.value.splice(i, 1);
    this.attachments.updateValueAndValidity();
  }

  verificaCambiamenti(): boolean {
    let cambiato = false;

    let dimensione = this.ticket.allegati.length;
    let tokenArray = []; this.ticket.allegati.forEach(allegato => tokenArray.push(allegato.tokenFile))

    cambiato = dimensione !== this.attachments.controls.length;

    if(!cambiato) {
      this.attachments.controls.forEach(control =>{
        cambiato = cambiato || !tokenArray.includes(control.get(['token'])?.value);
      });
    }

    return cambiato;
  }

  aggiornaFormAllegati(allegati: TicketFileBean[]): void {
    let count = 0;
    this.cleanAttachments();
    for (let allegato of allegati) {
      this.addItemAttachment();
      this.attachments.controls[count].patchValue({
        name: allegato.fileName,
        token: allegato.tokenFile,
      });
      count++;
    }
  }

  scaricaAllegato(tokenFile: string): void {
    this.spinnerService.activeSpinner()
    this.serviceDeskService.downloadAttachment(tokenFile).subscribe(
      (resp: HttpResponse<any>) => {
        if(resp && resp.headers) {
          const headers = resp.headers;
          DownloadUtils.downloadAttachments(resp.body, headers.get('content-type'),headers.get('content-disposition'));
        }else this.messageUtils.alertError('Errore nel download del documento!')
      },
      (err) => {
        this.messageUtils.alertError('Errore nel download del documento!')
        this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    );

  }

  openDialog(): MatDialogRef<any, any> {
    let config: MatDialogConfig = {
      width: '400px',
      panelClass: 'dialog-position',
    }

    return this.dialog.open(this.dialogTemplate, config);
  }

  convertToComments(messaggi: MessaggioBean[]): Set<Commento> {
    let commenti = new Set<Commento>();
    if (messaggi){
      for ( let messaggio of messaggi ) {
        commenti.add(MessaggioBean.convertToCommento(messaggio));
      }
    }
    return commenti;
  }

  /**
   * Azioni buttons
   */


  modificaAllegati(): void {
    let allegati : File[] = [];

    console.warn('this.attachments',this.attachments);

    let tokenAllegati: string[] = [];

    for (let control of this.attachments.controls) {
      if(control.get(['token']).value)
        tokenAllegati.push(control.get(['token']).value);

      if(control.get(['fileSource']).value)
        allegati.push(control.get(['fileSource']).value);
    }

    let ticketModificaAllegato : { token: string, idAllegatiToken: string[] } = {
      token: this.ticket.token,
      idAllegatiToken: tokenAllegati
    };

    console.warn('ticketModificaAllegato',ticketModificaAllegato);
    console.warn('allegati',allegati);

    this.spinnerService.activeSpinner();
    this.serviceDeskService.modificaAllegati(ticketModificaAllegato,allegati).subscribe(
      resp => {
        console.warn("resp modifica allegati",resp);
        if(resp && resp.messaggio?.tipoMessaggio === TIPO_MESSAGGI.SUCCESS) {
          this.messageUtils.alertSuccess(resp.messaggio.messaggio)
          location.reload();
        }
      },
      (err) => {
        console.error(err);
        this.spinnerService.closeSpinner();
      },
      () => this.spinnerService.closeSpinner()
    );

  }

  private getArrayFromItems(arr: FormArray): File[] {
    console.warn('formArray',arr);

    let files: File[] = [];

    arr.controls.forEach(elem => {
      if(elem && elem.value)
        files.push(elem.value.fileSource);
    });

    if(files)
      files.pop();

    console.warn('files',files);

    return files;
  }


  cambiaStato(esito?: string) {
    this.spinnerService.activeProgressBar();
    switch (this.nuovoStato.toString()) {
      case '1':
        this.serviceDeskService.riapriTicket(this.ticket.token).subscribe(
          (resp) => {
            console.warn("RIAPRI TICKET RESP", resp)
          },
          (err) => {
            console.error(err);
            this.spinnerService.closeProgressBar();
            this.dialog.closeAll();
          },
          () => {
            this.dialog.closeAll();
            this.spinnerService.closeProgressBar();
            this.router.navigate(['../'], {queryParams: { stato: 'APERTO' }, relativeTo: this.activatedRoute}).then((value) => {
              console.warn("value url ", value)
            });
          },
        );
        break;
      case '2':
        this.serviceDeskService.risolviTicket(this.ticket.token).subscribe(
          (resp) => {
            console.warn("RISOLVI TICKET RESP", resp)
          },
          (err) => {
            console.error(err);
            this.spinnerService.closeProgressBar();
            this.dialog.closeAll();
          },
          () => {
            this.spinnerService.closeProgressBar();
            this.dialog.closeAll();
            this.router.navigate(['../'], {queryParams: { stato: 'RISOLTO' }, relativeTo: this.activatedRoute}).then((value) => {
              console.warn("value url ", value)
            });
          }
        );
        break;
      case '3':
        this.serviceDeskService.chiudiTicket(this.ticket.token, esito.toUpperCase()).subscribe(
          (resp) => {
            console.warn("RISOLVI TICKET RESP", resp)
          },
          (err) => {
            console.error(err);
            this.spinnerService.closeProgressBar();
            this.dialog.closeAll();
          },
          () => {
            this.spinnerService.closeProgressBar();
            this.dialog.closeAll();
            console.warn("[test redirect] this.activatedRoute.parent", this.activatedRoute);
            this.router.navigate(['../'], {queryParams: { stato: 'CHIUSO' }, relativeTo: this.activatedRoute}).then((value) => {
              console.warn("value url ", value)
            });
          }
        );
        break;
    }
  }

  inviaComment(commentoFormEvent: CommentoForm): void {
    console.warn("Invia comment", commentoFormEvent);
    const messaggio = {
      ...MessaggioBean.commentoFormToMessaggioBean(commentoFormEvent),
      tokenTicket: this.ticket.token,
    }

    this.spinnerService.activeSpinner();
    this.serviceDeskService.inviaMessaggio(messaggio,'BUSINESS').subscribe(resp => {
      console.warn("INSERIMENTO COMMENTO RESP",resp);
      this.ticket.messaggi = resp.obj?.messaggi;
      this.spinnerService.closeSpinner();
      // setTimeout(t => this.websocketNotifiche._send(resp.obj), 2000);
    });
  }

  ripristina(): void {
    this.aggiornaFormAllegati(this.ticket.allegati);
  }

}
