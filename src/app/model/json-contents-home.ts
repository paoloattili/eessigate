import { ContentHomeBean } from './content-home-bean';

export class JsonContentsHome {
    descTipo: string;
    // TODO: Provare a piazzarla sotto al titolo
    sottoSezione: string;
    // TODO: Mappare colori con codici HTML
    color: string;
    listaContenutiHome: ContentHomeBean[];
}
