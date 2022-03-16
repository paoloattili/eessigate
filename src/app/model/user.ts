import { RUOLI } from "./../utils/enums";
import { Role } from "./role";

export class User {
  userId: string;
	nome: string;
	cognome: string;
	idOrganizzazione: number;
	attivo: boolean;
	mailSubscribe: number;
	codiceFiscale: string;
	matricola?: string;
    ruoli: Role[];
    lastLoginDate: Date;
	idUserGroups: number[];
	tokenIdUserGroups: string[];
	authToken: string;
	accessType: string;
	sessionId: string;
    denominazione: string;

	//ruoli
	amministratore: boolean;
	contentManager: boolean;
	coordinator: boolean;
	eessieventManager: boolean;
	eessimember: boolean;
	eessimemberPlus: boolean;
	enabled: boolean;
	helpDesk: boolean;
	ngExpert: boolean;
	ngPatner: boolean;
	supervisorCE: boolean;
  rinaHandover: boolean;
  rinaHandoverplus: boolean;
}
