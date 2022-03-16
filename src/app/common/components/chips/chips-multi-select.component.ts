import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Observable} from "rxjs-compat";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'input-chips-multi-select',
  templateUrl: './chips-multi-select.component.html',
  styleUrls: ['./chips-multi-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChipsMultiSelectComponent implements OnChanges, OnInit  {
  /**
   *  il filtro avviene tramite il campo name
   */
  @Input('disabled') disabled: boolean = false;
  @Input('label') label: string = "Label input generico";
  @Input('items') items: any[] = [];
  @Input('defaultSelectedItems') defaultSelectedItems: any[] = [];
  @Output('selectedItems') selectedItemsEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();

  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;
  filteredSelectItems: Observable<any[]>;
  inputControl = new FormControl();
  selectedItems: any[] = [];

  itemsTemp: any[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.defaultSelectedItems?.currentValue.length !== 0) {
      if (changes.defaultSelectedItems?.currentValue !== changes.defaultSelectedItems?.previousValue) {
        this.selectedItems = [];
        for ( let item of this.defaultSelectedItems ) {
          this.selectedItems.push(item);
        }
      }
    }

    if(changes.items.previousValue !== changes.items.currentValue){
      this.itemsTemp = Object.assign(this.items);
    }
  }

  ngOnInit(): void {
    this.filterInputChanges();
  }


  filterInputChanges(): void {
    this.filteredSelectItems = this.inputControl.valueChanges.pipe(
      startWith(''),
      map((filterValue: string) => (filterValue ? this._filterItems(filterValue) : this.itemsTemp.slice())),
    );
  }

  removeSelectedItem(chip: any): void {
    const index = this.selectedItems.indexOf(chip);
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
      this.itemsTemp.push(chip);
    }
    this.inputControl.setValue('');
    this.selectedItemsEmitter.emit(this.selectedItems);
  }

  selectedItem(event: MatAutocompleteSelectedEvent): void {
    this.selectedItems.push(event.option.value as any);

    let count = 0;
    for (let itemTemp of this.itemsTemp) {
      if (itemTemp === event.option.value) {
        this.itemsTemp.splice(count,1)
      }
      count++;
    }

    this.selectedItemsEmitter.emit(this.selectedItems);
    this.chipInput.nativeElement.value = '';
    this.inputControl.setValue('');
  }

  private _filterItems(filterValue: string): any[] {
    if (typeof filterValue === 'string') {
      filterValue = filterValue?.toLowerCase();
      if (filterValue.trim().length === 0) filterValue = "";
    } else {
      filterValue = '';
    }
    return this.itemsTemp.filter(item => item.name.toLowerCase().includes(filterValue));
  }

}
