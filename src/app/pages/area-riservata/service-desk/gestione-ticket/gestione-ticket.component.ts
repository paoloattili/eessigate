import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ServiceDeskService} from "../service/service-desk.service";
import {TicketManageBean} from "../model/service-desk.model";
import {Observable} from "rxjs-compat";
import {SpinnerService} from "../../../../common/services/spinner.service";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {MessageUtils} from "../../../../utils/message-utils";

@Component({
  selector: 'app-gestione-ticket',
  templateUrl: './gestione-ticket.component.html',
  styleUrls: ['./gestione-ticket.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GestioneTicketComponent implements OnInit, AfterViewInit {

  indexTab: number = 0;

  stato = [1,2,3]; // aperti chiusi risolti

  listTicketAperti: TicketManageBean[];
  listTicketRisolti: TicketManageBean[];
  listTicketChiusi: TicketManageBean[] = [];

  title: string;
  tipoTicket: string;

  expandedAperti: boolean = false;
  expandedRisolti: boolean = false;
  expandedChiusi: boolean = false;

  dataUltimoPassaggioBatch: Date;

  constructor(
    private messageUtils: MessageUtils,
    private serviceDeskService: ServiceDeskService,
    private spinnerService: SpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.title = "Gestione Ticket"

    if (!this.activatedRoute.snapshot.queryParams['tipo']) {
      this.indexTab = 0;
      this.selectedTab({index: this.indexTab});
      console.warn("non c'è tipo", this.indexTab)
    } else  if (this.activatedRoute.snapshot.queryParams['tipo'] === 'TECNICO') {
      this.indexTab = 0;
      this.selectedTab({index: this.indexTab});
    } else if (this.activatedRoute.snapshot.queryParams['tipo'] === 'BUSINESS') {
      this.indexTab = 1;
      this.selectedTab({index: this.indexTab});
    }


    if (this.activatedRoute.snapshot.queryParams['stato']) {
      if (this.activatedRoute.snapshot.queryParams['stato'] === 'APERTO') {
        this.expandedAperti = true;
      } else if (this.activatedRoute.snapshot.queryParams['stato'] === 'RISOLTO') {
        this.expandedRisolti = true;
      }  else if (this.activatedRoute.snapshot.queryParams['stato'] === 'CHIUSO') {
        this.expandedChiusi = true;

      }
    }

    this.getDataUltimoPassaggioBatch();
  }

  ngAfterViewInit(): void {
  }


  selectedTab(event: any): void {
    this.spinnerService.activeSpinner();
    let index = event.index;
    this.tipoTicket = event.index === 0? 'tecnico' : 'business';
    console.warn("this.tipoTicket",this.tipoTicket);

    Observable.forkJoin(
      this.serviceDeskService.listaGestioneTicket(this.tipoTicket,this.stato[0]),
      this.serviceDeskService.listaGestioneTicket(this.tipoTicket,this.stato[1]),
      this.serviceDeskService.listaGestioneTicket(this.tipoTicket,this.stato[2],'POSITIVO'),
      this.serviceDeskService.listaGestioneTicket(this.tipoTicket,this.stato[2],'NEGATIVO'),
    ).subscribe(
      resp => {
        console.warn("[this.serviceDeskService.listaMieiTicket]",resp);
        this.listTicketAperti = [];
        this.listTicketChiusi = [];
        this.listTicketRisolti = [];
        this.listTicketAperti = resp[0].listObj;
        this.listTicketRisolti = resp[1].listObj;
        resp[2].listObj?.forEach(value => this.listTicketChiusi.push(value));
        resp[3].listObj?.forEach(value => this.listTicketChiusi.push(value));
      },
      (err) => {
        // console.error(err);
        // this.spinnerService.closeSpinner()
      },
      () => {this.spinnerService.closeSpinner();},
      );

  }

  goToDettaglioTicket(ticket: TicketManageBean, tipoTicket: string): void  {
    console.warn("go to dettaglio ticket", ticket, tipoTicket);
    this.spinnerService.activeSpinner();

    // if (tipoTicket === 'BUSINESS') {
      this.router.navigate([`./dettaglio-richiesta`],
        {
          queryParams: {
            t: ticket.token,
            argomentoHelpDesk: this.tipoTicket,
            stato: ticket.idStato,
          },
          relativeTo: this.activatedRoute
        })
        .then(() => {
        console.log("arrivato");
        this.spinnerService.closeSpinner();
      });
    // } else {
    //   this.messageUtils.alertSuccess("Redirect to remedy.");
    //   this.spinnerService.closeSpinner();
    // }
  }

  getDataUltimoPassaggioBatch() {
    this.serviceDeskService.getDataUltimoPassaggioBatch().subscribe(
      resp => {
        this.dataUltimoPassaggioBatch = resp.obj;
      },
      (err) => {
        // console.error(err);
        // this.messageUtils.alertError('Errore nel recupero della data del passaggio del batch');
        // this.spinnerService.closeSpinner();
      },
      () => this.spinnerService.closeSpinner()
    )
  }

}
