import { MenuService } from "../../common/services/menu.service";
import { take } from "rxjs/operators";
import { NavbarItem } from "./../../class/navbar-item";
import { User } from "../../model/user";
import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { LoginService } from "src/app/common/services/login.service";
import { SpinnerService } from "src/app/common/services/spinner.service";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  isActive: boolean = true;

  constructor(
    private router: Router,
    public service: LoginService,
    public menuService: MenuService,
    public serviceSpinner: SpinnerService
  ) { }

  ngOnInit() {
    this.serviceSpinner.activeSpinner()
    
    // this.serviceSpinner.closeSpinner();
  }

  onClickNavbarItem(item: NavbarItem): void {
    this.router.navigate([item.path]);
  }


}
