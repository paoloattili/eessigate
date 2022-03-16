

// Si trovano i diversi model che vengono utilizzati sul api service-desk

import {Commento, CommentoForm} from "../../../../model/commento";

export class TicketDettaglioBean {
  // idTicket: number;
  idRemedy: string;
  title: string;
  stato: number
  dataApertura: Date;
  dataChiusura: Date;
  dataRisoluzione: Date;
  esito: string;
  settore: string;
  buc: string;
  impatto: string;
  urgenza: string;
  gruppi: string;
  messaggi: Array<MessaggioBean>;
  allegati: Array<TicketFileBean>;
  token: string;
}

export class TicketManageBean {
  idTicket: number;
  title: string;
  idStato: number;
  idRemedy: string;
  ticketOwner: string;
  dataApertura: Date;
  dataChiusura: Date;
  dataRisoluzione: Date;
  gruppi: string;
  token: string;
}

export class TicketMyRequestBean {
  idTicket: number;
  title: string;
  idStato: number;
  idRemedy: string;
  dataApertura: Date;
  dataChiusura: Date;
  dataRisoluzione: Date;
  token: string;
}

export class TicketInserimentoForm {
  idTicket: number;
  title: string;
  sommario: string;
  descrizione: string;
  urgenza: number;
  impatto: number;
  idUser: string;
  dataApertura: Date;
  dataRisoluzione: Date;
  idStato: number;
  esito: string;
  note: string;
  dataChiusura: Date;
  idUserChiusura: string;
  idUserRisoluzione: string;
  idUserApertura: string;
  idOrganization: string;
  idSettore: string;
  idBuc: string;
  idArgomento: number;

}


export class TicketFileBean {
  idTicketBlob: number;
  fileName: string;
  contentType: string;
  idTicket: number;
  tokenFile: string;
  tokenTicket: string;
}

export class MessaggioBean {
  idConversazione: number;
  idTicket: number;
  dataInvio: Date;
  messaggio: string;
  nominativo: string;
  userId: string;
  tokenMessaggio: string;
  tokenTicket: string;


  public static convertToCommento(messaggioBean: MessaggioBean): Commento {
    return {
      ... new Commento(),
      message: messaggioBean.messaggio,
      author: messaggioBean.nominativo,
      creationDate: messaggioBean.dataInvio,
      tokenMessageId: messaggioBean.tokenMessaggio,
      tokenDocumentId: messaggioBean.tokenTicket
    }
  }

  public static commentoFormToMessaggioBean(commentoForm: CommentoForm): MessaggioBean {
    return {
      ... new MessaggioBean(),
      messaggio: commentoForm.text,
    }
  }
}

export class BUCBean {
  idBuc: number;
  descrizione: string;

}

export class SettoreArgomentoBean {
  idSettore: number;
  descrizione: string;
  idArgomento: number;
  descrzioneArgomento: string;
  token: string;
}


export class ArgomentoHelpDesk {
  idArgomento: number;
  descrizione: string;
}

export class SettoreTicketBean {
  idSettore: number;
  descrizione: string;
  token: string;
}

export class Impatto {
  idImpatto: number;
  descrizioneImpatto: string;
  toiken: string;
}

export class Urgenza {
  idUrgenza: number;
  descrizioneUrgenza: string;
  token: string;
}
