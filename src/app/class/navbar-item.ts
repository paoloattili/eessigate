import { User } from "../model/user";
import { RUOLI } from "../utils/enums";
import { Role } from "./../model/role";
export class NavbarItem {
    title: string;
    path: string;
    subItems: NavbarItem[] = [];
    accessRole?: RUOLI[];

    constructor(title?: string, path?: string, subItems?: NavbarItem[], accessRole?: RUOLI[]) {
        this.title = title;
        this.path = path;
        this.subItems = subItems;
        this.accessRole = accessRole;
    }

    haveSubItems() {
        return this.subItems && this.subItems.length > 0;
    }

    canAccess(ruoliAccesso: RUOLI[], user: User) {
        let checkAccess: boolean;
        if(ruoliAccesso && ruoliAccesso.length > 0) {
            ruoliAccesso.forEach(r => {
                if(this.checkRole(user.ruoli, r))
                    checkAccess = true;
            });
        } else {
            checkAccess = true;
        }
        return checkAccess;
    }

    private checkRole(roles: Role[], idRuolo: RUOLI) {
        let ruoloPresente: boolean;
        if(roles && roles.length > 0) {
            roles.forEach(r => {
                if(r.idRuolo === idRuolo) {
                    ruoloPresente = true;
                }
            });
        }
        return ruoloPresente;
    }
}
