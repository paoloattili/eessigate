import { ContentBlobAllegati } from "./content-blob-allegati";
import { ContentBlobGallery } from "./content-blob-gallery";

export class ContentPreview {
	nominativo: string;
	titolo: string;
	sottotitolo: string;
	sommario: string;
	body: string;
	dataModifica: string;
	contentType: string;
	image: string;
	imageFileName: string;
	stato: number;
	attachments: ContentBlobAllegati[];
	gallery: ContentBlobGallery[];
	token: string;
	tokenCrypt: string;
}
