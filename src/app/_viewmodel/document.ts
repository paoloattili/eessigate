import { DocumentState } from "../_enum/document-state";
import { DocumentVisibility } from "../_enum/document-visibility";

export class Document {
    id?: number;
    title?: string;
    folderName?: string;
    type?: string;
    author?: string;
    visibility?: DocumentVisibility;
    state?: DocumentState;
}
