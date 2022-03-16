export class CategoryNode {
    tokenCategoryId: string = null;
    name: string = null;
    countDocument: number = null;
    description?: string = null;
    treeMap: string = null;
    treeMapFolderName: string = null;
    children?: CategoryNode[] = [];
}
