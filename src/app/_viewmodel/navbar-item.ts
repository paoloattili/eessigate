export class NavbarItem {
    title: string;
    path: string;
    subItems: NavbarItem[] = [];

    constructor(title: string, path: string, subItems: NavbarItem[] = []) {
        this.title = title;
        this.path = path;
        this.subItems = subItems;
    }

    haveSubItems(): boolean {
        return this.subItems.length > 0;
    }
}
