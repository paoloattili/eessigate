import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {GruppiSelectBean, OrganizzazioneLiteBean, TipoDocumentoBean} from "../../model/tipologiche.model";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {observable} from "rxjs";
import {MatChipInputEvent} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {TipologicheService} from "../../../../../common/services/tipologiche.service";
import {DocumentoService} from "../../service/documento.service";
import {RicercaAvanzataForm} from "../../model/documentoForm.model";
import {ActivatedRoute} from "@angular/router";
import {DocumentiWorkspace} from "../../../../../model/documenti-workspace";
import {TreeService} from "../../service/tree.service";
import { Observable } from 'rxjs-compat';
import { MessageUtils } from "../../../../../utils/message-utils";
import { SpinnerService } from "../../../../../common/services/spinner.service";

@Component({
  selector: 'app-ricerca',
  templateUrl: './ricerca.component.html',
  styleUrls: ['./ricerca.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RicercaComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  workspaceId: number;

  tipiDocumentoTipologiche: TipoDocumentoBean[];
  filteredTipiDocumento: Observable<TipoDocumentoBean[]>;

  listaOrganizzazione: OrganizzazioneLiteBean[];

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  filteredTags: Observable<string[]>;
  tagsInputControl = new FormControl();
  tagsTipologiche: string[];

  listaAutori: { autore: string }[];

  searchForm: FormGroup =  this.fb.group({
    autore: [],
    organizzazione: [],
    tipoDocumento: [],
    statoDocumento: ['0'],
    tags: [[]],
    deliverable: [],
  });

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private tipologicheService: TipologicheService,
    private documentoService: DocumentoService,
    private treeService: TreeService,
    private messageUtils: MessageUtils,
    private spinnerService: SpinnerService
  ) {
  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe(data => {
      this.workspaceId = data['workspaceId'];
      console.warn("WORKSPACE ID",this.workspaceId);
    });

    this.getTipologiche();
  }

  search(): void {
    this.spinnerService.activeSpinner();
    const ricercaAvanzataForm = {
      ... new RicercaAvanzataForm(),
      author: this.searchForm.get(['autore'])?.value,  // api documenti-lista-autore
      categoryType: this.workspaceId, // workspace id
      idTipoToken: this.getSelectValue(this.searchForm.get(['tipoDocumento'])?.value),
      tags: this.searchForm.get(['tags'])?.value,
      stato: this.searchForm.get(['statoDocumento'])?.value, // 1 pubblicato - 0 bozza
      idWorkspace: this.workspaceId,
      organizationIdToken: this.getSelectValue(this.searchForm.get(['organizzazione'])?.value),
    }
    console.warn("RICERCA NON ANCORA ESEGUITA:", ricercaAvanzataForm);
    this.documentoService.ricercaListaDocWorkspace(ricercaAvanzataForm).subscribe( resp => {
        console.warn("RICERCA ESEGUITA:", resp);
        if(resp.listObj && resp.listObj.length === 0)
          this.messageUtils.alertSuccess('Nessun documento trovato');

        this.treeService.documentiListSubject.next(resp.listObj);
      },
      (err) => {
        // this.messageUtils.alertError('Errore nel recupero dei documenti')
        // this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    );
  }

  reset(): void {
    this.searchForm.patchValue({
      autore: null,
      organizzazione: null,
      tipoDocumento: null,
      statoDocumento: '0',
      tags: [],
      deliverable: null,
    });
  }

  getTipologiche() {
    Observable.forkJoin([
      this.tipologicheService.getTipiDocumento(),
      this.tipologicheService.getListaTag(),
      this.tipologicheService.getListaOrganizzazioni(),
      this.documentoService.listaAutori()
    ]).subscribe(
      (resp: any) => {
        console.warn("TIPO DOCUMENTO",resp[0]);
        this.tipiDocumentoTipologiche = resp[0]? resp[0].listObj: null;
        console.warn("LISTA TAG",resp[1]);
        this.tagsTipologiche = resp[1]? resp[1].listObj: null;
        this.filterTagInputChanges();
        console.warn("LISTA ORGANIZZAZIONE",resp[2]);
        this.listaOrganizzazione = resp[2]? resp[2].listObj: null;
        console.warn("Lista autori",resp[3]);
        this.listaAutori = resp[3]? resp[3].listObj: null;
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

  get tags(): string[] {
    return this.searchForm.get(['tags']).value as string[];
  }

  set tags(t: string[]) {
    this.searchForm.get(['tags']).setValue(t);
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

  getSelectValue(obj: any) {
    if(obj) {
      const objToString = obj.toString();

      if(objToString === '0') return null;
      else return obj;

    } else {
      return null;
    }
  }

}
