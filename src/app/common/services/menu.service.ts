import { User } from "src/app/model/user";
import { take } from "rxjs/operators";
import { NavbarItem } from "../../class/navbar-item";
import { Subject } from "rxjs";
import { Injectable } from '@angular/core';
import { Role } from "src/app/model/role";
import { N } from "@angular/cdk/keycodes";
import { RUOLI } from "src/app/utils/enums";

const ARR_MENU: NavbarItem[] = [
  new NavbarItem('Home', '', null, []),
  new NavbarItem('BUC Planner', 'area-riservata/dashboard-rollout-buc', null, [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE, RUOLI.EESSI_EVENT_MANAGER, RUOLI.CORDINATOR]),
  new NavbarItem('Spazio di lavoro', '', [
    new NavbarItem('NG.EDE Accounting & Deliverables', 'area-riservata/spazio-di-lavoro/accounting-and-deliverables', null, [RUOLI.AMMINISTRATORE, RUOLI.NG_EXPERT, RUOLI.SUPERVISOR_CE, RUOLI.CORDINATOR]),
    new NavbarItem('NG.EDE Documentation', 'area-riservata/spazio-di-lavoro/ng-documentation', null, [RUOLI.AMMINISTRATORE, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE]),
    new NavbarItem('EESSI News & Documentation', 'area-riservata/spazio-di-lavoro/eessi-news-documentation', null, [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE]),
    new NavbarItem('RINA Handover', 'area-riservata/spazio-di-lavoro/rina-handover', null, [RUOLI.AMMINISTRATORE, RUOLI.RINA_HANDOVER_MEMBER, RUOLI.RINA_HANDOVER_MEMBER_PLUS]),
  ], [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE, RUOLI.CORDINATOR]),
  new NavbarItem('Contenuti', '', [
    new NavbarItem('Visualizza Contenuti', 'area-riservata/contenuti/visualizza-contenuti', null, [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE, RUOLI.EESSI_EVENT_MANAGER, RUOLI.CORDINATOR, , RUOLI.CONTENT_MANAGER]),
    new NavbarItem('Nuovo Contenuto', 'area-riservata/contenuti/crea-contenuti', null, [RUOLI.AMMINISTRATORE, RUOLI.CONTENT_MANAGER]),
    new NavbarItem('Modifica Contenuto', 'area-riservata/contenuti/modifica-contenuti', null, [RUOLI.AMMINISTRATORE, RUOLI.CONTENT_MANAGER]),
    new NavbarItem('Approva Contenuto', 'area-riservata/contenuti/approva-contenuti', null, [RUOLI.AMMINISTRATORE, RUOLI.CONTENT_MANAGER]),
    new NavbarItem('Pubblica Contenuto', 'area-riservata/contenuti/pubblica-contenuti', null, [RUOLI.AMMINISTRATORE, RUOLI.CONTENT_MANAGER])
  ], [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE, RUOLI.EESSI_EVENT_MANAGER, RUOLI.CORDINATOR, RUOLI.CONTENT_MANAGER]),
  new NavbarItem('Eventi', '', [
    new NavbarItem('Calendario', 'area-riservata/eventi/calendario', null, [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE, RUOLI.EESSI_EVENT_MANAGER, RUOLI.CORDINATOR]),
    new NavbarItem('Nuovo Evento', 'area-riservata/eventi/nuovo', null, [RUOLI.AMMINISTRATORE, RUOLI.EESSI_EVENT_MANAGER])
  ], [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE, RUOLI.EESSI_EVENT_MANAGER, RUOLI.CORDINATOR, RUOLI.CONTENT_MANAGER]),
  new NavbarItem('Newsletter', '', [
    new NavbarItem('Visualizza Newsletter', 'area-riservata/newsletters/visualizza', null, []),
    new NavbarItem('Invia Newsletter', 'area-riservata/newsletters/invia', null, [RUOLI.AMMINISTRATORE, RUOLI.CONTENT_MANAGER]), //CHIEDERE A LUDO SE DEVE VEDERLO ANCHE L'EVENT_MANAGER
    new NavbarItem('Ricerca Newsletter', 'area-riservata/newsletters/ricerca', null, [RUOLI.AMMINISTRATORE, RUOLI.CONTENT_MANAGER]) //CHIEDERE A LUDO SE DEVE VEDERLO ANCHE L'EVENT_MANAGER
  ], []),
  // new NavbarItem('Pianificazione', ''),
  new NavbarItem('Service Desk', '', [
    new NavbarItem('Nuova Richiesta', 'area-riservata/service-desk/nuova-richiesta', null, [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE, RUOLI.EESSI_EVENT_MANAGER, RUOLI.CORDINATOR, RUOLI.HELP_DESK]),
    new NavbarItem('Mie Richieste', 'area-riservata/service-desk/mie-richieste', null, [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE, RUOLI.EESSI_EVENT_MANAGER, RUOLI.CORDINATOR, RUOLI.HELP_DESK]),
    new NavbarItem('Gestione ticket', 'area-riservata/service-desk/gestione-ticket', null, [RUOLI.AMMINISTRATORE, RUOLI.HELP_DESK]),
    new NavbarItem('Riferimenti', 'area-riservata/service-desk/riferimenti', null, [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE, RUOLI.EESSI_EVENT_MANAGER, RUOLI.CORDINATOR, RUOLI.HELP_DESK])
  ], [RUOLI.AMMINISTRATORE, RUOLI.EESSI_MEMBER,RUOLI.EESSI_MEMBER_PLUS, RUOLI.NG_EXPERT, RUOLI.NG_PATNER, RUOLI.SUPERVISOR_CE, RUOLI.EESSI_EVENT_MANAGER, RUOLI.CORDINATOR, RUOLI.HELP_DESK]),
  // new NavbarItem('Area Amministrazione', 'admin/area-amministrazione', null, [RUOLI.AMMINISTRATORE])
];

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menuUpdated: Subject<NavbarItem[]> = new Subject<NavbarItem[]>();
  menu: NavbarItem[];

  constructor() { }

  getMenu() {
    return this.menuUpdated.asObservable();
  }

  loadMenu() {
    this.menuUpdated.pipe(take(1)).subscribe(m => this.menu = m);
    return this.menu;
  }

  setMenu(user: User) {
    if(user) {
      let menu: NavbarItem[] = [];

      ARR_MENU.forEach(m => {
        let voce = new NavbarItem();
        if(m.accessRole && m.accessRole.length > 0) {
          if(m.canAccess(m.accessRole, user)) {
            voce = m;
            if(m.haveSubItems()) {
              let subItems = m.subItems;
              voce.subItems = [];
              subItems.forEach(s => {
                if(s.canAccess(s.accessRole, user)) {
                  voce.subItems.push(s);
                }
              });
            }
            menu.push(voce);
          }
        } else {
          voce = m;
          if(m.haveSubItems()) {
            let subItems = m.subItems;
            voce.subItems = [];
            subItems.forEach(s => {
              if(s.canAccess(s.accessRole, user)) {
                voce.subItems.push(s);
              }
            });
            menu.push(voce);
          } else {
            menu.push(voce);
          }
        }
      });
      this.menuUpdated.next(menu);
    }else {
      let menuProvvisorio = [
        new NavbarItem('Home', '')
      ];
      this.menuUpdated.next(menuProvvisorio);
    }
  }

}
