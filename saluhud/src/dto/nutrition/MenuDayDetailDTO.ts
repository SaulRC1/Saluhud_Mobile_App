import MenuDayRecipeDTO from "@src/dto/nutrition/MenuDayRecipeDTO";

export default class MenuDayDetailDTO
{
    id: bigint;
    weekDay: string;
    menuDayRecipes: MenuDayRecipeDTO[];

    constructor(id: bigint, weekDay: string, menuDayRecipes: MenuDayRecipeDTO[])
    {
        this.id = id;
        this.weekDay = weekDay;
        this.menuDayRecipes = menuDayRecipes;
    }
}