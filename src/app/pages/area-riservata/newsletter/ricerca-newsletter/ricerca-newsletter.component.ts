import { ActivatedRoute, Router } from "@angular/router";
import { NewsletterRicerca } from "./../model/newsletter-ricerca";
import { NewsletterForm } from "./../model/newsletter-form";
import {
  checkDateSystem,
  creatDateRangeValidator,
  creatDateRangeValidatorNewsletter,
  PATTERN_DESCRIPTION
} from "src/app/utils/utils.validator";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Injectable,
  LOCALE_ID,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { SpinnerService } from 'src/app/common/services/spinner.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import { NewsletterService } from '../service/newsletter.service';
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import * as _moment from 'moment';
import {Subject} from "rxjs";
import {filter} from "rxjs/operators";


@Injectable()
export class RicercaNewsletterParameters {
  newsletterForm: NewsletterForm;
  newsletterFormSubject = new Subject<NewsletterForm>();

  updateNewsletterForm(newsletterForm: NewsletterForm): void {
    this.newsletterForm = newsletterForm;
    this.newsletterFormSubject.next(newsletterForm);
  }

}


@Component({
  selector: 'app-ricerca-newsletter',
  templateUrl: './ricerca-newsletter.component.html',
  styleUrls: ['./ricerca-newsletter.component.scss']
})
export class RicercaNewsletterComponent implements OnInit {

  title = 'Ricerca Newsletter';
  risultatiRicerca: NewsletterRicerca[] = [];
  displayedColumns: string[] = ['sottotitolo', 'dataCreazione', 'sezioni', 'azioni'];
  dataSource: MatTableDataSource<NewsletterRicerca>;
  listaSezioniSelezionate: any[] = [];
  mostraNews = false;
  oggi = new Date();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: TemplateRef<any>;

  newsletterForm: FormGroup = this.fb.group({
    sottotitolo: [null, Validators.pattern(PATTERN_DESCRIPTION)],
    sezioni: [0],
    dataInizio: [null],
    dataFine: [null]
  },{
    validators: [creatDateRangeValidatorNewsletter()]
  });

  constructor(
    private service: NewsletterService,
    private ricercaNewsletterParameters :RicercaNewsletterParameters,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

    this.newsletterForm.get(['dataFine']).valueChanges.subscribe(()=> {
      console.warn("datafine valuechanges", this.newsletterForm.get(['dataFine']).value);
    })

    this.listaSezioniSelezionate = this.service.sezioni();

    this.activatedRoute.queryParams.subscribe( queryParams => {
      console.warn("queryparams",queryParams);
        if(queryParams['backToRicerca'] === "true" && this.ricercaNewsletterParameters.newsletterForm){
          this.updateForm(this.ricercaNewsletterParameters.newsletterForm);
          this.ricercaWithForm(this.ricercaNewsletterParameters.newsletterForm);
        }
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateForm(form: NewsletterForm): void {
    console.warn("update form", form);
    this.newsletterForm.patchValue({
      sottotitolo: form?.sottotitolo,
      sezioni: form?.sezioni?.length > 0? form?.sezioni[0] : null,
      dataInizio: (form?.fromDate),
      dataFine: (form?.toDate),
    });
  }

  formToObj(): NewsletterForm{

    (this.newsletterForm.get(['dataInizio']).value?._d as Date)?.setHours(0,0,0);
    (this.newsletterForm.get(['dataFine']).value?._d as Date)?.setHours(23,59,59);

    return {
      ...new NewsletterForm(),
      sottotitolo: this.newsletterForm.get(['sottotitolo']).value,
      sezioni: this.newsletterForm.get(['sezioni']).value === 0 ? null :[this.newsletterForm.get(['sezioni']).value],
      fromDate: this.newsletterForm.get(['dataInizio']).value,
      toDate: this.newsletterForm.get(['dataFine']).value,
    }
  }

  resetDate(): void {
    this.newsletterForm.patchValue({
      sottotitolo: null,
      fromDate: null,
      toDate: null,
    });
  }

  ricerca(){
    const form = this.formToObj();
    this.ricercaNewsletterParameters.updateNewsletterForm(form);
    this.ricercaWithForm(form);
  }

  ricercaWithForm(form: NewsletterForm): void {
    this.spinnerService.activeSpinner();
    this.service.ricerca(form).subscribe(
      resp => {
        if(resp && resp.listObj && resp.listObj.length > 0) {
          console.warn('resp.listObj',resp.listObj);
          this.mostraNews = true;
          this.risultatiRicerca = resp.listObj;
          this.dataSource = new MatTableDataSource(resp.listObj);
          this.cdr.detectChanges();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          if(resp && !resp.messaggio) {
            this.risultatiRicerca = [];
            this.messageUtils.alertSuccess('Nessun risultato trovato');
          }
        }
      },
      (err) => {
        // this.spinnerService.closeSpinner()
        // this.messageUtils.alertError('Errore nella ricerca delle newsletter');
        // console.error(err);
      },
      () => this.spinnerService.closeSpinner()
    )
  }


  goToDetail(token: string) {
    if(token) {
      this.router.navigate(['../dettaglio'],{queryParams: {t: token}, relativeTo: this.activatedRoute});
    } else this.messageUtils.alertError('Non è possibile visualizzare il dettaglio della newsletter');
  }


  backToRicerca() {
    this.mostraNews = false;
  }

}
