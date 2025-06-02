export default class MenuCardDTO
{
    menuID: bigint;
    menuName: string;
    isFavourite: boolean;

    constructor(menuID: bigint, menuName: string, isFavourite: boolean)
    {
        this.menuID = menuID;
        this.menuName = menuName;
        this.isFavourite = isFavourite;
    }
}