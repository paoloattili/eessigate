import { ArgomentiNewsletterForm, DocumentoTemplateObj, EventoTemplateObj, NewsletterTemplate, NewsTemplateObj } from "./../model/newsletter-template";
import { Observable } from "rxjs-compat";
import { SpinnerService } from "src/app/common/services/spinner.service";
import { MessageUtils } from "src/app/utils/message-utils";
import { NewsletterService } from "./../service/newsletter.service";
import { DettaglioNewsletterBean } from "./../model/newsletter.model";
import { Component, ElementRef, Input, OnInit, ViewChild, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef, AfterViewInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { checkDateSystem, creatDateRangeValidator, PATTERN_DESCRIPTION } from "src/app/utils/utils.validator";
import { TipologicheService } from "src/app/common/services/tipologiche.service";
import { NominativoUtente } from "src/app/model/nominativo-utente";
import { RoleSelect } from "src/app/model/role-select";
import { GruppiSelectBean } from "../../spazio-lavoro/model/tipologiche.model";
import { map, startWith } from "rxjs/operators";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { NewsletterForm } from "../model/newsletter-form";
import { of } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { DualListboxItem } from "src/app/class/dual-listbox-item";
import { K } from "@angular/cdk/keycodes";
import { PrevieNewsletterComponent } from "./previe-newsletter/previe-newsletter.component";
import { TIPO_MESSAGGI } from "src/app/utils/enums";

@Component({
  selector: 'app-invia-newsletter',
  templateUrl: './invia-newsletter.component.html',
  styleUrls: ['./invia-newsletter.component.scss']
})
export class InviaNewsletterComponent implements OnInit {

  title="Invia Newsletter";
  oggi = new Date();
  listaSezioni: DualListboxItem[] = [];

  listaSezioniSelezionate: DualListboxItem[] = [];

  argomentiDocumento: NewsletterTemplate[] = [];
  argomentiNews: NewsletterTemplate[] = [];
  argomentiNewsEsterne: NewsletterTemplate[] = [];
  argomentiEventi: NewsletterTemplate[] = [];

  argomentiDocumentoForm: DocumentoTemplateObj[] = [];
  argomentiNewsForm: NewsTemplateObj[] = [];
  argomentiNewsEsterneForm: NewsTemplateObj[] = [];
  argomentiEventiForm: EventoTemplateObj[] = [];

  dateSettate: boolean;

  @ViewChild('bodyNewletter') bodyNewsletter: TemplateRef<any>;
  @ViewChild('divTemplate') divTemplate: ElementRef<HTMLElement>;

  @ViewChild('utentiInput') utentiInput: ElementRef<HTMLInputElement>;
  filteredUtenti: Observable<NominativoUtente[]>;
  utentiInputControl = new FormControl();
  tipologicaUtenti: NominativoUtente[];

  @ViewChild('ruoliInput') ruoliInput: ElementRef<HTMLInputElement>;
  filteredRuoli: Observable<RoleSelect[]>;
  ruoliInputControl = new FormControl();
  tipologicaRuoli: RoleSelect[];

  @ViewChild('gruppiInput') gruppoInput: ElementRef<HTMLInputElement>;
  filteredGruppi: Observable<GruppiSelectBean[]>;
  gruppiInputControl = new FormControl();
  tipologicaGruppi: GruppiSelectBean[];

  newsletterForm: FormGroup= this.fb.group({
    sottotitolo: [null, [Validators.required,Validators.pattern(PATTERN_DESCRIPTION)]],
    dataInizio: [null, [Validators.required]],
    dataFine: [null, Validators.required],
    sezioni: [null, [Validators.required]],
    destinatari: this.fb.group({
      value: ['0', [Validators.required]],
      utenti: [[]],
      gruppi: [[]],
      ruoli: [[]],
    }),
  }, {
    validators: [creatDateRangeValidator()]
  });

  constructor(
    private service: NewsletterService,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private tipologicheService: TipologicheService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.spinnerService.activeSpinner();
    this.getSezioni();
    this.getTipologiche();
    this.onChangeDateInput();
  }

  getTipologiche() {
    Observable.forkJoin([
      this.tipologicheService.getListaUtenti(),
      this.tipologicheService.getListaRuoli(),
      this.tipologicheService.getListaGruppi()
    ]).subscribe(
      (resp: any) => {
        console.warn("TIPO UTENTI",resp[0]);
        this.tipologicaUtenti = resp[0]? resp[0].listObj: null;
        this.filterUtentiInputChanges(); // necessario per i chips di utenti

        console.warn("LISTA RUOLI",resp[1]);
        this.tipologicaRuoli = resp[1]? resp[1].listObj: null;
        this.filterRuoliInputChanges(); // necessario per i chips di ruoli

        console.warn("LISTA GRUPPI",resp[2]);
        this.tipologicaGruppi = resp[2]? resp[2].listObj: null;
        this.filterGruppoInputChanges(); // necessario per i chips di gruppo
      },
      (err) => {
        // console.error(err);
        // this.spinnerService.closeSpinner()
        // this.messageUtils.alertError('Errore nel nel recupero dei dati del form');
      },
      () => this.spinnerService.closeSpinner()
    );
    this.onChangeDestinatariValue();
    this.getSezioniSelected();
  }

  onChangeDateInput() {
    let fromDate;
    let toDate;

    this.newsletterForm.get(['dataInizio']).valueChanges.subscribe(f => {
      console.warn('ciccio1');
      fromDate = this.newsletterForm.get(['dataInizio'])!.value?._d as Date;
      toDate = this.newsletterForm.get(['dataFine'])!.value?._d as Date;
      if(fromDate !== undefined && toDate !== undefined) {
        let validate = this.checkDateRangeValidator() && this.checkDateSystemValidator();
        if(validate) {
          this.dateSettate = true;

          if(this.listaSezioniSelezionate?.length > 0)
            this.getArgomenti();
        } else {
          this.dateSettate = false;
        }
      }else {
        this.dateSettate = false;
      }
    });

    this.newsletterForm.get(['dataFine']).valueChanges.subscribe(f => {
      console.warn('ciccio2');
      fromDate = this.newsletterForm.get(['dataInizio'])!.value?._d as Date;
      toDate = this.newsletterForm.get(['dataFine'])!.value?._d as Date;
      if(fromDate !== undefined && toDate !== undefined) {
        let validate = this.checkDateRangeValidator() && this.checkDateSystemValidator();
        if(validate) {
          this.dateSettate = true;

          if(this.listaSezioniSelezionate?.length > 0)
            this.getArgomenti();
        } else {
          this.dateSettate = false;
        }
      }else {
        this.dateSettate = false;
      }
    });
  }

  checkDateRangeValidator() {
    const start:number = Date.parse(this.newsletterForm.get(["dataInizio"]).value);
    const end:number = Date.parse(this.newsletterForm.get(["dataFine"]).value);

    if (start && end) {
      const isRangeValid = (end - start > 0);
      console.warn("validator isranged",isRangeValid);
      return isRangeValid;
    }
  }

  checkDateSystemValidator() {
    const start:any = this.newsletterForm.get(["dataInizio"]).value;
    const end:any = this.newsletterForm.get(["dataFine"]).value;
    const sysDate = new Date();

    if(start && end) {
      const isRangeValid = (start?._d.getTime() - sysDate.getTime() <= 0) && (end?._d.getTime() - sysDate.getTime() <= 0);
      console.warn("validator isranged",isRangeValid);
      return isRangeValid;
    }
  }

  getSezioni() {
    this.listaSezioni = this.service.sezioni();
  }

  getSezioniSelected() {
    this.service.getlistaSezioniSelezionate().subscribe(elements => {
      this.listaSezioniSelezionate = elements;
      this.newsletterForm.get(['sezioni']).setValue(this.listaSezioniSelezionate);
      console.warn('this.listaSezioniSelezionate',this.listaSezioniSelezionate);

      if(this.listaSezioniSelezionate?.length > 0)
          this.getArgomenti();
    });
  }

  /**
   * Getter NewsletterForm
   */

  get sezioni(): DualListboxItem[] {
    return this.newsletterForm.get(['sezioni']).value as DualListboxItem[];
  }

  get sezioniSelezionate(): DualListboxItem[] {
    return this.newsletterForm.get(['sezioniSelezionate']).value as DualListboxItem[];
  }

  get destinatari(): FormGroup {
    return this.newsletterForm.get(['destinatari']) as FormGroup;
  }

  get tuttiGliUtenti(): number {
    return this.newsletterForm.get(['tuttiGliUtenti']).value as number;
  }

  get utenti(): NominativoUtente[] {
    return this.destinatari.get(['utenti']).value as NominativoUtente[];
  }

  get ruoli(): RoleSelect[] {
    return this.destinatari.get(['ruoli']).value as RoleSelect[];
  }

  get gruppi(): GruppiSelectBean[] {
    return this.destinatari.get(['gruppi']).value as GruppiSelectBean[];
  }

  /**
   * Change value tipo destinatari
   */

  onChangeDestinatariValue(){
    this.destinatari.valueChanges.subscribe(
      r => {
        this.utenti.splice(0,this.utenti.length);
        this.gruppi.splice(0,this.gruppi.length);
        this.ruoli.splice(0,this.ruoli.length);
      }
    )
  }

  /**
   * Gestione Chips Utenti
   */

  filterUtentiInputChanges(): void {
    this.filteredUtenti = this.utentiInputControl.valueChanges.pipe(
      startWith(''),
      map((filterValue: string) => (filterValue ? this._filterUtenti(filterValue) : this.tipologicaUtenti.slice())),
    );
  }

  private _filterUtenti(filterValue: string): NominativoUtente[] {
    console.warn("FILTER UTENTE", this.tipologicaUtenti, filterValue);
    if (typeof filterValue === 'string') {
      filterValue = filterValue?.toLowerCase();
    } else {
      filterValue = '';
    }
    return this.tipologicaUtenti.filter(utente => utente.nominativo.toLowerCase().includes(filterValue));
  }

  rimuoviUtente(tag: NominativoUtente): void {
    console.log("tag utente ", tag);
    const index = this.utenti.indexOf(tag);
    if (index >= 0) {
      this.utenti.splice(index, 1);
    }
  }

  selectedUtente(event: MatAutocompleteSelectedEvent): void {
    console.log("Selected utente", event);
    this.utenti.push(event.option.value as NominativoUtente);

    this.utentiInput.nativeElement.value = '';
    this.utentiInputControl.setValue(null);
  }

  /**
   * Gestione Chips Ruoli
   */

   filterRuoliInputChanges(): void {
    this.filteredRuoli = this.ruoliInputControl.valueChanges.pipe(
      startWith(''),
      map((filterValue: string) => (filterValue ? this._filterRuoli(filterValue) : this.tipologicaRuoli.slice())),
    );
  }

  private _filterRuoli(filterValue: string): RoleSelect[] {
    console.warn("FILTER RUOLO", this.tipologicaRuoli, filterValue);
    if (typeof filterValue === 'string') {
      filterValue = filterValue?.toLowerCase();
    } else {
      filterValue = '';
    }
    return this.tipologicaRuoli.filter(ruolo => ruolo.nome.toLowerCase().includes(filterValue));
  }

  rimuoviRuolo(tag: RoleSelect): void {
    console.log("tag ruolo ", tag);
    const index = this.ruoli.indexOf(tag);
    if (index >= 0) {
      this.ruoli.splice(index, 1);
    }
  }

  selectedRuolo(event: MatAutocompleteSelectedEvent): void {
    console.log("Selected ruolo", event);
    this.ruoli.push(event.option.value as RoleSelect);

    this.ruoliInput.nativeElement.value = '';
    this.ruoliInputControl.setValue(null);
  }


  /**
   * Gestione Chips Gruppi
   */

   filterGruppoInputChanges(): void {
    this.filteredGruppi = this.gruppiInputControl.valueChanges.pipe(
      startWith(''),
      map((filterValue: string) => (filterValue ? this._filterGruppo(filterValue) : this.tipologicaGruppi.slice())),
    );
  }

  private _filterGruppo(filterValue: string): GruppiSelectBean[] {
    console.warn("FILTER GRUPPO", this.tipologicaGruppi, filterValue);
    if (typeof filterValue === 'string') {
      filterValue = filterValue?.toLowerCase();
    } else {
      filterValue = '';
    }
    return this.tipologicaGruppi.filter(gruppo => gruppo.name.toLowerCase().includes(filterValue));
  }

  rimuoviGruppo(tag: GruppiSelectBean): void {
    console.log("tag gruppo ", tag);
    const index = this.gruppi.indexOf(tag);
    if (index >= 0) {
      this.gruppi.splice(index, 1);
    }
  }

  selectedGruppo(event: MatAutocompleteSelectedEvent): void {
    console.log("Selected gruppo", event);
    this.gruppi.push(event.option.value as GruppiSelectBean);

    this.gruppoInput.nativeElement.value = '';
    this.gruppiInputControl.setValue(null);
  }

  invia() {
    const form = this.formToObj();
    console.warn('newsletter form',form);
    this.spinnerService.activeSpinner();
    this.service.invia(form).subscribe(
      resp => {
        if(resp.messaggio?.tipoMessaggio === TIPO_MESSAGGI.WARNING)
          this.messageUtils.alertWarning(resp.messaggio.messaggio);
        else if(resp.messaggio?.tipoMessaggio === TIPO_MESSAGGI.ERROR)
          this.messageUtils.alertError(resp.messaggio.messaggio);
        else {
          this.router.navigate([`../ricerca`],{relativeTo: this.activatedRoute}).then(r => {
            this.spinnerService.closeSpinner();
            this.messageUtils.alertSuccess(resp.messaggio.messaggio);
          });
        }
      },
      (err) => {
        // console.error(err);
        // this.spinnerService.closeSpinner()
        // this.messageUtils.alertError('Errore nell\'invio della newsletter');
      },
      () => this.spinnerService.closeSpinner()
    )
  }

  formToObj(): NewsletterForm{
    return {
      ...new NewsletterForm(),
      sottotitolo: this.newsletterForm.get(['sottotitolo']).value,
      // bodyNewsletter: this.divTemplate.nativeElement.innerHTML,
      fromDate: this.newsletterForm.get(['dataInizio'])!.value?._d as Date,
      toDate: this.newsletterForm.get(['dataFine'])!.value?._d as Date,
      sezioni: this.getSezioniValue(this.listaSezioniSelezionate),
      tuttiGliUtenti: this.destinatari.get(['value'])!.value === '0'? true : false,
      destinatariUtenti: this.getUserId(this.destinatari.get(['utenti'])!.value),
      tokenDestinatariGruppi: this.getTokens(this.destinatari.get(['gruppi'])!.value),
      tokenDestinatariRuoli: this.getTokens(this.destinatari.get(['ruoli'])!.value),
      docList: this.argomentiDocumentoForm,
      eventiList: this.argomentiEventiForm,
      newsList: this.argomentiNewsForm,
      newsEsterneList: this.argomentiNewsEsterneForm
    }
  }

  getSezioniValue(sez: DualListboxItem[]) {
    let sezioniValue: string[] = [];
    sez.forEach(s => sezioniValue.push(s.key));
    return sezioniValue;
  }

  getTokens(objs: any[]): string[] {
    const tokens: string[] = [];
    for (const obj of objs) {
      if (obj?.token) {
        tokens.push(obj.token);
      }
    }
    return tokens;
  }

  private getUserId(objs: any[]): string[] {
    const userIds: string[] = [];
    for (const obj of objs) {
      if (obj?.userId) {
        userIds.push(obj.userId);
      }
    }
    return userIds;
  }

  getArgomenti() {
    const form = this.formArgomentiToObj();
    console.warn('form',form);
    this.spinnerService.activeSpinner();
    this.service.argomentiNewsletter(form).subscribe(
      resp => {
        let data = resp?.listObj;
        console.warn('response', data)
        if(data) {
          this.argomentiDocumento = this.getDocumentsByRange(data);
          if(this.argomentiDocumento?.length > 0) {
            this.argomentiDocumentoForm = this.argomentiDocumento.map(d => this.getDocumentiTemplateOBJ(d));
          } else {
            this.argomentiDocumentoForm = [];
          }

          this.argomentiNews = this.getNewsByRange(data);
          if(this.argomentiNews?.length > 0) {
            this.argomentiNewsForm = this.argomentiNews.map(n => this.getNewsTemplateOBJ(n));
          } else {
            this.argomentiNewsForm = [];
          }

          this.argomentiNewsEsterne = this.getNewsEsterneByRange(data);
          if(this.argomentiNewsEsterne?.length > 0) {
            this.argomentiNewsEsterneForm = this.argomentiNewsEsterne.map(n => this.getNewsEsterneTemplateOBJ(n));
          } else {
            this.argomentiNewsEsterneForm = [];
          }

          this.argomentiEventi = this.getEventsByRange(data);
          if(this.argomentiEventi?.length > 0) {
            this.argomentiEventiForm = this.argomentiEventi.map(e => this.getEventiTemplateOBJ(e));
          } else {
            this.argomentiEventiForm = [];
          }

          console.warn('docs', this.argomentiDocumento);
          console.warn('news', this.argomentiNews);
          console.warn('esterne', this.argomentiNewsEsterne);
          console.warn('events', this.argomentiEventi);

          console.warn('docsForm', this.argomentiDocumentoForm);
          console.warn('newsForm', this.argomentiNewsForm);
          console.warn('esterneForm', this.argomentiNewsEsterneForm);
          console.warn('eventsForm', this.argomentiEventiForm);
        }
      },
      (err) => {
        // console.error(err);
        // this.spinnerService.closeSpinner()
        // this.messageUtils.alertError('Errore nel recupero dei dati delle sezioni selezionate');
      },
      () => this.spinnerService.closeSpinner()
    );
  }

  getNewsTemplateOBJ(obj: NewsletterTemplate): NewsTemplateObj {
    return {
      ...new NewsTemplateObj(),
      author: obj.nominativo,
      dataPubblicazione: obj.dataInserimento,
      titolo: obj.titolo,
      sommario: obj.sommario,
      token: obj.token
    }
  }

  getNewsEsterneTemplateOBJ(obj: NewsletterTemplate): NewsTemplateObj {
    return {
      ...new NewsTemplateObj(),
      author: obj.nominativo,
      dataPubblicazione: obj.dataInserimento,
      titolo: obj.titolo,
      sommario: obj.sommario,
      token: obj.token
    }
  }

  getDocumentiTemplateOBJ(obj: NewsletterTemplate): DocumentoTemplateObj {
    return {
      ...new DocumentoTemplateObj(),
      author: obj.author,
      countCommenti: obj.countCommenti,
      categoryType: obj.categoryType,
      documentType: obj.documentType,
      creationDate: obj.creationDate,
      titolo: obj.title,
      token: obj.token
    }
  }

  getEventiTemplateOBJ(obj: NewsletterTemplate): EventoTemplateObj {
    return {
      ...new EventoTemplateObj(),
      titolo: obj.title,
      labelLocation: obj.location,
      dataInizio: obj.startDate,
      dataChiusura: obj.closingDate,
      dataFine: obj.endDate,
      token: obj.token
    }
  }

  openModalPreview() {
    const dialogRef = this.dialog.open(
      PrevieNewsletterComponent,
      {
        data: this.bodyNewsletter,
        width: '65rem',
        // disableClose: true
      }
    );
  }

  formArgomentiToObj(): ArgomentiNewsletterForm {
    return {
      ...new ArgomentiNewsletterForm(),
      sezioni: this.getIdFromSezioni(this.newsletterForm.get(['sezioni']).value),
      dataInizio: this.newsletterForm.get(['dataInizio']).value,
      dataFine: this.newsletterForm.get(['dataFine']).value
    }
  }

  getIdFromSezioni(sezioni: DualListboxItem[]): number[] {
    return sezioni.map(s => {
      let k: number = +s.key;
      return k;
    });
  }

  getDocumentsByRange(data: NewsletterTemplate[]): NewsletterTemplate[] {
    return data.filter(d => d.documentType);
  }

  getNewsByRange(data: NewsletterTemplate[]): NewsletterTemplate[] {
    return data.filter(d => d.contentType !== null && d.contentType == 'News');
  }

  getNewsEsterneByRange(data: NewsletterTemplate[]): NewsletterTemplate[] {
    return data.filter(d => d.contentType !== null && d.contentType == 'News (External)');
  }

  getEventsByRange(data: NewsletterTemplate[]): NewsletterTemplate[] {
    return data.filter(d => d.typeId);
  }

}
