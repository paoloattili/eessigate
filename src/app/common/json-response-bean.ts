import { ExceptionOBJ } from './exception-obj';
import { MessaggioBean } from './messaggio-bean';

export class JsonResponseBean<T extends any> {
    messaggio: MessaggioBean;
    obj: T;
    listObj: T[];
    mapObj: Map<any, any>;
    // tokenUtente: string;
    redirectPath: string;
    backUrl: string;
    exception: ExceptionOBJ;
}
