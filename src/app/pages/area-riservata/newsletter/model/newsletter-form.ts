import { DocumentoTemplateObj, EventoTemplateObj, NewsTemplateObj } from "./newsletter-template";

export class NewsletterForm {
	sottotitolo: string;
	// bodyNewsletter: string;
	fromDate: Date;
	toDate: Date;
	sezioni: string[];
	tuttiGliUtenti: boolean;
	destinatariUtenti: string[];
	tokenDestinatariGruppi: string[];
	tokenDestinatariRuoli: string[];
	newsList: NewsTemplateObj[] = [];
	newsEsterneList: NewsTemplateObj[] = [];
	docList: DocumentoTemplateObj[] = [];
	eventiList: EventoTemplateObj[] = [];
}
