import { NestedTreeControl } from '@angular/cdk/tree';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Injectable,
  AfterViewChecked,
  ViewChild,
  OnDestroy, OnChanges, SimpleChanges, QueryList, ElementRef, ViewChildren
} from "@angular/core";
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Category } from 'src/app/model/tree';
import {Subject, Subscription} from "rxjs";
import { CategoryNode } from "src/app/class/category-node";

@Injectable()
export class FilterTree {

  dataChange = new Subject<CategoryNode[]>();

  constructor(){}

  filter(filterText: string, categoryNodes: CategoryNode[]) {
    let filteredTreeData: CategoryNode[];

    if (filterText) {
      filteredTreeData = this.filterNodes(categoryNodes,filterText);
    } else {
      filteredTreeData = categoryNodes;
    }

    this.dataChange.next(filteredTreeData);
  }

  filterNodes(categoryNodes: CategoryNode[], filterText: string) : CategoryNode[] {
    return categoryNodes.filter(function fn(cn){
      if(cn.children){
        cn.children = cn.children.filter(fn);
        if(cn.children.length >= 1){
          return true;
        }
      }

      if (cn.name.toLocaleLowerCase().includes(filterText.toLocaleLowerCase())) return true;

      }
    );
  };


}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  providers: [FilterTree],
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  @Input() filterEnable: boolean = true;
  subscriptions: Subscription[] =[];

  categoryNodes: CategoryNode[] = [];
  treeControl = new NestedTreeControl<CategoryNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<CategoryNode>();
  expanded: boolean;

  elementoScelto: HTMLElement;

  @Input() categoryType: number;
  @Input() categories: Category[];
  @Output() clickNode: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('tree') tree;

  @ViewChildren("elReference") elReference: QueryList<ElementRef>;

  constructor(
    private treeFilter: FilterTree,
  ) { }

  ngAfterViewChecked(): void {
    if(this.categoryNodes.length === 0 && this.categories != null){
      this.categoryNodes = this.generateNodes(this.categories);
      this.dataSource.data = JSON.parse(JSON.stringify(this.categoryNodes));
      this.treeControl.dataNodes = this.dataSource.data;
    }

  }

  ngOnInit(): void {
    this.subscriptions.push(this.treeFilter.dataChange.subscribe(data => {
      this.dataSource.data = JSON.parse(JSON.stringify(data));
      this.treeControl.dataNodes = this.dataSource.data;
      this.treeControl.expandAll();
    }));
  }

  ngOnChanges(changes: SimpleChanges) {

    if( changes.categories?.previousValue !== changes.categories?.currentValue) {
        this.categoryNodes = this.generateNodes(this.categories);
        this.dataSource.data = JSON.parse(JSON.stringify(this.categoryNodes));
        this.treeControl.dataNodes = this.dataSource.data;
    }
  }

  private generateNodes(categories: Category[] = this.categories): CategoryNode[] {
    let nodes: CategoryNode[] = [];
    categories.forEach((c) => {
      nodes.push(this.generateNode(c));
    });
    return nodes;
  }

  generateNode(c: Category): CategoryNode {
    let node: CategoryNode = new CategoryNode();
    node.tokenCategoryId = c.tokenCategoryId;
    node.name = c.name? c.name.toUpperCase() : '';
    node.countDocument = c.countDocument;
    node.treeMapFolderName = c.treeMapFolderName;
    node.treeMap = c.tokenTreeMap;
    node.description = c.description;
    if (c.childCategories && c.childCategories.length > 0) {
      node.children = this.generateNodes(c.childCategories);
    }
    return node;
  }

  hasChild = (_: number, node: CategoryNode) => !!node.children && node.children.length > 0;

  onSelectFolder = (node, element?: HTMLElement) => {

    console.warn("element",element);

    if (this.elementoScelto) {
      this.elementoScelto.classList.toggle("selected-node");
    }
    this.elementoScelto = element;
    this.elementoScelto.classList.toggle("selected-node");
    this.clickNode.emit(node);
  }

  filterChanged(filterText: string) {
    this.treeFilter.filter(filterText, JSON.parse(JSON.stringify(this.categoryNodes)));
  }

  apriTutto() {
    this.expanded = true;
    this.treeControl.expandAll();
  }

  chiudiTutto() {
    this.expanded = false;
    this.treeControl.collapseAll();
  }

  ngOnDestroy(){
    if (this.subscriptions.length > 0) {
      for ( let sub of this.subscriptions ){
        sub.unsubscribe();
      }
    }
  }

}
