import { User } from "./../../../../model/user";
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Observable} from "rxjs";
import {filter, map, startWith} from "rxjs/operators";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {DocumentoService} from "../service/documento.service";
import {GruppiSelectBean, TipoDocumentoBean} from "../model/tipologiche.model";
import {TreeService} from "../service/tree.service";
import {DocumentoForm} from "../model/documentoForm.model";
import {ActivatedRoute, Router} from "@angular/router";
import {SpinnerService} from "../../../../common/services/spinner.service";
import {
  PATTERN_DESCRIPTION,
  PATTERN_DOCUMENT_NAME,
  PATTERN_NAME,
  ValidateFileName,
  ValidateFileSize,
  ValidateFileType
} from "../../../../utils/utils.validator";
import {MessageUtils} from "../../../../utils/message-utils";
import {TipologicheService} from "../../../../common/services/tipologiche.service";
import {CategoryNode} from "../../../../class/category-node";
import { TIPO_MESSAGGI } from "src/app/utils/enums";
import { WebsocketNotifiche } from "src/app/utils/websocket-notifiche";

@Component({
  selector: 'app-new-documento',
  templateUrl: './new-documento.component.html',
  styleUrls: ['./new-documento.component.scss']
})
export class NewDocumentoComponent implements OnInit {
  workspaceId: number;
  utente: any;
  categoryNode: CategoryNode;
  gruppoUtente: boolean = true;
  toolTipLabelGroup: string;
  gruppiNonDellutente: string[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('fileInput') fileInput: ElementRef;
  tipiDocumentoTipologiche: TipoDocumentoBean[];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  filteredTags: Observable<string[]>;
  tagsInputControl = new FormControl();
  tagsTipologiche: string[];


  @ViewChild('gruppoInput') gruppoInput: ElementRef<HTMLInputElement>;
  filteredGruppi: Observable<GruppiSelectBean[]>;
  gruppiInputControl = new FormControl();
  gruppiTipologiche: GruppiSelectBean[];

  documentoForm: FormGroup = this.fb.group({
    categoria: [null, [Validators.required]],
    autore: [null, [Validators.required, Validators.pattern(PATTERN_NAME)]],
    tipoDocumento: [null, [Validators.required]],
    titolo: [null, [Validators.required, Validators.pattern(PATTERN_DOCUMENT_NAME)]],
    descrizione: [null, [Validators.pattern(PATTERN_DESCRIPTION)]],
    // nomeDocumento: [null, [Validators.required]],
    file: this.fb.group({
      name: [],
      fileSource: [null, [Validators.required, Validators.pattern(PATTERN_NAME), ValidateFileType, ValidateFileSize]],
    }),
    stato: ['0', [Validators.required]], // valori  1 2
    visibilita: this.fb.group({ // valori 1 2 3
      value: ['0', [Validators.required]],
      gruppi: [[]],
    }),
    tags: [[]],
    note: [null, [Validators.pattern(PATTERN_DESCRIPTION)]],
    notifica: [false, [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private documentiService: DocumentoService,
    private tipologicheService: TipologicheService,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    private treeService: TreeService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {

    this.treeService.categoryNodeSubject.pipe(filter(category => category !== null)).subscribe(category => {
      this.documentoForm.get(['categoria']).setValue(category.name);
      this.categoryNode = category;
    });

    this.getTipologiche();

    this.activatedRoute.parent.data.pipe(filter(data => data['workspaceId'] !== null)).subscribe(data => {
      this.workspaceId = data['workspaceId'];
    });

    this.utente = JSON.parse(localStorage.getItem('user')).denominazione;
    this.documentoForm.patchValue({
      autore: this.utente
    });
  }


  getTipologiche(): void{
      Observable.forkJoin([
        this.tipologicheService.getTipiDocumento(),
        this.tipologicheService.getListaTag(),
        this.tipologicheService.getListaGruppi()
      ]).subscribe(
        (resp: any) => {
          console.warn("TIPO DOCUMENTO",resp[0]);
          this.tipiDocumentoTipologiche = resp[0]? resp[0].listObj: null;

          console.warn("LISTA TAG",resp[1]);
          this.tagsTipologiche = resp[1]? resp[1].listObj: null;
          this.filterTagInputChanges(); // necessario per i chips di tags

          console.warn("LISTA GRUPPI",resp[2]);
          this.gruppiTipologiche = resp[2]? resp[2].listObj: null;
          this.filterGruppoInputChanges(); // necessario per i chips di gruppo
        },
        (err) => {
          // console.error(err);
          // this.messageUtils.alertError('Errore nel nel recupero dei dati del form');
          // this.spinnerService.closeSpinner()
        }
      );
  }


  /**
   * Getter-Setter DocumentForm
   */

  get visibilita(): FormGroup {
    return this.documentoForm.get(['visibilita']) as FormGroup;
  }

  get gruppi(): GruppiSelectBean[] {
    return this.visibilita.get(['gruppi']).value as GruppiSelectBean[];
  }

  get tags(): string[] {
    return this.documentoForm.get(['tags']).value as string[];
  }

  set tags(t: string[]) {
    this.documentoForm.get(['tags']).setValue(t);
  }


  /**
   * Gestione File
   */
  get file(): FormGroup {
    return this.documentoForm.get(['file']) as FormGroup;
  }

  selectedFile(fileList: any) {
    console.warn("Selected file:", fileList);
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.file.get(['fileSource']).setValue(file);
      this.file.get(['name']).setValue(file.name);

    } else {
      this.file.get(['name']).setValue('Scegli un file');
    }
  }

  /**
   * Gestione Chips Gruppi
   */

  filterGruppoInputChanges(): void {
    this.filteredGruppi = this.gruppiInputControl.valueChanges.pipe(
      startWith(''),
      map((filterValue: string) => (filterValue ? this._filterGruppo(filterValue) : this.gruppiTipologiche.slice())),
    );
  }

  removeGruppo(tag: GruppiSelectBean): void {
    console.log("[test gruppi list] removeGruppo ", tag);
    const index = this.gruppi.indexOf(tag);
    if (index >= 0) {

      let groupSelected: GruppiSelectBean = this.gruppi[index];

      let setGruppiNonDellutente = [...new Set<string>(this.gruppiNonDellutente)];

      const gIndex = setGruppiNonDellutente.indexOf(groupSelected.name);

      setGruppiNonDellutente.splice(gIndex,1);

      this.gruppi.splice(index, 1);

      if(this.gruppi.length > setGruppiNonDellutente.length){
        this.gruppoUtente = true;
        this.toolTipLabelGroup = null;
      } else if(setGruppiNonDellutente.length === 1) {
        this.toolTipLabelGroup = 'Attenzione! Il gruppo ' + setGruppiNonDellutente[0] + ' non fa parte dei gruppi a cui appartieni, quindi non potrai accedere al documento';
        this.gruppoUtente = false;
      } else if(setGruppiNonDellutente.length > 1) {
        this.toolTipLabelGroup = 'Attenzione! I gruppi ' + setGruppiNonDellutente.join(', ') + ' non fanno parte dei gruppi a cui appartieni, quindi non potrai accedere al documento';
        this.gruppoUtente = false;
      } else {
        this.gruppoUtente = true;
        this.toolTipLabelGroup = null;
      }

      this.gruppiNonDellutente = setGruppiNonDellutente;
      console.warn('this.gruppoUtente',this.gruppoUtente);
      console.warn('this.toolTipLabelGroup',this.toolTipLabelGroup);
    }
  }

  selectedGruppo(event: MatAutocompleteSelectedEvent): void {
    console.warn("[test gruppi list] SELECTED GROUP: ", event);
    let groupSelected = event.option.value as GruppiSelectBean;
    this.gruppi.push(groupSelected);

    const user: User = JSON.parse(localStorage.getItem('user'));

    if(user) {
      if(user.tokenIdUserGroups) {
        let gruppoPresente: boolean = false;
        user.tokenIdUserGroups.forEach(g => {
          if(groupSelected.token === g) {
            gruppoPresente = true;
          }
        });

        if(!gruppoPresente)
          this.gruppiNonDellutente.push(groupSelected.name);

        let setGruppiNonDellutente = [...new Set<string>(this.gruppiNonDellutente)];

        if(this.gruppi.length > setGruppiNonDellutente.length){
          this.gruppoUtente = true;
          this.toolTipLabelGroup = null;
        } else if(setGruppiNonDellutente.length === 1) {
          this.toolTipLabelGroup = 'Attenzione! Il gruppo ' + setGruppiNonDellutente[0] + ' non fa parte dei gruppi a cui appartieni, quindi non potrai accedere al documento';
          this.gruppoUtente = false;
        } else if(setGruppiNonDellutente.length > 1) {
          this.toolTipLabelGroup = 'Attenzione! I gruppi ' + setGruppiNonDellutente.join(', ') + ' non fanno parte dei gruppi a cui appartieni, quindi non potrai accedere al documento';
          this.gruppoUtente = false;
        } else {
          this.gruppoUtente = true;
          this.toolTipLabelGroup = null;
        }

        this.gruppiNonDellutente = setGruppiNonDellutente;
        console.warn('this.gruppoUtente',this.gruppoUtente);
        console.warn('this.toolTipLabelGroup',this.toolTipLabelGroup);
      }
    } else {
      this.router.navigate(['']).then(() => {
        this.messageUtils.alertError('Errore recupero dati utente');
      });
    }

    this.gruppoInput.nativeElement.value = '';
    this.gruppiInputControl.setValue(null);
  }

  private _filterGruppo(filterValue: string): GruppiSelectBean[] {
    console.warn("FILTER GRUPPO", this.gruppiTipologiche, filterValue);
    if (typeof filterValue === 'string') {
      filterValue = filterValue?.toLowerCase();
    } else {
      filterValue = '';
    }
    return this.gruppiTipologiche.filter(gruppo => gruppo.name.toLowerCase().includes(filterValue));
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


  /**
   * Gestione Chips Tags
   */

  filterTagInputChanges(): void {
    this.filteredTags = this.tagsInputControl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filterTag(tag) : this.tagsTipologiche.slice())),
    );
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
    this.tagsInputControl.setValue(null);
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagsInputControl.setValue(null);
  }

  private _filterTag(value: string): string[] {
    const filterValue = value?.toLowerCase();

    return this.tagsTipologiche.filter(tag => tag.toLowerCase().includes(filterValue));
  }


  formToObject(): DocumentoForm {

    let toPublished: number;
    let published: number;

    console.warn('stato',this.documentoForm.get(['stato']).value);

    if (this.documentoForm.get(['stato']).value === '0') {
      toPublished = 0;
      published = 0;
    }  else {
      // stato di approvazione
      toPublished = 0;
      published = 1;
    }


    // fix id workspace
    let workspaceIdString: string;
    switch (this.workspaceId) {
      case 1:
        workspaceIdString = 'WORKSPACE NG.EDE Accounting - Deliverables';
        break;
      case 2:
        workspaceIdString = 'WORKSPACE NG.EDE Documentation';
        break;
      case 3:
        workspaceIdString = 'WORKSPACE EESSI News - Documentation';
        break;
      case 4:
        workspaceIdString = 'WORKSPACE RINA Handover';
        break;
    }

    return {
      ...new DocumentoForm(),
      title: this.documentoForm.get(['titolo'])!.value,
      description: this.documentoForm.get(['descrizione'])!.value,
      author: this.documentoForm.get(['autore'])!.value,
      uploadNote: this.documentoForm.get(['note'])!.value,
      toPublished: toPublished,
      published: published,
      idDocumentTypeToken: this.documentoForm.get(['tipoDocumento'])!.value,
      inviaNotifica: this.documentoForm.get(['notifica'])!.value,
      tags: this.documentoForm.get(['tags'])!.value,
      reserved: this.visibilita.get(['value'])!.value,
      categoryIdToken: this.categoryNode.tokenCategoryId,
      gruppiToken: this.getTokens(this.visibilita.get(['gruppi'])!.value),
      categoryType: workspaceIdString,
    }
  }

  save(): void {
    const documentoForm = this.formToObject();
    console.warn("Save new documento", documentoForm);
    const file = this.file.get(['fileSource']).value;

    this.spinnerService.activeSpinner();

    this.documentiService.caricaDocumento(documentoForm, file)
      .subscribe(
        resp => {
          console.warn("Response caricamento new documento:", resp);
          if(resp.messaggio?.tipoMessaggio === TIPO_MESSAGGI.SUCCESS) {
            this.router.navigate([`../detail-documento`],{queryParams: {t: resp.obj}, relativeTo: this.activatedRoute}).then(() => {
              console.log("arrivato");
              this.spinnerService.closeSpinner();
              this.messageUtils.alertSuccess(resp.messaggio.messaggio);
              // setTimeout(t => this.websocketNotifiche._send(resp.obj), 2000);
            });
          } else if (resp.messaggio?.tipoMessaggio === TIPO_MESSAGGI.WARNING) {
            this.messageUtils.alertWarning(resp.messaggio.messaggio);
          } else if (resp.messaggio?.tipoMessaggio === TIPO_MESSAGGI.ERROR) {
            this.messageUtils.alertError(resp.messaggio.messaggio);
          }
        },
        (err) => {
          // console.error(err);
          // this.spinnerService.closeSpinner();
          // this.messageUtils.alertError('Errore nel caricamento del documento.');
        },
        () => this.spinnerService.closeSpinner()
      );


  }


}
