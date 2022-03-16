import { DocumentiGruppo } from "./documenti-gruppo";
import { Tag } from "./tag";
import { Commento } from "./commento";
import { Like } from "./like";
import {GruppiSelectBean} from "../pages/area-riservata/spazio-lavoro/model/tipologiche.model";
export class DettaglioDocumento {

	title: string;
	description?: string;
	documentType: string;
	creationDate: Date;
	categoryType: number;
	lastModified?: Date;
	categoryName: string;
	organizzazione: string;
	organizationToken: string;
	categoryIdToken: string;
	tokenTreeMap: string;
	fileName: string;
	author: string;
	visibilita: number;
	toPublish: number;
	published: number;
	uploader: string;
	countLike?: number;
	likes?: Set<Like> = new Set<Like>();
	countCommenti?: number;
	comments?: Commento[] = [];
	tags?: Set<Tag> = new Set<Tag>();
	listaGruppi?: Set<GruppiSelectBean> = new Set<GruppiSelectBean>();
	token: string;
}
