export default class MenuDayDTO
{
    id: bigint;
    weekDay: string;

    constructor(id: bigint, weekDay: string)
    {
        this.id = id;
        this.weekDay = weekDay;
    }
}