import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarItem } from '../_viewmodel/navbar-item';
import { User } from '../_viewmodel/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  notifications: any[] = [];
  user: User = new User('Leonardo', 'Baioni');
  items: NavbarItem[] = [
    new NavbarItem('Home', 'homepage'),
    new NavbarItem('BUC Planner', 'dashboard-rollout-buc'),
    new NavbarItem('Spazio di lavoro', '', [
      new NavbarItem('NG.EDE Accounting & Deliverables', 'spazio-di-lavoro/accounting-and-deliverables'),
      new NavbarItem('NG.EDE Documentation', ''),
      new NavbarItem('EESSI News & Documentation', '')
    ]),
    new NavbarItem('Contenuti', '', [
      new NavbarItem('Nuovo Contenuto', ''),
      new NavbarItem('Modifica Contenuto', ''),
      new NavbarItem('Approva Contenuto', ''),
      new NavbarItem('Pubblica Contenuto', '')
    ]),
    new NavbarItem('Eventi', '', [
      new NavbarItem('Calendario', ''),
      new NavbarItem('Nuovo Evento', '')
    ]),
    new NavbarItem('Newsletter', '', [
      new NavbarItem('Invia Newsletter', ''),
      new NavbarItem('Ricerca Newsletter', '')
    ]),
    new NavbarItem('Pianificazione', ''),
    new NavbarItem('Service Desk', '', [
      new NavbarItem('Nuova Richiesta', ''),
      new NavbarItem('Mie Richieste', ''),
      new NavbarItem('Gestione ticket', ''),
      new NavbarItem('Riferimenti', '')
    ]),
    new NavbarItem('Area Amministrazione', 'area-amministrazione')
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout(): void {
    // TODO: Metodo da implementare
  }

  onClickNavbarItem(item: NavbarItem): void {
    this.router.navigate([item.path]);
  }

}
