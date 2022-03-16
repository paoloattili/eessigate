import {ActivatedRoute} from "@angular/router";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {Commento, CommentoForm} from "../../../model/commento";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input('disabilitaPulsante') disabilitaPulsante: boolean = true;
  @Input('menu') menuMessaggioAttivato = true;
  @Input('comments') comments: Set<Commento> = new Set<Commento>();
  @Output() commentEvent = new EventEmitter<CommentoForm>();
  @Output() eliminaCommentoEvent = new EventEmitter<string>();

  utentePrincipale: any;
  commentsSize: number;

  commentoForm: FormGroup = this.fb.group({
    text: [],
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.utentePrincipale = JSON.parse(localStorage.getItem('user')).denominazione;
    console.warn('disabilitaPulsante',this.disabilitaPulsante);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comments'].currentValue){
      this.commentsSize = changes['comments'].currentValue.length ?changes['comments'].currentValue.length : changes['comments'].currentValue.size;
    }
  }

  ngAfterViewInit(): void {
  }

  formToObject(): CommentoForm {
    return {
      ... new CommentoForm(),
      commentId: null,
      text: this.commentoForm.get(['text']).value,
      author: null,
      documentId: null,
      tokenId: null,
      tokenDocumentId: null,
    }
  }

  invia(): void {
    const commentoForm = this.formToObject();
    this.commentoForm.get(['text']).setValue('');
    this.commentEvent.emit(commentoForm);
  }

  eliminaCommento($event: any): void {
    this.eliminaCommentoEvent.emit($event);
  }

  ngOnDestroy(): void {
  }


}
