import RecipeCardDTO from "@src/dto/nutrition/RecipeCardDTO";

export default class MenuDayRecipeDTO
{
    id: bigint;
    startTime: string;
    endTime: string;
    recipe: RecipeCardDTO;
    
    constructor(id: bigint, startTime: string, endTime: string, recipe: RecipeCardDTO)
    {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.recipe = recipe;
    }
}