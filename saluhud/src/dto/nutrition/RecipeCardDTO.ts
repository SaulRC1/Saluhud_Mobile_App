import RecipeCardAllergenicDTO from "./RecipeCardAllergenicDTO";

export default class RecipeCardDTO
{
    recipeID: bigint;
    recipeName: string;
    recipeKcal: number;
    recipeImageSource?: string
    recipeAllergenics: RecipeCardAllergenicDTO[]

    constructor(recipeID: bigint, recipeName: string, recipeKcal: number, recipeAllergenics: RecipeCardAllergenicDTO[], 
        recipeImageSource?: string)
    {
        this.recipeID = recipeID;
        this.recipeName = recipeName;
        this.recipeKcal = recipeKcal;
        this.recipeImageSource = recipeImageSource;
        this.recipeAllergenics = recipeAllergenics;
    }
}