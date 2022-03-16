import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {CategoryNode} from "../../../../class/category-node";
import {DocumentiWorkspace} from "../../../../model/documenti-workspace";


@Injectable()
export class TreeService {
  categoryNodeSubject: BehaviorSubject<CategoryNode> = new BehaviorSubject<CategoryNode>(new CategoryNode());
  categoryTreeMapSubject: Subject<string> = new Subject<string>();

  documentiListSubject: Subject<DocumentiWorkspace[]> = new Subject<DocumentiWorkspace[]>()

  constructor() { }

  public categoriaUpdate(categoria: CategoryNode): void {
    console.warn("categoriaUpdate",categoria);
    this.categoryNodeSubject.next({...categoria, children: []});
    this.categoryTreeMapSubject.next(categoria.treeMap);
  }

  public documentiUpdate(documenti : DocumentiWorkspace[]): void {
    this.documentiListSubject.next(documenti);
  }

}
