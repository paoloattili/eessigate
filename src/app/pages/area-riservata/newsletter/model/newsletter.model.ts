import { DocumentoTemplateObj, EventoTemplateObj, NewsTemplateObj } from "./newsletter-template";

export class DettaglioNewsletterBean {
  sottotitolo: string;
  creationDate: Date;
  fromDate: Date;
  toDate: Date;
  sezioni: string;
  newsList: NewsTemplateObj[] = [];
	newsEsterneList: NewsTemplateObj[] = [];
	docList: DocumentoTemplateObj[] = [];
	eventiList: EventoTemplateObj[] = [];
  token: string;
}




