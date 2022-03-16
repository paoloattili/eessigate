export class TipoDocumentoBean {
  // idDocumentType: number;
  name: string;
  token: string;
}

export class GruppiSelectBean {
  // groupId: number;
  name: string;
  token: string;
}

export class OrganizzazioneLiteBean {
  organizationId: number;
  name: string;
  descrizione: string;
  token: string;
}

export class EventTypePlanningBean {
  // eventTypeId: number;
  name: string;
  color: string;
  categoryToken: string;
  // eventi: EventPlanningBean[];
  token: string;
}


export class EventLocationBean {

  eventLocationId: number;
  name: string;
  address: string;
  streetNumber: string;
  city: string;
  province: string;
  state: string;
  postalCode: string;
  creationDate: Date;
  token: string;

}


