import {SpinnerService} from "../../../../common/services/spinner.service";
import {DettaglioDocumento} from "../../../../model/dettaglio-documento";
import {ActivatedRoute, Router} from "@angular/router";
import {DocumentoService} from "../service/documento.service";
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  PATTERN_DESCRIPTION,
  PATTERN_DOCUMENT_NAME,
  PATTERN_NAME,
  ValidateFileName, ValidateFileSize,
  ValidateFileType
} from "../../../../utils/utils.validator";
import {GruppiSelectBean, TipoDocumentoBean} from "../model/tipologiche.model";
import {Observable} from "rxjs";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {TipologicheService} from "../../../../common/services/tipologiche.service";
import {filter, map, skip, startWith} from "rxjs/operators";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {DocumentoForm} from "../model/documentoForm.model";
import {CategoryNode} from "../../../../class/category-node";
import {HttpResponse} from "@angular/common/http";
import {DownloadUtils} from "../../../../utils/download-utils";
import {MessageUtils} from "../../../../utils/message-utils";
import {Tag} from "../../../../model/tag";
import {CategoryService} from "../../../../common/services/category.service";
import {Category} from "../../../../model/tree";
import {TreeService} from "../service/tree.service";
import { User } from "src/app/model/user";
import { TIPO_MESSAGGI } from "src/app/utils/enums";

@Component({
  selector: 'app-dettaglio-documento',
  templateUrl: './edit-documento.component.html',
  styleUrls: ['./edit-documento.component.scss']
})
export class EditDocumentoComponent implements OnInit, OnDestroy {
  title: string;
  utente: any;
  documento: DettaglioDocumento;
  tokenIdDocumento: string;
  workspaceId: number;
  tagsDocumento: Tag[];
  categoryNode: CategoryNode;
  categories: Category[];
  gruppoUtente: boolean = true;
  toolTipLabelGroup: string;
  gruppiNonDellutente: string[] = [];

  namingConvention: string; // todo chiamata backend da sviluppare

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
    categoria: [],
    autore: [null, [Validators.required, Validators.pattern(PATTERN_NAME)]],
    tipoDocumento: [null, [Validators.required]],
    titolo: [null, [Validators.required, Validators.pattern(PATTERN_DOCUMENT_NAME)]],
    descrizione: [null, [Validators.pattern(PATTERN_DESCRIPTION)]],
    // nomeDocumento: [null, [Validators.required]],
    file: this.fb.group({
      name: [],
      fileSource: [null, [ValidateFileType, ValidateFileName, ValidateFileSize]],
    }),
    stato: ['1', [Validators.required]], // valori  1 2
    visibilita: this.fb.group({ // valori 0 1 2
      value: ['',[Validators.required]],
      gruppi: [[]],
    }),
    tags: [[]],
    note: [null, [Validators.pattern(PATTERN_DESCRIPTION)]],
    notifica: [false, [Validators.required]],
  });

  constructor(
    private serviceCartelle: CategoryService,
    private documentoService: DocumentoService,
    private tipologicheService: TipologicheService,
    private activatedRoute: ActivatedRoute,
    private treeService: TreeService,
    private router: Router,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    private fb: FormBuilder,
  ) {
  }


  ngOnInit(): void {
    this.title = "Modifica documento";

    this.spinnerService.activeSpinner();

    this.activatedRoute.data.pipe(filter(data => data['workspaceId'] !== null)).subscribe(data => {
      console.warn("DATA WORKSPACE",data);
      this.workspaceId = data['workspaceId'];
    });
    this.getTree(this.workspaceId);

    this.activatedRoute.data.subscribe(data => {
      this.documento = data['documento'];
      this.tagsDocumento = Array.from(this.documento.tags);
      this.updateForm(this.documento);
      this.spinnerService.closeSpinner();
    });

    this.treeService.categoryNodeSubject.pipe(filter(category => category !== null),skip(1)).subscribe(category => {
      this.documentoForm.get(['categoria']).setValue(category.name);
      this.categoryNode = category;
    });

    this.getTipologiche();

    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.tokenIdDocumento = queryParams['t'];
    });

    this.utente = JSON.parse(localStorage.getItem('user')).denominazione;
    this.documentoForm.patchValue({
      autore: this.utente
    });

  }

  getTipologiche(): void {
    this.tipologicheService.getTipiDocumento().subscribe(resp => {
      this.tipiDocumentoTipologiche = resp.listObj;
      this.documentoForm.patchValue({
        tipoDocumento: this.tipiDocumentoTipologiche.filter(tipoDoc => tipoDoc.name == this.documento.documentType)[0]['token']
      });
    });

    this.tipologicheService.getListaTag().subscribe(resp => {
      this.tagsTipologiche = resp.listObj;
      this.filterTagInputChanges(); // necessario per i chips di tags
    });

    this.tipologicheService.getListaGruppi().subscribe(resp => {
      this.gruppiTipologiche = resp.listObj;
      this.filterGruppoInputChanges(); // necessario per i chips di gruppo
    });

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

  set gruppi(gruppi : GruppiSelectBean[]) {
    (this.visibilita.get(['gruppi']).value as GruppiSelectBean[]) = gruppi;
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
    console.log("[test gruppi list] SELECTED GROUP: ", event);
    let groupSelected = event.option.value as GruppiSelectBean;
    this.gruppi.push(groupSelected);

    const user: User = JSON.parse(localStorage.getItem('user'));

    if(user) {
      if(user.tokenIdUserGroups) {
        user.tokenIdUserGroups.forEach(g => {
          if(groupSelected.token !== g) {
            this.gruppiNonDellutente.push(groupSelected.name);
          } else {
            this.gruppiNonDellutente.splice(this.gruppiNonDellutente.indexOf((groupSelected.name),1));
          }
        });

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

  /**
   * gestione form
   */
  updateForm(documento: DettaglioDocumento) {
    console.warn("UPDATE FORM",documento);
    let tagsString: string[] = [];
    this.documento.tags.forEach(tag => tagsString.push(tag.tag));

    let visibilita = documento.visibilita;

    // FIX comportamento anomalo visibilita si comporta come stringa
    if (typeof documento.visibilita == 'string') {
      switch (documento.visibilita) {
        case 'Tutti gli utenti': visibilita = 0; break;
        case 'La mia organizzazione': visibilita = 1; break;
        case 'Gruppi': visibilita = 2; break;
      }
    }

    console.warn("visibilita documento form update", visibilita as number);

    this.documentoForm.patchValue({
      categoria: documento?.categoryName.toLocaleUpperCase(),
      autore: documento?.author,
      titolo: documento?.title,
      descrizione: documento?.description,
      // nomeDocumento: documento?.fileName,
      // file: '',
      // name: '',
      // stato: stato,
      // visibilita: visibilita,
      tags: tagsString,
      // note:,
      // notifica: documento
    });

    this.visibilita.patchValue({value: visibilita.toString()});

    if ( visibilita == 2 ){
      this.gruppi = Array.from(documento.listaGruppi);
    }

  }

  formToObject(): DocumentoForm {
    let toPublished: number;
    let published: number;
    console.warn("from to object", this.categoryNode)

    if (this.documentoForm.get(['stato'])!.value == '1') {
      toPublished = 0;
      published = 0;
    }  else {
      // stato di approvazione
      toPublished = 0;
      published = 1;
    }

    let category: Category[] = [];
    let cat = new Category();

    if(this.categoryNode) {
      cat.tokenCategoryId = this.categoryNode.tokenCategoryId;
      category.push(cat);
    } else {
      cat.tokenCategoryId = this.documento.categoryIdToken;
      category.push(cat);
    }

    console.warn('category',category)

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
      categoryIdToken: category[0].tokenCategoryId,
      gruppiToken: this.getTokens(this.visibilita.get(['gruppi'])!.value),
      categoryType: workspaceIdString
    };
  }

  /**
   * Azioni bottoni
   */
  save(): void {
    this.spinnerService.activeSpinner();
    const documentoForm = this.formToObject();
    console.warn('formToObject',this.formToObject());

    const file = this.file.get(['fileSource']).value;
    const workspaceId = this.workspaceId.toString();

    console.warn("DOCUMENTO FORM OBJECT: ",documentoForm);
    this.spinnerService.activeSpinner();
    this.documentoService.modificaDocumento(documentoForm, file).subscribe(
      resp => {
        console.warn("salva le modifiche", resp);
        if(resp.messaggio?.tipoMessaggio === TIPO_MESSAGGI.SUCCESS) {
          this.router.navigate([`../detail-documento`],{queryParams: {t: resp.obj}, relativeTo: this.activatedRoute}).then(() => {
            console.log("arrivato");
            this.spinnerService.closeSpinner();
            this.messageUtils.alertSuccess(resp.messaggio.messaggio);
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
        // this.messageUtils.alertError('Errore nella modifica del documento.');
      },
      () => this.spinnerService.closeSpinner()
    );
  }

  detailDocumento(): void {
    const tokenId: string = this.tokenIdDocumento ? this.tokenIdDocumento : '';
    this.spinnerService.activeSpinner();
    this.router.navigate(['../detail-documento'], {queryParams: {t: tokenId}, relativeTo: this.activatedRoute})
      .then(() => this.spinnerService.closeSpinner());
  }

  downloadDocumento(): void {
    const tokenId: string = this.tokenIdDocumento ? this.tokenIdDocumento : '';
    this.spinnerService.activeSpinner()
    this.documentoService.downloadAttachment(tokenId).subscribe(
      (resp: HttpResponse<any>) => {
        if(resp && resp.headers) {
          const headers = resp.headers;
          DownloadUtils.downloadAttachments(resp.body, headers.get('content-type'),headers.get('content-disposition'));
        }else this.messageUtils.alertError('Errore nel download del documento!')
      },
      (err) => {
        // this.messageUtils.alertError('Errore nel download del documento!')
        // this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    );
  }


  ngOnDestroy(): void {
  }

  /**
   * Metodi utili tree
   */
  getTree(workspaceId: number) {
    this.spinnerService.activeSpinner();
    this.serviceCartelle.getTree(workspaceId).subscribe(
      resp => {
        this.categories = resp.listObj;
      },
      (err) => {
        // console.error(err)
        // this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    );
  }

  clickNode(node: CategoryNode) {
    this.treeService.categoriaUpdate(node);
  }

}
