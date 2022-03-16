import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './area-contenuti.component.html',
  styleUrls: ['./area-contenuti.component.scss']
})
export class AreaContenutiComponent implements OnInit {

  title: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.title = data['breadcrumb'];
    });
  }

}
