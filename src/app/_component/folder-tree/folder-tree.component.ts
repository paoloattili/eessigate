import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { TreeFolder } from 'src/app/_viewmodel/tree-folder';

/** Flat node with expandable and level information */
// TODO: Esternalizzare
interface TreeElement<T extends any> {
  expandable: boolean;
  element: T;
  level: number;
}

@Component({
  selector: 'app-folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.css']
})
export class FolderTreeComponent implements OnInit {

  treeControl = new FlatTreeControl<TreeElement<TreeFolder>>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  @Input() folders: TreeFolder[] = [];
  @Output() onSelectedFolder: EventEmitter<TreeFolder> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.dataSource.data = this.folders;
  }

  _onSelectedFolder(selectedFolder: TreeFolder) {
    this.onSelectedFolder.emit(selectedFolder);
  }

  public hasChild(_: number, node: TreeElement<TreeFolder>) {
    return node.expandable;
  }

  private transformer(node: TreeFolder, level: number): TreeElement<TreeFolder> {
    return {
      expandable: !!node.children && node.children.length > 0,
      element: node,
      level: level,
    };
  }

}
