export default class RecipeCardDTO
{
    recipeID: bigint;
    recipeName: string;
    recipeKcal: number;
    recipeImageSource?: string

    constructor(recipeID: bigint, recipeName: string, recipeKcal: number, recipeImageSource?: string)
    {
        this.recipeID = recipeID;
        this.recipeName = recipeName;
        this.recipeKcal = recipeKcal;
        this.recipeImageSource = recipeImageSource;
    }
}