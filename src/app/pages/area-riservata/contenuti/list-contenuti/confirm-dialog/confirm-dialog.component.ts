import { ContentStatusUpdateForm } from "./../../../../../model/content-status-update-form";
import { ConfirmDialog } from "./../../../../../class/confirm-dialog";
import { Component, Inject, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/common/services/spinner.service';
import { MessageUtils } from 'src/app/utils/message-utils';
import { ContentService } from '../../service/content.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PATTERN_DESCRIPTION } from "src/app/utils/utils.validator";
import { Router } from "@angular/router";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  //  1: approva  2: pubblica  3: rigetta
  tipoConfirm: string;
  question: string;

  @ViewChild('bottoneChiusura')
  bottoneChiusura: ElementRef;

  aggiornaStatoForm: FormGroup = this.fb.group({
    note: [null, [Validators.pattern(PATTERN_DESCRIPTION)]],
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialog,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public spinnerService: SpinnerService,
    private service: ContentService,
    private messageutils: MessageUtils,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getTitoloConfirm();
  }

  getTitoloConfirm() {
    if(this.data && !this.data.isElimina) {
      if(this.data.tipo === 1) {
        this.tipoConfirm = 'Approva';
      } else if (this.data.tipo === 3) {
        this.tipoConfirm = 'Rigetta';
      } else {
        this.tipoConfirm = 'Pubblica';
      }

      if(this.data.stato === 'RIGETTA') {
        this.question = 'Rigettare il contenuto?';
      } else if(this.data.stato === 'DA_APPROVARE') {
        this.question = 'Approvare il contenuto?';
      } else if(this.data.stato === 'DA_PUBBLICARE') {
        this.question = 'Pubblicare il contenuto?';
      } else if(this.data.stato === 'PUBBLICATO') {
        this.question = 'Depubblicare il contenuto?';
      }

    } else if(this.data && this.data.isElimina) {
      this.tipoConfirm = 'Elimina';
      this.question = 'Sicuro di voler eliminare il contenuto?';
    }
  }

  onSubmit(tipo: number, stato: string, token: string) {
    this.spinnerService.activeProgressBar();
    if(tipo && stato) {
      if(stato === 'DA_APPROVARE') {
        this.approva(token);
      } else if(this.data.stato === 'DA_PUBBLICARE') {
        this.pubblica(token);
      } else if(this.data.stato === 'PUBBLICATO') {
        this.depubblica(token);
      } else if(this.data.stato === 'RIGETTA') {
        this.rigetta(token);
      }
    } else {
      this.delete(token);
    };
  }

  private formToObject(token) {
    return {
      ...new ContentStatusUpdateForm(),
      token: token,
      note: this.aggiornaStatoForm.get(['note']).value
    }
  }

  private pubblica(token){
    this.service.doPubblica(this.formToObject(token)).subscribe(
      resp => {
        this.spinnerService.closeProgressBar();
        this.dialogRef.close();
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]).then(
            () => this.messageutils.alertSuccess(resp.messaggio.messaggio)
          );
        });
      },
      (err) => {
        // console.error(err);
        // this.messageutils.alertError('Errore nella pubblicazione del contenuto!')
        // this.spinnerService.closeSpinner();
      },
      () => this.spinnerService.closeProgressBar()
    )
  }

  private depubblica(token){
    this.service.dePubblica(this.formToObject(token)).subscribe(
      resp => {
        this.spinnerService.closeProgressBar();
        this.dialogRef.close();
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]).then(
            () => this.messageutils.alertSuccess(resp.messaggio.messaggio)
          );
        });
      },
      (err) => {
        // console.error(err);
        // this.messageutils.alertError('Errore nella depubblicazione del contenuto!');
        // this.spinnerService.closeProgressBar();
      },
      () => this.spinnerService.closeProgressBar()
    )
  }

  private approva(token){
    this.service.doApprova(this.formToObject(token)).subscribe(
      resp => {
        this.spinnerService.closeProgressBar();
        this.dialogRef.close();
        this.router.navigate(['/area-riservata/contenuti/pubblica-contenuti']).then(
          () => this.messageutils.alertSuccess(resp.messaggio.messaggio)
        );
      },
      (err) => {
        // console.error(err);
        // this.messageutils.alertError('Errore nell\'approvazione del contenuto!')
        // this.spinnerService.closeProgressBar();
      },
      () => this.spinnerService.closeProgressBar()
    )
  }

  private rigetta(token){
    this.service.rigetta(this.formToObject(token)).subscribe(
      resp => {
        this.spinnerService.closeProgressBar();
        this.dialogRef.close();
        this.router.navigate(['/area-riservata/contenuti/modifica-contenuti']).then(
          () => this.messageutils.alertSuccess(resp.messaggio.messaggio)
        );
      },
      (err) => {
        // console.error(err);
        // this.messageutils.alertError('Errore nel rigettare il contenuto!')
        // this.spinnerService.closeProgressBar();
      },
      () => this.spinnerService.closeProgressBar()
    )
  }

  private delete(token) {
    this.service.elimina(token).subscribe(
      resp => {
        this.spinnerService.closeProgressBar();
        this.dialogRef.close();
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]).then(
            () => this.messageutils.alertSuccess(resp.messaggio.messaggio)
          );
        });
      },
      (err) => {
        // console.error(err);
        // this.messageutils.alertError('Errore nell\'eliminazione del contenuto!')
        // this.spinnerService.closeProgressBar();
      },
      () => this.spinnerService.closeProgressBar()
    )
  }

}
