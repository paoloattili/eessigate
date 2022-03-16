import { User } from "src/app/model/user";
import { HttpResponse } from "@angular/common/http";
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DocumentiWorkspace} from "../../../../model/documenti-workspace";
import {Constants} from "../../../../utils/constants";
import {ActivatedRoute, Router} from "@angular/router";
import {TreeService} from "../service/tree.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SpinnerService} from "../../../../common/services/spinner.service";
import {filter, map, skip} from "rxjs/operators";
import {CategoryNode} from "../../../../class/category-node";
import {TIPO_MESSAGGI} from "../../../../utils/enums";
import {MessageUtils} from "../../../../utils/message-utils";
import { DocumentoService } from "../service/documento.service";
import { DownloadUtils } from "src/app/utils/download-utils";

@Component({
  selector: 'app-list-documento',
  templateUrl: './list-documento.component.html',
  styleUrls: ['./list-documento.component.scss']
})
export class ListDocumentoComponent implements OnInit {
  dataSource: MatTableDataSource<DocumentiWorkspace>;
  displayedColumns: string[] = [
    'title', 'creationDate', 'organizatioName', 'author', 'stato', 'reserved', 'actions'
  ];
  canUpload: boolean;

  workspaceId: number;
  category: CategoryNode;
  user: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: SpinnerService,
    private documentoService: DocumentoService,
    private treeService: TreeService,
    private messageUtils: MessageUtils,
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {

    this.getUser();

    this.treeService.categoriaUpdate(new CategoryNode());

    this.treeService.categoryNodeSubject.pipe(filter(category => category !== null)).subscribe(category => {
      console.warn("this.treeService.categoryNodeSubject");
      this.category = category;
    });

    this.treeService.categoryTreeMapSubject.pipe(filter(categoriaTreeMap => categoriaTreeMap !== null)).subscribe(categoriaTreeMap => {
      console.warn("this.treeService.categoryTreeMapSubject");
      this.spinnerService.activeSpinner();
      console.warn("categoriaTreeMap",categoriaTreeMap);

      this.documentoService.getDocumentiWorkspace(categoriaTreeMap).subscribe(
        resp => {
          console.log("this.serviceDocumento.getDocumentiWorkspace: ", resp);
          this.dataSource = new MatTableDataSource(resp.listObj);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (err) => {
          // this.spinnerService.closeSpinner()
        },
        () => this.spinnerService.closeSpinner()
      );
    });

    this.treeService.documentiListSubject.subscribe(listDocumenti => {
      this.dataSource = new MatTableDataSource(listDocumenti);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.activatedRoute.parent.data.pipe(filter(data => data['workspaceId'] !== null)).subscribe(data => {
      this.workspaceId = data['workspaceId'];
      if(!this.workspaceId)
        this.router.navigate(['']).then(n => this.messageUtils.alertError('Non è stato possibile accedere al workspace'));
      this.showUploadButton(this.workspaceId);
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  goToDetail(tokenId: string) {
    //console.warn("GO TO DETAIL",tokenId);
    this.spinnerService.activeSpinner();
    this.router.navigate(['detail-documento'],{queryParams: {t: tokenId},relativeTo: this.activatedRoute})
      .then(() => this.spinnerService.closeSpinner());
  }

  downloadDocumento(tokenId: string) {
    this.spinnerService.activeSpinner();
    this.documentoService.downloadAttachment(tokenId).subscribe(
      (resp: HttpResponse<any>) => {
        if(resp && resp.headers) {
          const headers = resp.headers;
          DownloadUtils.downloadAttachments(resp.body, headers.get('content-type'),headers.get('content-disposition'));
        }else this.messageUtils.alertError('Errore nel download del documento!')
      },
      (err) => {
        // this.messageUtils.alertError('Errore nel download del documento!')
        // this.spinnerService.closeSpinner()
      },
      () => this.spinnerService.closeSpinner()
    );
  }

  showUploadButton(workspaceId: number) {
    let show: boolean;
    switch(workspaceId) {
      case Constants.accountDeliverables:
        if(this.user.amministratore || this.user.ngExpert)
          this.canUpload = true;
        break;
      case Constants.ngDocumentation:
        if(this.user.amministratore || this.user.ngPatner)
          this.canUpload = true;
        break;
      case Constants.eessiNewsDocumentation:
        if(this.user.amministratore || this.user.eessimemberPlus)
          this.canUpload = true;
        break;
      case Constants.rina_handover:
        if(this.user.amministratore || this.user.rinaHandoverplus)
          this.canUpload = true;
        break;
      default: this.canUpload = false;
    }
  }

  getUser() {
    this.user = localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')) : null;
    if(!this.user) {
      this.messageUtils.alertError('Dati utente non recuperati.');
      location.reload();
    }
  }
}
