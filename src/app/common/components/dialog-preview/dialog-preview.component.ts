import { MessageUtils } from "src/app/utils/message-utils";
import { ContentService } from "./../../../pages/area-riservata/contenuti/service/content.service";
import { SpinnerService } from "src/app/common/services/spinner.service";
import { ContentPreview } from "./../../../model/content-preview";
import { Component, ElementRef, Inject, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpResponse } from "@angular/common/http";
import { DownloadUtils } from "src/app/utils/download-utils";
import { MatTooltip } from "@angular/material/tooltip";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DirectivesModule } from "../../directives/directives.module";

@Component({
  selector: 'app-dialog-preview',
  templateUrl: './dialog-preview.component.html',
  styleUrls: ['./dialog-preview.component.scss']
})
export class DialogPreviewComponent implements OnInit {

  @ViewChild('contentDialog') bodyContent: ElementRef;

  caricaProgressBar: boolean[] = [];
  url: string;
  ingrandito: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ContentPreview,
    public spinnerService: SpinnerService,
    private service: ContentService,
    private messageutils: MessageUtils,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    console.warn('this.data',this.data);
    if(this.data) {
      this.url = location.host + '/AS0207/EESSIGateWEB/#/area-riservata/contenuti/visualizza-contenuti?cryptKey='+this.data.tokenCrypt;
      if(this.data.attachments){
        this.data.attachments.forEach(el => {
          this.caricaProgressBar.push(false);
        });
      }
    }
  }

  downloadAttachment(token: string, i: number) {
    this.caricaProgressBar[i] = true;
    this.service.downloadAttachment(token).subscribe(
      (resp: HttpResponse<any>) => {
        if(resp && resp.headers) {
          const headers = resp.headers;
          DownloadUtils.downloadAttachments(resp.body, headers.get('content-type'),headers.get('content-disposition'));
        }else this.messageutils.alertError('Errore nel download del documento!')
      },
      (err) => {
        // this.messageutils.alertError('Errore nel download del documento!');
        this.caricaProgressBar[i] = false;
      },
      () => {
        this.caricaProgressBar[i] = false;
      }
    );
  }

  openSnackBar(): void {
    this._snackBar.open("URL copiata!", '',{duration: 2000});
  }

  clickImg($event) {
    this.ingrandito = $event;
  }


}
