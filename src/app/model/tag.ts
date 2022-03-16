export class Tag {
    tag: string;
	tokenDocumentId: string;
  constructor(tag?: string, tokenDocumentId?: string) {
    this.tag = tag;
    this.tokenDocumentId = tokenDocumentId;
  }
}
