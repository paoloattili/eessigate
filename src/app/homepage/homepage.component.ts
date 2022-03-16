import { DocumentiHomeBean } from './../_model/documenti-home-bean';
import { JsonContentsHome } from './../_model/json-contents-home';
import { Component, OnInit } from '@angular/core';
import { HomepageService } from '../_service/homepage.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  
  homeContents: JsonContentsHome[];
  ultimiDocumenti: DocumentiHomeBean[];
  documentiTopCommentati: DocumentiHomeBean[];

  constructor(private service: HomepageService) { }

  ngOnInit() {
    this.getHomeContent();
    this.getUltimiDocumenti();
    this.getDocumentiTopCommentati();
  }

  private getHomeContent(): void {
    this.service.getHomeContent().then(resp => {
      this.homeContents = resp.listObj;
    }).catch(err => {
      // TODO: Failure
    });
  }

  private getUltimiDocumenti(): void {
    this.service.getUltimiDocumenti().then(resp => {
      this.ultimiDocumenti = resp.listObj;
    }).catch(err => {
      // TODO: Failure
    });
  }

  private getDocumentiTopCommentati(): void {
    this.service.getDocumentiTopCommentati().then(resp => {
      this.documentiTopCommentati = resp.listObj;
    }).catch(err => {
      // TODO: Failure
    });
  }

}
