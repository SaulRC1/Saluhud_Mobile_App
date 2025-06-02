export default class AddMenuDayToMenuDTO
{
    menuID: bigint;
    weekDay: string;

    constructor(menuID: bigint, weekDay: string)
    {
        this.menuID = menuID;
        this.weekDay = weekDay;
    }
}