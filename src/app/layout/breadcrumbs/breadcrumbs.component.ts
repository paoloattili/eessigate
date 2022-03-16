import {Breadcrumb} from "../../class/breadcrumb";
import {Component, OnInit} from "@angular/core";
import {BreadcrumbsService} from "../../common/services/breadcrumbs.service";

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  breadcrumbs: Breadcrumb[];

  constructor(
    private breadcrumbsService: BreadcrumbsService,
  ) {
  }

  ngOnInit(): void {
    this.breadcrumbsService.breadcrumbsSubject.subscribe(
      (breadcrumbs: Breadcrumb[]) => {
        console.warn("[breadcrumb] component",breadcrumbs);
        this.breadcrumbs = breadcrumbs;
      }
    );

  }

}
