import { ContentBlobAllegati } from "./content-blob-allegati";
import { ContentBlobGallery } from "./content-blob-gallery";
export class DettaglioContenuto {
	titolo: string;
	sottotitolo: string;
	body: string;
	sommario: string;
	immagine: string;
	nomeImmagine: string;
	wfNote: string;
	tokenId: string;
	tokenIdContentType: string;
	contentType: string;
	tuttiGliUtenti: boolean;
	allegati: ContentBlobAllegati[];
	galleria: ContentBlobGallery[];
	destinatariUtenti: string[];
	destinatariRuoliToken: string[];
	destinatariGruppiToken: string[];
}
