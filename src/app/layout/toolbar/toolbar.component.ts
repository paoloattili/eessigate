import { WebsocketNotifiche } from "src/app/utils/websocket-notifiche";
import { environment } from "./../../../environments/environment";
import { MessageUtils } from "src/app/utils/message-utils";
import { SpinnerService } from "src/app/common/services/spinner.service";
import { LoginService } from "src/app/common/services/login.service";
import { NavbarItem } from "./../../class/navbar-item";
import { Router } from "@angular/router";
import { LogoIcon } from "./../../class/logo-icon";
import { User } from "./../../model/user";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() toggleSideNav = new EventEmitter<void>();
  @Input() user: User;
  @Input() items: NavbarItem[];
  logoHome: LogoIcon;

  constructor(
    private router: Router,
    public loginServie: LoginService,
    private spinnerService: SpinnerService,
    private messageutils: MessageUtils
  ) {
    this.logoHome = new LogoIcon('EESSIGate','');
  }

  ngOnInit(): void {
  }

  onClickNavbarItem(item: NavbarItem): void {
    this.router.navigate([item.path]);
  }

  goToHome(logoHome: LogoIcon){
    this.router.navigate([logoHome.path]);
  }

  logout() {
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
