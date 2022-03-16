import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {
  EventDocumentBean,
  EventiDettaglioBean,
  EventoGruppoBean,
  EventUserBean,
  InvitatiBean,
  SchedaEventiBean
} from "../model/eventi.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SpinnerService} from "../../../../common/services/spinner.service";
import {EventiService} from "../service/eventi.service";
import {DocumentoService} from "../../spazio-lavoro/service/documento.service";
import {DownloadUtils} from "../../../../utils/download-utils";
import {MessageUtils} from "../../../../utils/message-utils";
import {FormControl} from "@angular/forms";
import {map} from "rxjs/operators";
import {TIPO_MESSAGGI} from "../../../../utils/enums";
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-dettaglio-evento',
  templateUrl: './detail-evento.component.html',
  styleUrls: ['./detail-evento.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailEventoComponent implements OnInit {
  title: string;
  evento: SchedaEventiBean;
  progressBar: boolean[] = [];

  mioEvento: boolean;

  statoEvento: number;
  statoIscrizioneEvento: number;

  utentiInvitati: EventUserBean[] = [];
  gruppiInvitati: EventoGruppoBean[] = [];
  partecipanti: EventUserBean[] = [];
  forse: EventUserBean[] = [];
  rifiutato: EventUserBean[] = [];
  attesa: EventUserBean[] = [];

  sceltaLista: string  = 'INVITATI';
  documenti: EventDocumentBean[] = [];

  sceltaPartecipazione: FormControl = new FormControl();

  constructor(
    private messageUtils: MessageUtils,
    private eventiService: EventiService,
    private documentiService: DocumentoService,
    private spinnerService: SpinnerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.title = "Dettaglio Evento";
    this.activatedRoute.data.subscribe(data => {
      this.evento = data['evento'];
      this.utentiInvitati = this.evento.invitati.utentiInvitati;
      this.gruppiInvitati = this.evento.invitati.gruppiInvitati;
      this.partecipanti = Array.from(this.evento.invitati.partecipanti);
      this.forse = Array.from(this.evento.invitati.idDubbio);
      this.rifiutato = Array.from(this.evento.invitati.nonPartecipanti);
      this.attesa = Array.from(this.evento.invitati.inAttesa);
      this.documenti = this.evento?.documenti ? this.evento.documenti : [];
      this.documenti.forEach(() => {this.progressBar.push(false)})
      this.statiEvento();

      const user: User = JSON.parse(localStorage.getItem('user'));
      let filtered: EventUserBean[] = this.evento.invitati.utentiInvitati.filter(u => user.userId === u.userId);
      if(filtered?.length > 0 || user.userId === this.evento.userId) {
        
        this.mioEvento = true;

        if (this.evento.choiceId)
        this.sceltaPartecipazione.setValue(this.evento.choiceId?.toString());
      }
      
      // attivazione del value changes
      this.valueChanges();

      this.spinnerService.closeSpinner();
    },
      () => {},
      () => {}
    );


  }


  valueChanges(): void {
    this.sceltaPartecipazione.valueChanges.subscribe(sceltaPartecipazione => {
      this.spinnerService.activeSpinner();
        this.eventiService.scegliPartecipazione(sceltaPartecipazione,this.evento.token)
          .subscribe(
            (resp) => {
              this.evento.choiceId = this.sceltaPartecipazione.value;
              this.messageUtils.alertSuccess(resp.messaggio.messaggio);
            },
            (err) => {
              // console.error("[cambio partecipazione]Error observable",err);
              // this.spinnerService.closeSpinner();
              // this.messageUtils.alertWarning(err);
            },
            () => {
              this.spinnerService.closeSpinner();
            },
          );
    });
  }

  statiEvento() {
    const startDate = this.convertToDate(this.evento.startDate);
    const endDate = this.convertToDate(this.evento.endDate);
    const closingDate = this.convertToDate(this.evento.closingDate);
    const today = new Date();

    this.statoIscrizioneEvento = today < closingDate? 1 : 2;
    if( today < startDate) {
      this.statoEvento = 1;
    } else if (today >= startDate && today < endDate ) {
      this.statoEvento = 2;
    } else {
      this.statoEvento = 3;
    }

  }

  exportInvitati(): void {
    console.warn("exportInvitati");
    this.spinnerService.activeSpinner();
    this.eventiService.exportInvitati().subscribe(
      resp => {
        console.warn("export invitati resp",resp);
        if(resp && resp.headers) {
          const headers = resp.headers;
          DownloadUtils.downloadAttachments(resp.body, headers.get('content-type'),headers.get('content-disposition'));
        }else this.messageUtils.alertError('Errore nel download!')
      },
      (err) => {
        // console.error(err); this.spinnerService.closeSpinner();
        },
      () => { this.spinnerService.closeSpinner(); }
    );

  }


  goToEdit(): void {
    const tokenId = this.evento.token;
    this.router.navigate(['../modifica'], {queryParams: {t: tokenId}, relativeTo: this.activatedRoute});
  }

  downlodad(token: string, i: number): void {
    this.progressBar[i] = true;
    this.documentiService.downloadAttachment(token).subscribe(
      resp => {
        if(resp && resp.headers) {const headers = resp.headers;
          DownloadUtils.downloadAttachments(resp.body, headers.get('content-type'),headers.get('content-disposition'));
        }else this.messageUtils.alertError('Errore nel download del documento!')
      },
      err => {},
      () => { console.warn("complete download");this.progressBar[i] = false;}
      )
  }

  convertToDate(date: string): Date {
    let data = date.split(" ")[0];
    let tempo = date.split(" ")[1];

    let year = Number(data.split("-")[2]);
    let month = Number(data.split("-")[1])-1;
    let day = Number(data.split("-")[0]);

    let ora = Number(tempo.split(":")[0]);
    let minuti = Number(tempo.split(":")[1]);

    return new Date(year, month, day, ora, minuti);
  }

}
