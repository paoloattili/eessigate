import {SpinnerService} from "../../../../common/services/spinner.service";
import {Category} from "src/app/model/tree";
import {CategoryNode} from "../../../../class/category-node";
import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {CategoryService} from "src/app/common/services/category.service";
import {TreeService} from "../service/tree.service";
import {Location, LocationChangeListener} from "@angular/common";

@Component({
  selector: 'app-spazio-lavoro',
  templateUrl: './spazio-lavoro.component.html',
  styleUrls: ['./spazio-lavoro.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpazioLavoroComponent implements OnInit {
  title = 'Area Di Lavoro';

  lastPath: string; // disabilita componente ricerca su new document
  enableRicercaComponent: boolean;

  workspaceId: number;
  categories: Category[] = [];

  constructor(
    private serviceCartelle: CategoryService,
    private spinnerService: SpinnerService,
    private treeService: TreeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.workspaceId = data['workspaceId'];
      this.getTree(this.workspaceId);
    });

    this.lastPath = this.location.path().split('/').slice(-1)[0];
    this.enableRicercaComponent = this.lastPath !== 'new-documento';

    this.router.events.subscribe(events => {
      this.lastPath = this.router.url.split('/').slice(-1)[0];
      this.enableRicercaComponent = this.lastPath !== 'new-documento';
    });

  }

  clickNode(node: CategoryNode) {
    this.treeService.categoriaUpdate(node);
  }

  takeNameFolder(node: CategoryNode) {
    const spanFolderName = document.querySelector('.folder-name');
    if (spanFolderName) {
      spanFolderName.innerHTML = node.treeMapFolderName ? node.treeMapFolderName.toUpperCase() : '';
    }
  }

  getTree(workspaceId: number) {
    this.spinnerService.activeSpinner();
    this.serviceCartelle.getTree(workspaceId).subscribe(
      resp => {
        this.categories = resp.listObj;
      },
      (err) => {
        // console.error(err)
        // this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    );
  }

  listaDocumentiEmitter(event: any): void {
    this.treeService.documentiUpdate(event);
  }

}
