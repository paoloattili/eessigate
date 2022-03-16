export class NuovoContenutoForm {
	titolo: string;
	sottotitolo: string;
	body: string;
	sommario: string;
	tokenId: string;
	tokenIdTipoContent: string;
	daPubblicare: boolean;
	tuttiGliUtenti: boolean;
	destinatariUtenti: string[] = [];
	tokenDestinatariGruppi: string[] = [];
	tokenDestinatariRuoli: string[] = [];
}
