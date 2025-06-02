export default class EditMenuDTO
{
    menuId: bigint;
    menuName: string;

    constructor(menuId: bigint, menuName: string)
    {
        this.menuId = menuId;
        this.menuName = menuName;
    }
}