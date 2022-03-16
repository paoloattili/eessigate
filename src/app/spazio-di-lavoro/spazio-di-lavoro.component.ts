import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DocumentState } from '../_enum/document-state';
import { DocumentVisibility } from '../_enum/document-visibility';
import { Document } from '../_viewmodel/document';
import { TreeFolder } from '../_viewmodel/tree-folder';

@Component({
  selector: 'app-spazio-di-lavoro',
  templateUrl: './spazio-di-lavoro.component.html',
  styleUrls: ['./spazio-di-lavoro.component.css']
})
export class SpazioDiLavoroComponent implements OnInit, AfterViewInit {

  selectedFolder: TreeFolder;
  fcAuthorAC: FormControl = new FormControl();
  searchFilterValues: any = {};
  displayedColumns: string[] = [ 'title', 'folderName', 'type', 'author', 'visibility', 'state', 'actions' ];
  dataSource: MatTableDataSource<Document> = new MatTableDataSource();
  folders: TreeFolder[] = [
    {
      name: 'Documenti',
      numDocuments: 25,
      children: [
        {
          name: 'Specifiche',
          numDocuments: 10
        },
        {
          name: 'Pratiche Legali'
        }
      ]
    }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() {
    this.dataSource.data = [
      {
        title: 'Verbale 1999',
        folderName: 'Verbali',
        type: 'Documenti',
        author: 'Leonardo Baioni',
        visibility: DocumentVisibility.ALL,
        state: DocumentState.UFFICIALE
      },
      {
        title: 'Procedura legale 1900',
        folderName: 'Procedure legali',
        type: 'Documenti',
        author: 'Leonardo Baioni',
        visibility: DocumentVisibility.ORGANIZZAZIONE,
        state: DocumentState.UFFICIALE
      },
      {
        title: 'Specifiche progetto "EESSIGate"',
        folderName: 'Specifiche',
        type: 'Documenti',
        author: 'Leonardo Baioni',
        visibility: DocumentVisibility.ALL,
        state: DocumentState.BOZZA
      }
    ];
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDocumentsAmount(): number {
    return this.selectedFolder ? this.selectedFolder.numDocuments : 0;
  }

  onSelectedFolder(selectedFolder: TreeFolder): void {
    this.selectedFolder = selectedFolder;
  }

}
