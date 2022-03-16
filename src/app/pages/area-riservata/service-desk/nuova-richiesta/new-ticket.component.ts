import {AfterViewInit, Component, NgZone, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatStepper} from "@angular/material/stepper";
import {SpinnerService} from "../../../../common/services/spinner.service";
import {
  ArgomentoHelpDesk,
  BUCBean,
  Impatto, SettoreArgomentoBean,
  SettoreTicketBean,
  TicketInserimentoForm,
  Urgenza
} from "../model/service-desk.model";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {of, Subscription} from "rxjs";
import {Observable} from "rxjs-compat";
import {ServiceDeskService} from "../service/service-desk.service";
import {ActivatedRoute, Router} from "@angular/router";
import {map, startWith} from "rxjs/operators";
import {OrganizzazioneLiteBean} from "../../spazio-lavoro/model/tipologiche.model";
import {
  PATTERN_DESCRIPTION,
  ValidateFileSize,
  ValidateFileType
} from "../../../../utils/utils.validator";
import {MessageUtils} from "../../../../utils/message-utils";
import {TIPO_MESSAGGI} from "../../../../utils/enums";
import {TipologicheService} from "../../../../common/services/tipologiche.service";
import {JsonResponseBean} from "../../../../common/json-response-bean";

@Component({
  selector: 'app-nuova-richiesta',
  templateUrl: './new-ticket.component.html',
  styleUrls: ['./new-ticket.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewTicketComponent implements OnInit, AfterViewInit {

  title: string;
  tokenNuovaRichiestaSalvata: string = "token"; // valore dato dal server dopo il salvataggio della richiesta
  @ViewChild('matStepper') stepper: MatStepper;

  /**
   * step 1
   */
  searchInput: FormControl = new FormControl();
  listArgomentiHelpDesk: ArgomentoHelpDesk[] = [];
  listaSettoriSearch: SettoreArgomentoBean[] = [];
  filteredSettori: Observable<SettoreArgomentoBean[]>;

  tipoTicket: ArgomentoHelpDesk;

  /**
   * step 2
   */
  listaSettore: SettoreTicketBean[]; // filtrati in base al tipo
  listaUrgenza: Urgenza[];
  listaImpatto: Impatto[];

  listaBuc: BUCBean[];
  listaOrganizzazione: OrganizzazioneLiteBean[];

  // organizzazione e tecnico
  richiestaForm: FormGroup = this.fb.group({
    settore: [null, [Validators.required]],
    titolo: [null, [Validators.required]],
    urgenza: [null, [Validators.required]],
    impatto: [null, [Validators.required]],
    descrizione: [null, [Validators.required, Validators.pattern(PATTERN_DESCRIPTION)]],
    attachments: this.fb.array([]),
  });

  //organizzazione
  selectForm: FormGroup = this.fb.group({
    buc: [null, [Validators.required]],
    organizzazione: [null, [Validators.required]],
  });

  subscriptionStep2: Subscription[] = [];


  constructor(
    private serviceDeskService: ServiceDeskService,
    private tipologicheService: TipologicheService,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private ngZone: NgZone,
  ) {
    this.title = "Nuova richiesta";
  }

  ngOnInit(): void {

    this.spinnerService.activeSpinner();

    this.getTipologiche();

    this.richiestaForm.valueChanges.subscribe(form => console.warn("update richiestaform",this.richiestaForm));

    this.filterListSettori(); // necessario per l'autocomplete
  }

  ngAfterViewInit() {
    console.warn("this.steppper", this.stepper);
    this.stepper.steps.get(1).editable = false;
    this.stepper.steps.get(1).completed = false;
    this.stepper.steps.get(2).editable = false;
    this.stepper.steps.get(2).completed = false;
  }

  getTipologiche(): void {
    Observable.forkJoin(
      this.serviceDeskService.selectSettoreArgomento(),
      this.serviceDeskService.listaArgomentoHelpDesk(),
    ).subscribe(
      {
        next: (resp) => {
          this.listArgomentiHelpDesk = resp[1].listObj;
          this.listaSettoriSearch = resp[0].listObj;
          console.warn("listaSettoriSearch", this.listaSettoriSearch);
          console.warn("this.listArgomentiHelpDesk", this.listArgomentiHelpDesk);
        },
        error: err => {
          // console.warn(err)
          // this.spinnerService.closeSpinner()
        },
        complete: () => {
          this.spinnerService.closeSpinner();
        },
      }
    );
  }


  /**
   * GESTIONE - STEP 1
   */
  /**
   * Autocomplete step 1
   */

  filterListSettori(): void {
    this.filteredSettori = this.searchInput.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.descrizione)),
      map(name => (name ? this._filter(name) : this.listaSettoriSearch.slice())),
    );
  }

  displayFn(argomento: SettoreArgomentoBean): string {
    return argomento && argomento.descrizione ? argomento.descrizione : '';
  }

  private _filter(name: string): SettoreArgomentoBean[] {
    const filterValue = name.toLowerCase();

    let filtro: SettoreArgomentoBean[];

    if ( filterValue !== '*' ) {
      filtro = this.listaSettoriSearch.filter(option => option.descrizione.toLowerCase().includes(filterValue));
    } else  {
      filtro = this.listaSettoriSearch;
    }
    return filtro;
  }

  /**
   * Step 1 - metodi utili
   */

  selectTipoTicket(path: string) {
    this.tipoTicket = this.listArgomentiHelpDesk.filter(argomento => argomento.descrizione.toLowerCase() == path)[0];
    console.warn("this.tipoTicket", this.tipoTicket);
    this.loadingSelectsForm(this.tipoTicket);
    if (this.tipoTicket.descrizione.toLowerCase() === 'business') {
      this.loadingSelectsBySettore();
    }
    this.nextStep();
  }

  selectOptionSezione(settoreArgomentoBean: SettoreArgomentoBean) {
    this.tipoTicket = new ArgomentoHelpDesk();
    this.tipoTicket.idArgomento = settoreArgomentoBean.idArgomento;
    this.tipoTicket.descrizione = settoreArgomentoBean.descrzioneArgomento;

    this.loadingSelectsForm(this.tipoTicket);

    if (this.tipoTicket.descrizione.toLowerCase() === 'business') {
      this.loadingSelectsBySettore();
    }

    this.richiestaForm.get(['settore']).setValue(settoreArgomentoBean.token);
    this.nextStep();
  }


  /**
   *  GESTIONE - STEP 2
   */

  // caricamento delle selects in ogni caso
  loadingSelectsForm(tipoTicket: ArgomentoHelpDesk): void {
    this.spinnerService.activeSpinner();

    let selectByTipo : Observable<JsonResponseBean<any>>;
    if (this.tipoTicket.descrizione.toLowerCase() === 'tecnico') {
        selectByTipo = this.tipologicheService.settoreSelectTecnico();
    } else {
        selectByTipo = this.tipologicheService.settoreSelectBusiness();
    }

    Observable.forkJoin(
      selectByTipo,
      this.serviceDeskService.listaUrgenza(),
      this.serviceDeskService.listaImpatto(),
    ).subscribe({
      next: (resp) => {
        this.listaSettore = resp[0].listObj;
        this.listaUrgenza = resp[1].listObj;
        this.listaImpatto = resp[2].listObj;
      },
      error: err => {
        // console.warn(err);
        // this.spinnerService.closeSpinner()
      },
      complete: () => {
        this.spinnerService.closeSpinner();
      },
    });
  }


  // solo nel caso di tipo business
  loadingSelectsBySettore(): void {
    this.selectForm.get(['buc']).disable();
    this.selectForm.get(['organizzazione']).disable();

    let ts;
    // gestore subscription value changes
    this.subscriptionStep2.push(
      this.richiestaForm.get(['settore']).valueChanges.subscribe(
        tokenSettore => {
          ts = tokenSettore;
          this.selectForm.get(['buc']).disable();
          this.selectForm.get(['organizzazione']).disable();
          this.serviceDeskService.selectBUCBySettore(tokenSettore).subscribe(
            resp => {
              this.selectForm.get(['buc']).enable();
              this.listaBuc = resp.listObj;
            },
            () => {},
            () => {},
          );
        },
      ));

    this.subscriptionStep2.push(
      this.selectForm.get(['buc']).valueChanges.subscribe(
        resp => {
          this.serviceDeskService.selectOrganizzazioneBySettore(ts).subscribe(
            resp => {
              this.selectForm.get(['organizzazione']).enable();
              this.listaOrganizzazione = resp.listObj;
            },
            () => {
            },
            () => {
            },
          );
        },)
    );
  }


  /**
   * Gestione attachments
   */
  get attachments() {
    return this.richiestaForm.get(['attachments']) as FormArray;
  }

  addItemAttachment() {
    this.attachments.push(
      this.fb.group({
        name: [],
        fileSource: ['', [Validators.required, ValidateFileType, ValidateFileSize]]
      })
    );
  }

  logEvento(event: any){
    console.warn("EVENT",event);
  }

  selectedFile(fileList: any) {
    console.warn("Selected file:", fileList);
    if (fileList.length >= 0) {
      for (let file of fileList) {
        if ( !this.attachments.controls ) {

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
  }

  rimuoviFile(i: number) {
    this.attachments.controls.splice(i, 1);
    this.attachments.value.splice(i, 1);
    this.attachments.updateValueAndValidity();
    console.warn("this.attachments", this.attachments);
  }

  unsubscriptionStep2() {
    for (let sub of this.subscriptionStep2) {
      if (sub) {
        sub.unsubscribe();
      }
    }
  }

  tornaIndietro() {
    this.unsubscriptionStep2();
    this.richiestaForm.get(['settore']).setValue(null);
    this.selectForm.get(['buc']).setValue(null); this.selectForm.get(['buc']).disable();
    this.selectForm.get(['organizzazione']).setValue(null); this.selectForm.get(['organizzazione']).disable();
    this.previousStep();
  }


  formToObject(): any { // oggetto richiesta
    return {
      ...TicketInserimentoForm,
      idSettore: this.richiestaForm.get(['settore']).value,
      idBuc: this.selectForm.get(['buc']).value ? this.selectForm.get(['buc']).value : null,
      idOrganization: this.selectForm.get(['organizzazione']).value ? this.selectForm.get(['organizzazione']).value : null,
      title: this.richiestaForm.get(['titolo']).value,
      urgenza: this.richiestaForm.get(['urgenza']).value,
      impatto: this.richiestaForm.get(['impatto']).value,
      descrizione: this.richiestaForm.get(['descrizione']).value,
      idArgomento: this.tipoTicket.idArgomento,
    }
  }


  /**
   * step2 - invia richiesta
   */
  creaTicket(): void {
    let ticket = this.formToObject();
    console.warn("Creat ticket", ticket);
    let allegati: File[] = [];
    this.attachments.controls.forEach(control => {
      if (control.get(['fileSource']).value !== '')
        allegati.push(control.get(['fileSource']).value as File);
    });

    this.spinnerService.activeSpinner();
    this.serviceDeskService.nuovoTicket(ticket, allegati)
      .pipe(
        map((resp) => {
          switch (resp.messaggio.tipoMessaggio) {
            case TIPO_MESSAGGI.ERROR:  throw new Error(resp.messaggio.messaggio);
            case TIPO_MESSAGGI.WARNING: throw new Error(resp.messaggio.messaggio);
            case TIPO_MESSAGGI.SUCCESS: return resp;
          }
        }),
      )
      .subscribe({
      next: resp => {
        console.warn("Next observable");
        console.warn("Resp", resp);
        this.tokenNuovaRichiestaSalvata = resp.obj;
        this.messageUtils.alertSuccess(resp.messaggio.messaggio);
      },
      error: (err) => {
        console.error("Error observable",err);
        this.spinnerService.closeSpinner();
        this.messageUtils.alertWarning(err);
      },
      complete: () => {
        console.warn("Complete observable");
        this.spinnerService.closeSpinner();
        this.nextStep();
      },
    });
  }


  /**
   * Stepper - metodi utili
   */
  nextStep(): void {
    console.warn("nextStep");
    this.ngZone.run(() => {
      this.stepper.selected.completed = true;
      this.stepper.selected.editable = false;
      this.stepper.next();
    });
  }

  previousStep(): void {
    console.warn("previousStep");
    this.ngZone.run(() => {
      this.stepper.steps.get(1).editable = true;
      this.stepper.steps.get(0).editable = true;
      this.stepper.steps.get(0).optional = false
      this.stepper.previous();
    });
  }

}
