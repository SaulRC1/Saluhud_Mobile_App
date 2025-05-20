import RecipeCardAllergenicDTO from "@src/dto/nutrition/RecipeCardAllergenicDTO";
import RecipeIngredientDTO from "@src/dto/nutrition/RecipeIngredientDTO";
import RecipeElaborationStepDTO from "@src/dto/nutrition/RecipeElaborationStepDTO";

export default class RecipeDetailDTO
{
    name: string;
    description: string;
    ingredientsDescription: string;
    kilocalories: number;
    imageSource: string;
    
    recipeAllergenics: RecipeCardAllergenicDTO[];
    recipeIngredients: RecipeIngredientDTO[];
    elaborationSteps: RecipeElaborationStepDTO[];

    constructor(name: string, description: string, ingredientsDescription: string, kilocalories: number, imageSource: string,    
        recipeAllergenics: RecipeCardAllergenicDTO[], recipeIngredients: RecipeIngredientDTO[], 
        elaborationSteps: RecipeElaborationStepDTO[])
    {
        this.name = name;
        this.description = description;
        this.ingredientsDescription = ingredientsDescription;
        this.kilocalories = kilocalories;
        this.imageSource = imageSource;
        this.recipeIngredients = recipeIngredients;
        this.elaborationSteps = elaborationSteps;
        this.recipeAllergenics = recipeAllergenics;
    }
}