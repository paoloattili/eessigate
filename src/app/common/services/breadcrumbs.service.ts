import {Injectable, OnInit} from '@angular/core';
import {Breadcrumb} from "../../class/breadcrumb";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbsService implements OnInit{
  breadcrumbsSubject: Subject<Breadcrumb[]> = new Subject<Breadcrumb[]>();
  breadcrumbs: Breadcrumb[] = [];

  ngOnInit(): void {
  }

  public generateBreadcrumbs(breadcrumbArray: Breadcrumb[]): void {
    this.breadcrumbs = [];

    this.breadcrumbs.push(new Breadcrumb('Home',''));

    for ( let breadcrumb of breadcrumbArray ) {
      this.breadcrumbs.push(breadcrumb);
    }

    this.breadcrumbsSubject.next(this.breadcrumbs);
  }

}
