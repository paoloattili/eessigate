import { DettaglioNewsletterBean } from "./../model/newsletter.model";
import { MessageUtils } from "./../../../../utils/message-utils";
import { SpinnerService } from "./../../../../common/services/spinner.service";
import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {NewsletterService} from "../service/newsletter.service";
import {DomSanitizer} from "@angular/platform-browser";
import { DocumentoTemplateObj, EventoTemplateObj, NewsTemplateObj } from "../model/newsletter-template";

@Component({
  selector: 'app-visualizza-newsletter',
  templateUrl: './visualizza-newsletter.component.html',
  styleUrls: ['./visualizza-newsletter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VisualizzaNewsletterComponent implements OnInit {

  title = "Visualizza Newsletter";
  elencoNewsletter: DettaglioNewsletterBean[];
  indiceNewsletterPicture: number;

  dettaglio: DettaglioNewsletterBean;
  sezioni: any[];

  @ViewChild('bodyNewletter') bodyNewsletter: TemplateRef<any>;

  argomentiDocumento: DocumentoTemplateObj[] = [];
  argomentiNews: NewsTemplateObj[] = [];
  argomentiNewsEsterne: NewsTemplateObj[] = [];
  argomentiEventi: EventoTemplateObj[] = [];

  constructor(
    private _sanitizer: DomSanitizer,
    private newsletterService: NewsletterService,
    private spinnerService: SpinnerService,
    private messageUtils: MessageUtils
  ) { }

  ngOnInit(): void {
    this.spinnerService.activeSpinner();
    this.newsletterService.elencoNewsletter().subscribe(resp => {
        console.warn("NEWSLETTER RESP: ",resp);
        this.elencoNewsletter = resp.listObj;
      },
      (err) => {
        // console.error(err);
        // this.spinnerService.closeSpinner()
        // this.messageUtils.alertError('Errore nel recupero delle newsletter');
      },
      () => this.spinnerService.closeSpinner()
    );
  }

  showBody(i: number): void {
    this.dettaglio = this.elencoNewsletter[i];

    console.warn('this.dettaglio',this.dettaglio);

    if(this.dettaglio?.newsList) {
      this.argomentiNews = this.dettaglio.newsList;
      console.warn('this.argomentiNews',this.argomentiNews);
    }

    if(this.dettaglio?.newsEsterneList) {
      this.argomentiNewsEsterne = this.dettaglio.newsEsterneList;
    }

    if(this.dettaglio?.docList) {
      this.argomentiDocumento = this.dettaglio.docList;
    }

    if(this.dettaglio?.eventiList) {
      this.argomentiEventi = this.dettaglio.eventiList;
    }

    if(this.dettaglio?.sezioni) {
      this.sezioni = this.dettaglio?.sezioni.split(',');
    }
  }

}
