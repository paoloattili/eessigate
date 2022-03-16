export class Commento {
  message: string;
  author: string;
  creationDate: Date;
  tokenMessageId: string;
  tokenDocumentId: string;
}

export class CommentoForm {
  commentId: number;
  text: string;
  author: string;
  documentId: number;
  tokenId: string;
  tokenDocumentId: string;
}
