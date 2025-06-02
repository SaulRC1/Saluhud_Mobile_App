export default class RecipeNameAndIdDataDTO
{
    recipeId: bigint;
    recipeName: string;

    constructor(recipeId: bigint, recipeName: string)
    {
        this.recipeId = recipeId;
        this.recipeName = recipeName;
    }
}