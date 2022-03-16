import { NewsletterService } from "./../../../pages/area-riservata/newsletter/service/newsletter.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { DualListboxItem } from "./../../../class/dual-listbox-item";
import { filter } from "rxjs/operators";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { from } from "rxjs";

@Component({
  selector: 'app-dual-list-box',
  templateUrl: './dual-list-box.component.html',
  styleUrls: ['./dual-list-box.component.scss']
})
export class DualListBoxComponent implements OnInit,OnChanges {

  @Input() source = new Array<DualListboxItem>();
  @Input() dateSettate: boolean;

  selected = new Array<DualListboxItem>();

  dualListboxLeftElements = new Array<DualListboxItem>()
  dualListboxRightElements = new Array<DualListboxItem>()

  constructor(
    private newsletterService: NewsletterService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.dateSettate) {
      if(!this.dateSettate) {
        this.removeAll();
      }
    }
  }

  ngOnInit(): void {
    this.dualListboxLeftElements = this.source.sort((a,b) => this.sortFn(a,b));
  }

  applyFilterLeft(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dualListboxLeftElements = this.source.filter(f => f.value.trim().toLowerCase().includes(filterValue.trim().toLowerCase()));
  }

  applyFilterRight(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dualListboxRightElements = this.selected.filter(f => f.value.trim().toLowerCase().includes(filterValue.trim().toLowerCase()));
  }

  pushRight(item: DualListboxItem) {
    this.selected.push(item);
    const index = this.source.indexOf(item);
    this.source.splice(index, 1);
    this.dualListboxLeftElements = this.source;
    this.dualListboxRightElements = this.selected.sort((a,b) => this.sortFn(a,b));
    this.updateSezioni();
  }

  pushLeft(item: DualListboxItem) {
    this.source.push(item);
    const index = this.selected.indexOf(item);
    this.selected.splice(index, 1);
    this.dualListboxLeftElements = this.source.sort((a,b) => this.sortFn(a,b));
    this.dualListboxRightElements = this.selected;
    this.updateSezioni();
  }

  sendAll() {
    this.selected = this.selected.concat(this.source.concat());
    this.source = [];
    this.dualListboxLeftElements = this.source;
    this.dualListboxRightElements = this.selected.sort((a,b) => this.sortFn(a,b));
    this.updateSezioni();
  }

  removeAll() {
    this.source = this.source.concat(this.selected.concat());
    this.selected = [];
    this.dualListboxLeftElements = this.source.sort((a,b) => this.sortFn(a,b));
    this.dualListboxRightElements = this.selected;
    this.updateSezioni();
  }

  updateSezioni() {
    this.newsletterService.setlistaSezioniSelezionate(this.selected);
  }

  sortFn(a, b) {
      return ('' + a.key).localeCompare(b.key);
  }

}
