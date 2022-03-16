export class Category {

	name: string;
	description: string;
	orderTree: number;
	maxOrderTree: number;
	categoryType: string;
	namingConvetion: string;
	countDocument: number;
	tokenTreeMap: string;
	tokenCategoryId: string;
	tokenParentId: string;
	tokenParentTreeMap: string;
	childCategories: Category[];
	treeMapFolderName: string;

}
