import {AfterViewInit, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ServiceDeskService} from "../service/service-desk.service";
import {TicketManageBean, TicketMyRequestBean} from "../model/service-desk.model";
import {Observable} from "rxjs-compat";
import {SpinnerService} from "../../../../common/services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageUtils} from "../../../../utils/message-utils";

@Component({
  selector: 'app-mie-richieste',
  templateUrl: './mie-richieste.component.html',
  styleUrls: ['./mie-richieste.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MieRichiesteComponent implements OnInit, AfterViewInit {

  indexTab: number;

  stato = [1,2,3]; // aperti risolti chiusi

  listTicketAperti: TicketMyRequestBean[];
  listTicketRisolti: TicketMyRequestBean[];
  listTicketChiusiPositivi: TicketMyRequestBean[];
  listTicketChiusiNegativi: TicketMyRequestBean[];

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
    this.title = "Le Mie Richieste";

    if (!this.activatedRoute.snapshot.queryParams['tipo']) {
      this.indexTab = 0;
      this.selectedTab({index: this.indexTab});
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
    console.warn("selected tab event");
    this.spinnerService.activeSpinner();
    let index = event.index;
    this.tipoTicket = event.index === 0? 'tecnico' : 'business';
    console.warn('index',index);
    // 0 - Tecnico, 1 - Business

    Observable.forkJoin(
      this.serviceDeskService.listaMieiTicket(this.tipoTicket,this.stato[0]),
      this.serviceDeskService.listaMieiTicket(this.tipoTicket,this.stato[1]),
      this.serviceDeskService.listaMieiTicket(this.tipoTicket,this.stato[2],'POSITIVO'),
      this.serviceDeskService.listaMieiTicket(this.tipoTicket,this.stato[2],'NEGATIVO'),
    ).subscribe(
      resp => {
      console.warn("[this.serviceDeskService.listaMieiTicket]",resp);

      this.listTicketAperti = [];
      this.listTicketRisolti = [];
      this.listTicketChiusiPositivi = [];
      this.listTicketChiusiNegativi = [];

      this.listTicketAperti = resp[0].listObj;
      this.listTicketRisolti = resp[1].listObj;
      this.listTicketChiusiPositivi = resp[2].listObj;
      this.listTicketChiusiNegativi = resp[3].listObj;
    },
      (err) => {
        console.error(err);
        this.spinnerService.closeSpinner()
      },
      () => {this.spinnerService.closeSpinner();},
      );

  }

  goToDettaglioTicket(ticket: TicketManageBean, tipoTicket: string, stato: string): void  {
    console.warn("mie richieste - go to dettaglio ticket", ticket, tipoTicket, stato);
    this.spinnerService.activeSpinner();

    // if (tipoTicket.toUpperCase() === 'BUSINESS') {
      this.router.navigate([`./dettaglio-richiesta`],
        {
          queryParams: {t: ticket.token, argomentoHelpDesk: this.tipoTicket, stato: stato },
          relativeTo: this.activatedRoute
        })
        .then(() => {
          console.log("arrivato");
          this.spinnerService.closeSpinner();
        });
    // }
    // else {
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
