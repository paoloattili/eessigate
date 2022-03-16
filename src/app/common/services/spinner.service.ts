import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinner: boolean = false;
  private progressBar: boolean = false;

  constructor() {}

  isSpinnerActive(){
    return this.spinner;
  }

  activeSpinner(){
    // console.warn('this',this);
    // console.warn('spinner',this.spinner);
    // console.warn('data attivazione',new Date());
    this.spinner = true;
  }

  closeSpinner(){
    // console.warn('this',this);
    // console.warn('spinner',this.spinner);
    // console.warn('data attivazione',new Date());
    this.spinner = false;
  }

  isProgressBarActive(){
    return this.progressBar;
  }

  activeProgressBar(){
    this.progressBar = true;
  }

  closeProgressBar(){
    this.progressBar = false;
  }
}
