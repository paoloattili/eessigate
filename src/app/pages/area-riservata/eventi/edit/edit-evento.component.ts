import {AfterViewInit, Component, NgZone, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {EventiDettaglioBean, EventoForm, LuogoForm} from "../model/eventi.model";
import {SpinnerService} from "../../../../common/services/spinner.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatStepper} from "@angular/material/stepper";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  checkDateSystemEventi,
  chiusuraValidator,
  creatDateRangeValidator,
  PATTERN_DESCRIPTION,
  PATTERN_NUMBER
} from "../../../../utils/utils.validator";
import {Observable} from "rxjs-compat";
import {GruppiSelectBean} from "../../spazio-lavoro/model/tipologiche.model";
import {EventiService} from "../service/eventi.service";
import {TipologicheService} from "../../../../common/services/tipologiche.service";
import {filter, map} from "rxjs/operators";
import {Category} from "../../../../model/tree";
import {CategoryNode} from "../../../../class/category-node";
import {TIPO_MESSAGGI} from "../../../../utils/enums";
import {MessageUtils} from "../../../../utils/message-utils";

@Component({
  selector: 'app-edit-evento',
  templateUrl: './edit-evento.component.html',
  styleUrls: ['./edit-evento.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditEventoComponent implements OnInit {

  openExpansionPanel = true;

  title: string;
  evento: EventiDettaglioBean;
  oggi = new Date();

  @ViewChild('matStepper') stepper: MatStepper;
  disableDocumenti: boolean = true;
  tokenEventoSalvato: string;

  /**
   * step 1
   */
  infoForm: FormGroup = this.fb.group({
    titolo: ['', [Validators.required, Validators.pattern(PATTERN_DESCRIPTION)]],
    tipoEvento: ['', [Validators.required]],
    // progettoRiferimento: ['', [Validators.pattern(PATTERN_DESCRIPTION)]],
    informazioniEvento: ['', [Validators.pattern(PATTERN_DESCRIPTION)]],
    category: ['',Validators.required],// [Validators.required]],
  });

  /**
   * step 2
   */

  doveSelect : any = 0;

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
   * step 3
   */
  quandoForm: FormGroup = this.fb.group({
    dataInizio: ['', [Validators.required]],
    dataFine: ['', [Validators.required]],
    interaGiornata: [''],
    chiusuraIscrizione: ['', [Validators.required]],
  }, {
    validators: [creatDateRangeValidator(), chiusuraValidator(), checkDateSystemEventi()]
  });

  /**
   * step 4
   */
  destinatariForm: FormGroup = this.fb.group({
    destinatari: [null],
    destinatariGruppi: [[]],
  });


  /**
   * selects
   */
  luogoSelect: { name: string, token: string }[] = [];
  tipoEventoSelect = [];
  destinatariSelect: { name: string, token: string }[] = [];
  gruppiTipologiche: GruppiSelectBean[] = [];
  categorie: Category[] = [];

  constructor(
    private eventiService: EventiService,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    private tipologicheService: TipologicheService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
  ) {
  }

  ngOnInit(): void {
    this.title = "Modifica Evento";
    this.spinnerService.activeSpinner();

    this.activatedRoute.data.subscribe(data => {
      this.evento = data['evento'];
      this.updateForm();
    });

    this.valueChanges();
    this.getTipologiche();

  }

  getTipologiche(): void {

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

        let updateEvento = this.tipoEventoSelect.filter(tipoEvento => tipoEvento.token === this.evento.tokenTypeId)[0];
        this.infoForm.get(['tipoEvento']).setValue(updateEvento);


        let destGruppi = [];
        for ( let gruppoInserito of this.evento.gruppiInvitati ) {
          for ( let gruppoSelect of this.gruppiTipologiche ) {
            if (gruppoSelect.name.toUpperCase() === gruppoInserito.nome.toUpperCase()){
              destGruppi.push(gruppoSelect);
            }
          }
        }
        this.destinatariGruppi = destGruppi;

        console.warn("this.evento", this.evento);
        console.warn("this.destinatariForm", this.destinatariForm);
      },
      (err) => {
        // this.spinnerService.closeSpinner()
      },
      () => { this.spinnerService.closeSpinner(); }
    );
  }

  valueChanges(): void {

    // cambiando il tipo evento si ottiene un albero
    this.infoForm.get(['tipoEvento']).valueChanges.pipe(filter(tipoEvento => tipoEvento !== null)).subscribe(
      (tipoEvento) => {
        console.warn("tipo evento aggiornato",tipoEvento);
        this.spinnerService.activeSpinner();
        this.eventiService.getTreeEvents(tipoEvento.categoryToken).pipe(filter(tree => tree.obj != null)).subscribe(
          (resp) => {
            this.categorie = [];
            this.categorie.push(resp.obj);

            let categoria = this.filterNodesByToken(this.categorie, this.evento.categoryToken)[0];
            console.warn("categoria update tipo evento", categoria);

            this.category = new CategoryNode();
            this.category.tokenCategoryId = categoria.tokenCategoryId;
            this.category.name = categoria.name.toUpperCase();

          },
          (err) => {
            // console.error("err",err)
          },
          () => {
            this.disableDocumenti = false;
            this.spinnerService.closeSpinner();
          }
        );
      }
    )

    // selezionando il checkbox intera giornata vengono settati dei valori di default su data inizio, fine, chiusura
    this.quandoForm.get(['interaGiornata']).valueChanges.subscribe( (interaGiornata) => {
      if(interaGiornata) {
        let dataInizioAggiornata = new Date(this.quandoForm.get(['dataInizio']).value);
        let oggi = new Date();

        let ore;
        let minuti;
        if ( dataInizioAggiornata.getDate() === oggi.getDate() ) {
          let dataTemp = new Date();
          dataTemp.setTime(dataTemp.getTime() + 15*60*1000);
          ore = dataTemp.getHours().toString().length == 1 ? "0"+dataTemp.getHours() : dataTemp.getHours();
          minuti = dataTemp.getMinutes().toString().length == 1 ? "0"+dataTemp.getMinutes() : dataTemp.getMinutes();
        } else {
          ore = dataInizioAggiornata.getHours().toString().length == 1 ? "0"+dataInizioAggiornata.getHours() : dataInizioAggiornata.getHours();
          minuti = dataInizioAggiornata.getMinutes().toString().length == 1 ? "0"+dataInizioAggiornata.getMinutes() : dataInizioAggiornata.getMinutes();
        }
        let dataInizio = this.quandoForm.get(['dataInizio']).value.split('T')[0] + "T"+ore+":"+ minuti;

        this.quandoForm.get(['dataInizio']).setValue(dataInizio);
        this.quandoForm.get(['dataFine']).disable();

      } else {
        this.quandoForm.get(['dataFine']).enable();
      }
    });

    // se cambia data inizio e interagiornata è settata a true cambia anche la data fine
    this.quandoForm.get(['dataInizio']).valueChanges.subscribe( value => {
      console.warn("data inizio",value);
      if (this.quandoForm.get(['interaGiornata']).value){
        let dataFine = this.quandoForm.get(['dataInizio']).value.split('T')[0] + "T23:59"; //:00.000Z";
        this.quandoForm.get(['dataFine']).setValue(dataFine);
      }
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
    return this.destinatariForm.get(['destinatari']).value;
  }

  set destinatario(dest: string) {
    this.destinatariForm.get(['destinatari']).setValue(dest);

  }

  get destinatariGruppi(): any[] {
    return this.destinatariForm.get(['destinatariGruppi']).value as any[];
  }

  set destinatariGruppi(destGruppi: any[]) {
    this.destinatariForm.get(['destinatariGruppi']).setValue(destGruppi);

  }

  doveSelected(event: any): void {
    if (typeof event.value === 'string') {
      if (event.value === this.evento.tokenLocationId){
        this.updateLuogoForm(this.evento);
        this.doveSelect = this.evento.tokenLocationId;
        this.openExpansionPanel = true;
      } else {
        this.doveSelect = event.value;
        this.openExpansionPanel = false;
      }
    } else {
      // solo per valore 0 -- nessun luogo selezionato
      this.doveSelect = this.evento.tokenLocationId;
      this.openExpansionPanel = true;
      this.updateLuogoForm(new EventiDettaglioBean());
    }
  }


  updateForm(): void {

    this.infoForm.patchValue({
      titolo: this.evento.title,
      tipoEvento: null,
      category: new CategoryNode(),
      informazioniEvento: this.evento.body,
    });

    this.quandoForm.patchValue({
      dataInizio: this.convertToDate(this.evento.startDate),
      dataFine: this.convertToDate(this.evento.endDate),
      interaGiornata: this.evento.allDay,
      chiusuraIscrizione: this.convertToDate(this.evento.closingDate),
    });

    this.doveSelect = this.evento.tokenLocationId;
    this.updateLuogoForm(this.evento);

    this.destinatariForm.patchValue({
      destinatari: this.evento.tokenTargetAudience,
    });

  }

  updateLuogoForm(evento: EventiDettaglioBean){
    this.luogoForm.patchValue({
      nomeLuogo: evento.name,
      indirizzo: evento.address,
      numero: evento.streetNumber,
      // luogo: [null, [Validators.required, Validators.pattern(PATTERN_DESCRIPTION)]],
      citta: evento.city,
      provincia: evento.province,
      cap: evento.postalCode,
      paese: evento.state,
    });
  }

  filterNodesByToken(categoryNodes: Category[], tokenCategory : string) : Category {
    let category: Category;
    let categorie = [];
    categorie.push(categoryNodes);
    categorie.filter(function fn(cn){
      if (cn.tokenCategoryId === tokenCategory) {
        category = cn;
        return true;
      }

      if(cn.childCategories){
        return cn.childCategories.filter(fn);
      }
      }
    );
    return category;
  };

  formToObject(): EventoForm {
    let eventoForm = {
      ...new EventoForm(),

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
      tuttiGliUtenti: null,
      gruppiToken: null,
      tokenTargetAudience: null,

      invitedBy: this.evento.invitedBy

    }

    // step 2
    if (this.doveSelect !== 0 || this.doveSelect !== this.evento.tokenLocationId ) {
      eventoForm.tokenLocationId = this.doveSelect.toString();
    } else {
      if(this.doveSelect === this.evento.tokenLocationId){
        eventoForm.luogoForm.tokenId = this.doveSelect.toString();
      }
      eventoForm.luogoForm = this.convertToLuogoForm(this.luogoForm.value);
    }

    // step 3
    if (this.quandoForm.get(['interaGiornata']).value === true) {
      let dataInizio = this.quandoForm.get(['dataInizio']).value.split('T')[0] + "T00:00:00.000Z";
      let dataFine = this.quandoForm.get(['dataFine']).value.split('T')[0] + "T23:59:00.000Z";
      eventoForm.startDate = dataInizio;
      eventoForm.endDate = dataFine;
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

  salvaModifica(): void {
    const form = this.formToObject();

    console.warn("form",form);
    this.spinnerService.activeSpinner();
    this.eventiService.modificaEvento(form)
      .pipe(
        map((resp) => {

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

          this.tokenEventoSalvato = resp.obj;
          this.messageUtils.alertSuccess(resp.messaggio.messaggio);
        },
        (err) => {
          // console.error("[nuovo evento]Error observable",err);
          // this.spinnerService.closeSpinner();
          // this.messageUtils.alertWarning(err);
        },
        () => {

          this.spinnerService.closeSpinner();
          this.nextStep();
        },
    );
  }

  convertToDate(date: string): string {
    let data = date.split(" ")[0];
    let tempo = date.split(" ")[1];

    let year = (data.split("-")[2]);
    let month = (data.split("-")[1]);
    let day = (data.split("-")[0]);
    let ora = (tempo.split(":")[0]);
    let minuti = (tempo.split(":")[1]);

    return year+"-"+month+"-"+day + "T" + ora + ":" + minuti;
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

    this.ngZone.run(() => {
      // this.stepper.selected.completed = true;
      // this.stepper.selected.editable = false;
      this.stepper.next();
    });
  }


}
