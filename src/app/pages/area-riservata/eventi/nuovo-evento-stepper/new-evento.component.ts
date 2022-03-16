import { MessageUtils } from "src/app/utils/message-utils";
import {Component, NgZone, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatStepper} from "@angular/material/stepper";
import {SpinnerService} from "../../../../common/services/spinner.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from 'rxjs-compat';
import {ActivatedRoute, Router} from "@angular/router";
import {
  checkDateSystemEventi,
  chiusuraValidator,
  creatDateRangeValidator,
  PATTERN_DESCRIPTION,
  PATTERN_NUMBER
} from "../../../../utils/utils.validator";
import {GruppiSelectBean} from "../../spazio-lavoro/model/tipologiche.model";
import {TipologicheService} from "../../../../common/services/tipologiche.service";
import {MatAccordion} from "@angular/material/expansion";
import {EventiService} from "../service/eventi.service";
import {EventoForm, LuogoForm} from "../model/eventi.model";
import {TIPO_MESSAGGI} from "../../../../utils/enums";
import {Category} from "../../../../model/tree";
import {CategoryNode} from "../../../../class/category-node";
import {filter, map} from "rxjs/operators";

@Component({
  selector: 'app-nuova-richiesta',
  templateUrl: './new-evento.component.html',
  styleUrls: ['./new-evento.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewEventoComponent implements OnInit {

  title: string;
  oggi = new Date();
  disableDocumenti: boolean = true;
  tokenEventoSalvato: string;
  @ViewChild('matStepper') stepper: MatStepper;
  @ViewChild('matAccordionPanel') accordion: MatAccordion;

  /**
   * step 1 - info
   */
  infoForm: FormGroup = this.fb.group({
    titolo: ['', [Validators.required, Validators.pattern(PATTERN_DESCRIPTION)]],
    tipoEvento: ['', [Validators.required]],
    // progettoRiferimento: ['',[Validators.pattern(PATTERN_DESCRIPTION)]],
    informazioniEvento: ['', [Validators.pattern(PATTERN_DESCRIPTION)]],
    category: [''],// [Validators.required]],
  });


  /**
   * step 2 - dove
   */

  doveSelect: any = 0;

  luogoForm: FormGroup = this.fb.group({
    nomeLuogo: [null, [Validators.required, Validators.pattern(PATTERN_DESCRIPTION)]],
    indirizzo: [null, [Validators.required, Validators.pattern(PATTERN_DESCRIPTION)]],
    numero: [null, [Validators.required, Validators.pattern(PATTERN_NUMBER)]],
    // luogo: [null, [Validators.required, Validators.pattern(PATTERN_DESCRIPTION)]],
    citta: [null, [Validators.required, Validators.pattern(PATTERN_DESCRIPTION)]],
    provincia: [null, [Validators.required, Validators.pattern(PATTERN_DESCRIPTION)]],
    cap: [null, [Validators.required, Validators.pattern(PATTERN_NUMBER), Validators.maxLength(5)]],
    paese: [null, [Validators.required, Validators.pattern(PATTERN_DESCRIPTION)]],
  });

  /**
   * step 3 - quando
   */
  quandoForm: FormGroup = this.fb.group({
    dataInizio: ['', [Validators.required]],
    dataFine: ['', [Validators.required]],
    interaGiornata: [false],
    chiusuraIscrizione: ['', [Validators.required]],
  }, {
    validators: [creatDateRangeValidator(), chiusuraValidator(), checkDateSystemEventi()]
  });

  /**
   * step 4 - destinatari
   */
  destinatariForm: FormGroup = this.fb.group({
    destinatari: [null],
    destinatariGruppi: [[]],
  });

  /**
   * selects
   */
  luogoSelect: { name: string, token: string }[] = [];
  tipoEventoSelect: { name: string, categoryToken: string, token: string }[] = [];
  destinatariSelect: { name: string, token: string }[] = [];
  gruppiTipologiche: GruppiSelectBean[] = [];
  categorie: Category[] = [];

  constructor(
    private eventiService: EventiService,
    private spinnerService: SpinnerService,
    private tipologicheService: TipologicheService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
    private messageUtils: MessageUtils
  ) {
  }

  ngOnInit(): void {
    this.title = "Nuovo Evento";

    this.spinnerService.activeSpinner();

    Observable.forkJoin([
      this.tipologicheService.listaTipiEventiSelect(),
      this.tipologicheService.getListaGruppi(),
      this.tipologicheService.listaEventLocationsSelect(),
      this.eventiService.selectDestinatari(),
    ]).subscribe(
      (resp) => {
        this.tipoEventoSelect = resp[0].listObj;
        this.gruppiTipologiche = resp[1].listObj;
        this.luogoSelect = resp[2].listObj;
        this.destinatariSelect = resp[3].listObj;
      },
      (err) => {
        console.error(err)
        this.spinnerService.closeSpinner()
      },
      () => {
        this.spinnerService.closeSpinner();
      }
    );

    // tree documenti
    this.infoForm.get(['tipoEvento']).valueChanges.subscribe(
      (tipoEvento) => {
        this.spinnerService.activeSpinner();
        this.eventiService.getTreeEvents(tipoEvento.categoryToken).pipe(filter(tree => tree.obj != null)).subscribe(
          (resp) => {
            console.warn("categorie resp",resp);
            this.category = null;
            this.categorie = [];
            this.categorie.push(resp.obj);
            },
          () => {},
          () => {
            this.disableDocumenti = false;
            this.spinnerService.closeSpinner();

          }
        );
      }
    );

    this.setDefaultQuandoForm();


    // intera giornata
    this.quandoForm.get(['interaGiornata']).valueChanges.subscribe( (interaGiornata) => {
      if(interaGiornata) {
        let dataInizioAggiornata = new Date();
        dataInizioAggiornata.setTime(dataInizioAggiornata.getTime() + 15*60*1000);
        let ore = dataInizioAggiornata.getHours().toString().length == 1 ? "0"+dataInizioAggiornata.getHours() : dataInizioAggiornata.getHours();
        let minuti = dataInizioAggiornata.getMinutes().toString().length == 1 ? "0"+dataInizioAggiornata.getMinutes() : dataInizioAggiornata.getMinutes();

        let dataInizio = this.quandoForm.get(['dataInizio']).value.split('T')[0] + "T"+ore+":"+ minuti;

        this.quandoForm.get(['dataInizio']).setValue(dataInizio);
        this.quandoForm.get(['dataFine']).disable();
      } else {
        this.quandoForm.get(['dataFine']).enable();
      }
    });

    this.quandoForm.get(['dataInizio']).valueChanges.subscribe( value => {
      console.warn("data inizio",value);
      if (this.quandoForm.get(['interaGiornata']).value){
        let dataFine = this.quandoForm.get(['dataInizio']).value.split('T')[0] + "T23:59"; //:00.000Z";
        let dataChiusura = new Date( this.quandoForm.get(['dataInizio']).value);

        dataChiusura.setTime(dataChiusura.getTime() - 5*60*1000);

        let ore = dataChiusura.getHours().toString().length == 1 ? "0"+dataChiusura.getHours() : dataChiusura.getHours();
        let minuti = dataChiusura.getMinutes().toString().length == 1 ? "0"+dataChiusura.getMinutes() : dataChiusura.getMinutes();

        let dataChiusuraString = this.quandoForm.get(['dataInizio']).value.split('T')[0] + "T"+ore+":"+minuti;

        this.quandoForm.get(['dataFine']).setValue(dataFine);
        this.quandoForm.get(['chiusuraIscrizione']).setValue(dataChiusuraString);
      }
    });

    this.destinatariForm.valueChanges.subscribe(console.warn);
  }

  setDefaultQuandoForm() {
    let defaultDataInizio = new Date();
    let defaultDataFine = new Date();
    let defaultDataChiusura = new Date();

    defaultDataInizio.setTime(defaultDataInizio.getTime() + (1*60*60*1000));
    defaultDataFine.setTime(defaultDataFine.getTime() + (3*60*60*1000));
    defaultDataChiusura.setTime(defaultDataChiusura.getTime() + (1*50*60*1000));

    let oreInizio = defaultDataInizio.getHours().toString().length == 1 ? "0"+defaultDataInizio.getHours() : defaultDataInizio.getHours();
    let minutiInizio = defaultDataInizio.getMinutes().toString().length == 1 ? "0"+defaultDataInizio.getMinutes() : defaultDataInizio.getMinutes();

    let oreFine = defaultDataFine.getHours().toString().length == 1 ? "0"+defaultDataFine.getHours() : defaultDataFine.getHours();
    let minutiFine = defaultDataFine.getMinutes().toString().length == 1 ? "0"+defaultDataFine.getMinutes() : defaultDataFine.getMinutes();

    let oreChiusura = defaultDataChiusura.getHours().toString().length == 1 ? "0"+defaultDataChiusura.getHours() : defaultDataChiusura.getHours();
    let minutiChiusura = defaultDataChiusura.getMinutes().toString().length == 1 ? "0"+defaultDataChiusura.getMinutes() : defaultDataChiusura.getMinutes();

    this.quandoForm.patchValue({
      dataInizio: defaultDataInizio.toISOString().split('T')[0] + "T"+oreInizio+":"+minutiInizio,
      dataFine: defaultDataInizio.toISOString().split('T')[0] + "T"+oreFine+":"+minutiFine,
      chiusuraIscrizione: defaultDataChiusura.toISOString().split('T')[0] + "T"+oreChiusura+":"+minutiChiusura,
    });
  }


  /**
   * Select scelti
   */
  get category(): CategoryNode {
    return this.infoForm.get(['category']).value as CategoryNode;
  }

  set category(categoryNode: CategoryNode) {
    this.infoForm.get(['category']).setValue(categoryNode);
  }

  get destinatario(): string {
    return this.destinatariForm.get(['destinatari']).value as string;
  }

  get destinatariGruppi(): any[] {
    return this.destinatariForm.get(['destinatariGruppi']).value as any[];
  }

  set destinatariGruppi(destGruppi: any[]) {
    this.destinatariForm.get(['destinatariGruppi']).setValue(destGruppi);
    console.warn("destinatariGruppi", destGruppi);
  }

  doveSelected(event: any): void {
    this.doveSelect = event.value;
    if (typeof event.value === 'string') {
      console.warn("this.accordion",this.accordion);
        this.accordion.closeAll();
    }
  }

  formToObject(): EventoForm {
    let eventoForm: EventoForm = {
      // step 1
      title: this.infoForm.get(['titolo']).value,
      tokenTypeId: this.infoForm.get(['tipoEvento']).value.token,
      body: this.infoForm.get(['informazioniEvento']).value,
      tokenCategoryId: this.category?.tokenCategoryId,

      //step 2
      tokenLocationId: null,
      luogoForm: null,

      // step 3
      startDate: this.quandoForm.get(['dataInizio']).value + ":00.000Z",
      endDate: this.quandoForm.get(['dataFine']).value + ":00.000Z",
      allDay: this.quandoForm.get(['interaGiornata']).value,
      closingDate: this.quandoForm.get(['chiusuraIscrizione']).value + ":00.000Z",

      // step 4:
      gruppiToken: null,
      tokenTargetAudience: null,

    }

    // step 2
    if (this.doveSelect !== 0) {
      eventoForm.tokenLocationId = this.doveSelect.toString();
    } else {
      eventoForm.luogoForm = this.convertToLuogoForm(this.luogoForm.value);
    }


    // step 4
    eventoForm.tokenTargetAudience = this.destinatario;
    eventoForm.gruppiToken = this.getTokens(this.destinatariGruppi);


    return eventoForm;
  }


  getTokens(selects: any[]): string[] {
    let tokens : string[] = [];

    if(selects.length > 0 ) {
      selects.forEach(select => {
        if (select.token) {
          tokens.push(select.token);
        }
      });
    }

    return tokens;
  }

  salva(): void {
    const form = this.formToObject();
    console.warn("[nuovo evento]this.formToObject()", form);
    this.spinnerService.activeSpinner();
    this.eventiService.creazioneEvento(form)
      .pipe(
        map((resp) => {
          console.warn("[nuovo evento] map resp",resp)
          switch (resp?.messaggio.tipoMessaggio) {
            case TIPO_MESSAGGI.ERROR:  throw new Error(resp.messaggio.messaggio);
            case TIPO_MESSAGGI.WARNING: throw new Error(resp.messaggio.messaggio);
            case TIPO_MESSAGGI.SUCCESS: return resp;
            default : return resp;
          }
        }),
      )
      .subscribe(
      (resp) => {
        console.warn("[nuovo evento]this.eventiService.creazioneEvento(form) resp", resp);
        this.tokenEventoSalvato = resp.obj;
        this.messageUtils.alertSuccess(resp.messaggio.messaggio);
      },
      (err) => {
        console.error("[nuovo evento]Error observable",err);
        this.spinnerService.closeSpinner();
        this.messageUtils.alertWarning(err);
      },
      () => {
        console.warn("[nuovo evento]Complete observable");
        this.spinnerService.closeSpinner();
        this.nextStep();
      },
    );
  }

  convertToLuogoForm(obj: any): LuogoForm {
    return {
      ...new LuogoForm(),
      name: obj.nomeLuogo,
      address: obj.indirizzo,
      streetNumber: obj.numero,
      city: obj.citta,
      province: obj.provincia,
      state: obj.paese,
      postalCode: obj.cap,
    }
  }

  /**
   * Stepper - metodi utili
   */
  nextStep(): void {
    console.warn("nextStep");
    this.ngZone.run(() => {
      // this.stepper.selected.completed = true;
      // this.stepper.selected.editable = false;
      this.stepper.next();
    });
  }


}
