export class EventPlanningBean {
  eventId: number;
  title: string;
  startDate: string; // Date
  endDate: string; // Date
  closingDate: string; // Date
  color: string;
  typeName: string;
  token: string;
  tokenType: string;
}

export class EventoForm {
  tokenId?: string;
  // eventId: number;
  title: string; //*
  tokenTypeId: string;
  body: string; //* informazioni facoltative
  tokenCategoryId: string;

  tokenLocationId: string;
  luogoForm: LuogoForm;

  startDate: string; //*
  endDate: string; //*
  allDay: boolean; //*
  closingDate: string; //*

  tokenTargetAudience: string;
  gruppiToken: string[];
}

export class LuogoForm {
  // eventLocationId: number;
  name: string;
  address: string;
  streetNumber: string;
  city: string;
  province: string;
  state: string;
  postalCode: string;
  creationDate: Date;
  tokenId: string;
  invitedBy?: string;
}


export class EventiDettaglioBean {
  tokenEventId: string;

  title: string;
  tokenTypeId: string;
  body: string; // blob
  tokenCategoryId: string;
  categoryToken: string;

  tokenLocationId: string;
  name: string;
  address: string;
  streetNumber: string;
  city: string;
  province: string;
  postalCode: string;
  state: string;

  startDate: string; // date
  endDate: string; // date
  allDay: boolean; //*
  closingDate: string; // date

  tokenTargetAudience: string;
  utentiInvitati: EventUserBean[];
  gruppiInvitati: EventoGruppoBean[];

  invitedBy?: string;

}

export class SchedaEventiBean {
  //eventId: number;
  title: string;
  body: string; //byte[]
  startDate: string; //Date
  endDate: string; //Date
  closingDate: string; //Date
//	Boolean allDay;
  typeId: string;
//	myChoice: string;
//	boolean my;
  location: string;
  closed: boolean;
  invitati: InvitatiBean;
  documenti: EventDocumentBean[];
  token: string;
  choiceId: number;
  userId: string;
}

export class InvitatiBean {
  countUtentiInvitati: number;
  countGruppiInvitati: number;
  countPartecipanti: number;
  countInDubbio: number;
  countNonPartecipanti: number;
  countInAttesa: number;

  utentiInvitati: EventUserBean[];
  gruppiInvitati: EventoGruppoBean[];

  partecipanti: Set<EventUserBean>;
  idDubbio: Set<EventUserBean>;
  nonPartecipanti: Set<EventUserBean>;
  inAttesa: Set<EventUserBean>;
}

export class EventDocumentBean {
  documentId: number;
  title: string;
  fileName: string;
  token: string;
}


export class EventUserBean {
  token: string;
  userId: string;
  nominativo: string;
  nome: string;
  cognome: string;
  organizationName: string;
  email: string;
  choice: string;
}

export class DestinatariBean {
  name: string;
  // active: boolean;
  token: string;
}


export class EventoGruppoBean {
  // groupId: number;
  nome: string;
  token: string;
}

