import { dateToStringFormatDDMMYYYY, dateToStringFormatYYYYMMDDHHMM } from "src/app/utils/date-utils";
import { DualListboxItem } from "./../class/dual-listbox-item";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn} from "@angular/forms";

export const PATTERN_CF : RegExp = /^(([a-zA-Z]){3}([a-zA-Z]){3}([0-9]){2}([a-zA-Z]){1}([0-9]){2}([a-zA-Z0-9]){4}([a-zA-Z]){1})/;

export const PATTERN_NAME : string = '^(?!((.*)<(.*)>.*$))(?!(^((.*)=(.*)).*$))+(?!((.*)＜(.*)＞.*$))(?!(^((.*)＝(.*)).*$)).*$';

export const PATTERN_DESCRIPTION: string = '^(?!((.*)<(.*)>.*$))(?!(^((.*)=(.*)).*$))+(?!((.*)＜(.*)＞.*$))(?!(^((.*)＝(.*)).*$)).*$';

export const PATTERN_DOCUMENT_NAME: string = '^(?!((.*)<(.*)>.*$))(?!(^((.*)=(.*)).*$))+(?!((.*)＜(.*)＞.*$))(?!(^((.*)＝(.*)).*$)).*$';

export const PATTERN_NUMBER: string = '[0-9]*';

export const PATTERN_CONTENT: string = '^(?!((.*)<(.*)>.*$))(?!(^((.*)=(.*)).*$))+(?!((.*)＜(.*)＞.*$))(?!(^((.*)＝(.*)).*$)).*$';

export function ValidateFileSize(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value) {
    const file: File = control.value;
    const size: number = file.size / (1024 * 1024);
    if (size > 20) {
      return { invalidSize: true}
    }
  }
  return null;
}

// metodo di validazione da sostituire con i patttern
export function ValidateFileName(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value) {
    const file: File = control.value;
    const fileName = file.name.split('.');
    if (fileName){
      if(fileName.length > 2 || fileName.length === 1){
        return {'invalidName': true };
      }
    }
  }
  return null;
}

export function ValidateFileType(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value) {
    const file: File = control.value;
    const fileName = file.name.split('.');
    const fileType = fileName[fileName.length - 1].toLowerCase();
    const notAllowedTypes = ['chm','lnk','bat','rar','msi','exe','jar']

    console.warn("Validazione dei file");

    const types = notAllowedTypes.filter(type => type == fileType )
    if(types.length !== 0 || fileType === null){
      return {'invalidType': true };
    }
  }
  return null;
}

export function creatDateRangeValidator(): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {

    const start:number = Date.parse(form.get(["dataInizio"]).value);

    const end:number = Date.parse(form.get(["dataFine"]).value);

    if (start && end) {
      const isRangeValid = (end - start > 0);
      console.warn("validator isranged",isRangeValid);
      return isRangeValid ? null : {dateRange:true};
    }

    return null;
  }
}

export function creatDateRangeValidatorNewsletter(): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {

    let start: any = form.get(["dataInizio"])?.value ;
    let end: any = form.get(["dataFine"])?.value ;

    if (start && end) {
      console.warn("start end",start,end)
      start?._d.setHours(0,0,0);
      end?._d.setHours(0,0,0);
      const isRangeValid = (end._d.getTime() - start._d.getTime() >= 0);
      console.warn("validator isranged",isRangeValid);
      return isRangeValid ? null : {dateRange:true};
    }

    return null;
  }
}

export function checkDateSystem(): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {

    const start:any = form.get(["dataInizio"]).value;
    const end:any = form.get(["dataFine"]).value;
    const sysDate = new Date();

    if(start && end) {
      const isRangeValid = (start?._d.getTime() - sysDate.getTime() < 0) && (end?._d.getTime() - sysDate.getTime() < 0);
      console.warn("validator isranged",isRangeValid);
      return isRangeValid ? null : {dateRange:true};
    }
  }
}

export function checkDateSystemEventi(): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {

    const start:any = form.get(["dataInizio"]).value;
    const sysDate = new Date();

    let startDate = (start._d as Date);

    if(startDate) {
      const isRangeValid = (startDate.getTime() - sysDate.getTime() >= 0)
      console.warn("validator isranged",isRangeValid);
      return isRangeValid ? null : {dateRange:true};
    }
  }
}

export function ValidateNotImage(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value) {
    const file: File = control.value;
    const fileType = file.name.split('.')[1].toLowerCase();
    const notAllowedTypes = ['jpg','jpeg','png','gif','jpe','ief']

    const types = notAllowedTypes.filter(type => type == fileType )
    if(types.length === 0 || fileType === null){
      return null;
    } else {
      return {'invalidType': true };
    }
  }
  return null;
}

export function chiusuraValidator(): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {

    const start:Date = new Date(form.get(["dataInizio"]).value);
    const chiusura:Date = new Date(form.get(["chiusuraIscrizione"]).value);
    const oggi: Date = new Date();

    if (start && chiusura) {
      return chiusura < start && chiusura >= oggi ? null : {chiusuraValidator:true};
    }

    return null;
  }
}

export function ValidateImage(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value) {
    const file: File = control.value;
    const fileType = file.name.split('.')[file.name.split('.').length-1].toLowerCase();
    const allowedTypes = ['jpg','jpeg','png','gif','jpe','ief']

    const types = allowedTypes.filter(type => type == fileType )
    if(types.length === 0 || fileType === null){
      return {'invalidType': true };
    }
  }
  return null;
}

export function ValidateBody(control: AbstractControl): { [key: string]: boolean } | null {
  if (control.value) {

    //const body: string = control.value.substring(control.value.indexOf('<p>')+3,control.value.lastIndexOf('</p>'));

    const bodyValues: string[] = control.value.split(/<p>(.*)<\/p>/);

    if(bodyValues) {
      const filterValues = bodyValues.filter(s => s !== '' && !s.includes('\n') && !s.match(/^(?!((.*)＜(.*)＞.*$))(?!(^((.*)＝(.*)).*$))(?!(^((.*)=(.*)).*$)).*$/));

      console.warn('filterValues',filterValues);

      if(filterValues.length > 0)
        return {isNotValid: true};
    }

  }
  return null;
}
