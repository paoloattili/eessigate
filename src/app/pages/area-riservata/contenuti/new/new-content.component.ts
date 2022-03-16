import { MessageUtils } from "./../../../../utils/message-utils";
import { SpinnerService } from "./../../../../common/services/spinner.service";
import { TipologicheService } from "./../../../../common/services/tipologiche.service";
import { ContentService } from "./../service/content.service";
import { RoleSelect } from "./../../../../model/role-select";
import { NominativoUtente } from "./../../../../model/nominativo-utente";
import { ContentTypeSelect } from "./../../../../model/content-type-select";
import { forkJoin } from "rxjs";
import { GruppiSelectBean } from "../../spazio-lavoro/model/tipologiche.model";
import { Observable } from 'rxjs-compat';
import { map, startWith } from "rxjs/operators";
import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PATTERN_CONTENT, ValidateBody, ValidateFileName, ValidateFileSize, ValidateFileType, ValidateImage, ValidateNotImage } from "../../../../utils/utils.validator";
import { ActivatedRoute, Router } from "@angular/router";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { NuovoContenutoForm } from "src/app/model/nuovo-contenuto-form";
import { TIPO_MESSAGGI } from "src/app/utils/enums";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-new',
  templateUrl: './new-content.component.html',
  styleUrls: ['./new-content.component.scss']
})
export class NewContentComponent implements OnInit, AfterViewChecked {

  title = "Nuovo Contenuto";
  listaTipiContenuto: ContentTypeSelect[] = [];
  flagDapubblicare: boolean;
  tipoContenuto: any;

  @ViewChild('imgInput') imgInput: ElementRef;
  @ViewChild('attachmentsInput') attachmentsInput: ElementRef;
  @ViewChild('galleryInput') galleryInput: ElementRef;

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

  contenutoForm: FormGroup = this.fb.group({
    tokenIdTipoContent: [null, [Validators.required]],
    titolo: [null, [Validators.required, Validators.pattern(PATTERN_CONTENT)]],
    sottotitolo: [null, [Validators.pattern(PATTERN_CONTENT)]],
    sommario: [null, [Validators.required, Validators.pattern(PATTERN_CONTENT)]],
    body: [null, [Validators.required, ValidateBody]],
    img: this.fb.group({
      name: [],
      fileSource: [null, [ValidateFileType, ValidateFileName, ValidateImage, ValidateFileSize]],
    }),
    attachments: this.fb.array([]),
    gallery: this.fb.array([]),
    destinatari: this.fb.group({
      value: ['0', [Validators.required]],
      utenti: [[]],
      gruppi: [[]],
      ruoli: [[]],
    }),
    daPubblicare: [false, [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private contenutiService: ContentService,
    private spinnerService: SpinnerService,
    private tipologicheService: TipologicheService,
    private messageUtils: MessageUtils,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getTipologiche();
    this.addItemAttachment();
    this.addItemGallery();
    this.onChangeDestinatariValue();
    this.onChangeTipoContenuto();
  }

  getTipologiche() {
    this.spinnerService.activeSpinner();
    Observable.forkJoin([
      this.tipologicheService.getListaTipiContenuti(),
      this.tipologicheService.getListaUtenti(),
      this.tipologicheService.getListaRuoli(),
      this.tipologicheService.getListaGruppi()
    ]).subscribe(
      (resp: any) => {
        console.warn("TIPI CONTENUTI",resp[0]);
        this.listaTipiContenuto = resp[0]? resp[0].listObj: null;

        console.warn("TIPO UTENTI",resp[1]);
        this.tipologicaUtenti = resp[1]? resp[1].listObj: null;
        this.filterUtentiInputChanges(); // necessario per i chips di utenti

        console.warn("LISTA RUOLI",resp[2]);
        this.tipologicaRuoli = resp[2]? resp[2].listObj: null;
        this.filterRuoliInputChanges(); // necessario per i chips di ruoli

        console.warn("LISTA GRUPPI",resp[3]);
        this.tipologicaGruppi = resp[3]? resp[3].listObj: null;
        this.filterGruppoInputChanges(); // necessario per i chips di gruppo
      },
      (err) => {
        // console.error(err);
        // this.messageUtils.alertError('Errore nel nel recupero dei dati del form');
        // this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    );
  }

  /**
   * Getter ContenutoForm
   */

  get destinatari(): FormGroup {
    return this.contenutoForm.get(['destinatari']) as FormGroup;
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
   * Change Tipo
   */

  onChangeTipoContenuto() {
    this.contenutoForm.valueChanges.subscribe(c => {
      this.tipoContenuto = this.contenutoForm.get(['tokenIdTipoContent'])?.value;
      console.warn('this.tipoContenuto',this.tipoContenuto);
    })
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

  /**
   * Gestione img
   */
  get img(): FormGroup {
    return this.contenutoForm.get(['img']) as FormGroup;
  }

  selectedImg(fileList: any) {
    console.warn("Selected file:", fileList);
    if (fileList.length > 0) {
      const file: File = fileList[0];
      console.warn('img',this.img)
      this.img.get(['fileSource']).setValue(file);
      this.img.get(['name']).setValue(file.name);
    } else {
      this.img.get(['name']).setValue('Scegli un file');
    }
  }

  /**
   * Gestione attachments
   */
  get attachments() {
    return this.contenutoForm.get(['attachments']) as FormArray;
  }

  addItemAttachment() {
    this.attachments.push(
      this.fb.group({
        name: [],
        fileSource: [null, [ValidateFileType, ValidateFileName, ValidateNotImage, ValidateFileSize]]
      })
    );
  }

  selectedFile(fileList: any, i: number) {
    console.warn("Selected file:", fileList);
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const attachment = this.attachments.controls[i] as FormGroup;
      attachment.get(['fileSource']).setValue(file);
      attachment.get(['name']).setValue(file.name);
      if(this.checkImgType(file.name)) {
        console.warn("file.name", file.name);
        this.addItemAttachment();
      }
    } else {
      this.attachments.get(['name']).setValue('Scegli un file');
    }
  }

  rimuoviFile(i: number) {
    this.attachments.controls.splice(i,1);
  }

  pulisciFile(i: number) {
    const attachment = this.attachments.controls[i] as FormGroup;
    attachment.get(['fileSource']).setValue(null);
    attachment.get(['name']).setValue(null);
  }

  /**
   * Gestione gallery
   */
  get gallery() {
    return this.contenutoForm.get(['gallery']) as FormArray;
  }

  addItemGallery() {
    this.gallery.push(
      this.fb.group({
        name: [],
        fileSource: [null, [ValidateFileType, ValidateImage, ValidateFileSize]]
      })
    );
  }

  selectedGallery(fileList: any, i: number) {
    console.warn("Selected file:", fileList);
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const gallery = this.gallery.controls[i] as FormGroup;
      console.warn("this.gallery:", this.gallery);
      gallery.get(['fileSource']).setValue(file);
      gallery.get(['name']).setValue(file.name);
      if(!this.checkImgType(file.name)) {
        this.addItemGallery();
      }
    } else {
      this.gallery.get(['name']).setValue('Scegli un file');
    }
  }

  rimuoviGallery(i: number) {
    this.gallery.controls.splice(i,1);
  }

  pulisciGallery(i: number) {
    const gallery = this.gallery.controls[i] as FormGroup;
    gallery.get(['fileSource']).setValue(null);
    gallery.get(['name']).setValue(null);
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

  save() {
    const form = this.formToObj();
    console.warn('form',form);
    const img = this.img.get(['fileSource']).value;
    const allegati = this.attachments? this.getArrayFromItems(this.attachments): null;
    const gallery = this.gallery? this.getArrayFromItems(this.gallery): null;

    this.spinnerService.activeSpinner();
    this.contenutiService.creaContenuto(form, img, allegati, gallery).subscribe(
      resp => {
        if(resp && resp.messaggio.tipoMessaggio === TIPO_MESSAGGI.WARNING) this.messageUtils.alertWarning(resp.messaggio.messaggio);
        else if(resp && resp.messaggio.tipoMessaggio === TIPO_MESSAGGI.SUCCESS) {
          if(this.flagDapubblicare) {

            if(this.tipoContenuto?.idWorkflowType === 2) {
              this.router.navigate(['../pubblica-contenuti'],{relativeTo: this.activatedRoute}).then(r => {
                this.spinnerService.closeSpinner();
                this.messageUtils.alertSuccess(resp.messaggio.messaggio);
              });
            }

            if(this.tipoContenuto?.idWorkflowType === 3) {
              this.router.navigate(['../approva-contenuti'],{relativeTo: this.activatedRoute}).then(r => {
                this.spinnerService.closeSpinner();
                this.messageUtils.alertSuccess(resp.messaggio.messaggio);
              });
            }

          } else {
            this.router.navigate(['../modifica-contenuti'],{relativeTo: this.activatedRoute}).then(r => {
              this.spinnerService.closeSpinner();
              this.messageUtils.alertSuccess(resp.messaggio.messaggio);
            });
          }
        }
      },
      (err) => {
        // console.error(err);
        // this.messageUtils.alertError('Errore nella creazione della news');
        // this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    );

  }

  private formToObj(): NuovoContenutoForm {

    this.flagDapubblicare = this.contenutoForm.get(['daPubblicare'])!.value;

    return {
      ...new NuovoContenutoForm(),
      tokenIdTipoContent: this.getToken(this.contenutoForm.get(['tokenIdTipoContent']).value),
      titolo: this.contenutoForm.get(['titolo']).value,
      sottotitolo: this.contenutoForm.get(['sottotitolo']).value,
      sommario: this.contenutoForm.get(['sommario']).value,
      body: this.stripTagsBody(this.contenutoForm.get(['body']).value),
      tuttiGliUtenti: this.contenutoForm.get(['destinatari'])!.value?.value === '0'? true : false,
      destinatariUtenti: this.getUserId(this.destinatari.get(['utenti'])!.value),
      tokenDestinatariGruppi: this.getTokens(this.destinatari.get(['gruppi'])!.value),
      tokenDestinatariRuoli: this.getTokens(this.destinatari.get(['ruoli'])!.value),
      daPubblicare: this.contenutoForm.get(['daPubblicare'])!.value,
    }
  }

  private getTokens(objs: any[]): string[] {
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

  private getToken(obj: any): string {
    return obj?.token;
  }

  private checkImgType(name: string) {
    const notAllowedTypes = ['jpg','jpeg','png','gif','jpe','ief'];
    const types = notAllowedTypes.filter(type => type == name?.split('.')[1].toLowerCase());
    console.warn('types',types);
    return types.length === 0;
  }

  private stripTagsBody(body: string) {
    return body.substring(body.indexOf('<p>')+3, body.lastIndexOf('</p>'));
  }

  ngAfterViewChecked(): void {
    const divDaNascondere1 = document.getElementsByClassName('tox-statusbar__branding') as any;

    if(divDaNascondere1 && divDaNascondere1[0])
      divDaNascondere1[0].style.display = 'none';
  }

}
