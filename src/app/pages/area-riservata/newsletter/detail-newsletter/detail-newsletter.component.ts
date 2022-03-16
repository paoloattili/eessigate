import { ViewChild } from "@angular/core";
import { Constants } from "src/app/utils/constants";
import { environment } from "src/environments/environment";
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from 'src/app/common/services/spinner.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import { DettaglioNewsletterBean } from '../model/newsletter.model';
import { NewsletterService } from '../service/newsletter.service';
import { DocumentoTemplateObj, EventoTemplateObj, NewsTemplateObj } from "../model/newsletter-template";

@Component({
  selector: 'app-detail-newsletter',
  templateUrl: './detail-newsletter.component.html',
  styleUrls: ['./detail-newsletter.component.scss']
})
export class DetailNewsletterComponent implements OnInit {

  title="Dettaglio Newsletter";
  dettaglio: DettaglioNewsletterBean;
  sezioni: any[];

  @ViewChild('bodyNewletter') bodyNewsletter: TemplateRef<any>;

  argomentiDocumento: DocumentoTemplateObj[] = [];
  argomentiNews: NewsTemplateObj[] = [];
  argomentiNewsEsterne: NewsTemplateObj[] = [];
  argomentiEventi: EventoTemplateObj[] = [];

  constructor(
    private service: NewsletterService,
    private spinnerService: SpinnerService,
    private messageutils: MessageUtils,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      console.warn("DATA detail newsletter", data);
      this.dettaglio = data['newsletter'];

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


      this.spinnerService.closeSpinner();
    });
  }

  backToRicerca() {
    this.router.navigate(['../ricerca'],{ queryParams: { backToRicerca: true }, relativeTo: this.activatedRoute});
  }

}
