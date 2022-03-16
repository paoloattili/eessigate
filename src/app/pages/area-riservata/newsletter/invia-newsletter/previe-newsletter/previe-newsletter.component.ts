import { AfterViewChecked, ElementRef, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { NewsletterTemplate } from "./../../model/newsletter-template";
import { Component, Inject, OnInit, AfterViewInit } from "@angular/core";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from "src/app/common/services/spinner.service";

@Component({
  selector: 'app-previe-newsletter',
  templateUrl: './previe-newsletter.component.html',
  styleUrls: ['./previe-newsletter.component.scss']
})
export class PrevieNewsletterComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TemplateRef<any>,
    public spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
  }

}
