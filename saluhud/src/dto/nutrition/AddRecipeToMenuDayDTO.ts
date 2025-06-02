export default class AddRecipeToMenuDayDTO
{
    menuDayId: bigint;
    recipeId: string;
    startTime: string;
    endTime: string;

    constructor(menuDayId: bigint, recipeId: string, startTime: string, endTime: string)
    {
        this.menuDayId = menuDayId;
        this.recipeId = recipeId;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}