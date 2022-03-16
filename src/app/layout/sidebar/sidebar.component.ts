import { MessageUtils } from "./../../utils/message-utils";
import { environment } from "./../../../environments/environment";
import { SpinnerService } from "src/app/common/services/spinner.service";
import { Router } from "@angular/router";
import { NavbarItem } from "./../../class/navbar-item";
import { LoginService } from "../../common/services/login.service";
import { User } from "./../../model/user";
import { Component, OnInit, Input } from "@angular/core";
import { WebsocketNotifiche } from "src/app/utils/websocket-notifiche";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input() user: User;
  @Input() items: NavbarItem[];

  constructor(
    private loginServie: LoginService,
    private spinnerService: SpinnerService,
    private router: Router,
    private messageutils: MessageUtils) {
  }

  ngOnInit(): void {
  }

  onClickNavbarItem(item: NavbarItem): void {
    this.router.navigate([item.path]);
  }

  logout() {
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
    for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
    }
    
    this.spinnerService.activeSpinner()
    this.loginServie.logout().subscribe(
      resp => {
        console.warn(resp);

        localStorage.clear();
        if(environment.env !== 'dev'){
            const url = window.location.href;
            if(url.indexOf('internetj.sviluppo.inps.it') > 0)
                location.href = 'https://ws7test.sviluppo.inps.it/PassiWeb/jsp/logout.jsp';
            else if(url.indexOf('serviziweb2.wmo.inps.it') > 0)
                location.href = 'https://serviziweb2.wmo.inps.it/PassiWeb/jsp/logout.jsp';
            else if(url.indexOf('serviziweb2.inps.it') > 0)
                location.href = 'https://serviziweb2.inps.it/PassiWeb/jsp/logout.jsp';
        } else {
            this.spinnerService.closeSpinner();
            this.messageutils.alertSuccess('Logout effettuato')
            setTimeout(() => location.reload(), 2000);
        }
      },
      (err) => {
        // this.messageutils.alertError('Errore nell\'effettuare il logout!');
        // this.spinnerService.closeSpinner();
      }
    )
  }

}
