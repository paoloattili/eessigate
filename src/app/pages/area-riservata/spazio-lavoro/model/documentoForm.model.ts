export class DocumentoForm {
  title: string;
  description: string;
  author: string;
  uploadNote: string;
  reserved: number;
  toPublished: number; // bozza -> topub e pub = 0
  published: number;  // da approvare -> topub = 1 pub = 0  ; pubblicato -> topub = 1 pub = 1
  categoryIdToken: string;
  idDocumentTypeToken: string;
  documentIdToken: string;
  inviaNotifica: boolean;
  tags: string[];
  gruppiToken: string[];
  categoryType: string; // fix caricamento
}



export class RicercaAvanzataForm {
  author: string;
  organizationName: string;
  idTipoToken: string;
  tags: string[];
  stato: number;
  nomeStato: string;
  idWorkspace: number;
  organizationId: number;
  organizationIdToken: string;
  userId: string;
  categoryType: number;
}
