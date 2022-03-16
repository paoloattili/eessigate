export class ArgomentiNewsletterForm {
	dataInizio: Date;
	dataFine: Date;
	sezioni: number[];
}

export class NewsletterTemplate {
    token: string;
	nominativo?: string;
	titolo?: string;
	sommario?: string;
	dataInserimento: Date;
	contentType?: string;
	title?: string;
	documentType?: string;
	categoryType?: string;
	creationDate?: Date;
	author?: string;
	countCommenti?: number;
	uploader?: string; 
	startDate?: Date;
	endDate?: Date;
	closingDate?: Date;
	typeId?: string;
	name?: string;
	address?: string;
	streetNumber?: string;
	city?: string;
	province?: string;
	state?: string;
	postalCode?: string;

	get location() {
		return this.name + ', ' + this.address + ' ' + this.streetNumber + ' - ' + this.city + ' ' + this.postalCode + ' ('+ this.province +') ' + this.state;
	}
}

export class NewsTemplateObj {
	author: string;
	dataPubblicazione: Date;
	titolo: string;
	sommario: string;
	token: string;
}

export class DocumentoTemplateObj{
	author: string;
	creationDate: Date;
	titolo: string;
	token: string;
	countCommenti: number;
	documentType: string;
	categoryType: string;
}

export class EventoTemplateObj {
	titolo: string;
	dataInizio: Date;
	dataFine: Date;
	dataChiusura: Date;
	labelLocation: string;
	token: string;
}