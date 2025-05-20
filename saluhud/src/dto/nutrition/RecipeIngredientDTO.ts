import IngredientDTO from "@src/dto/nutrition/IngredientDTO";

export default class RecipeIngredientDTO
{
    ingredient: IngredientDTO;
    quantity: number;
    unit: string;

    constructor(ingredient: IngredientDTO, quantity: number, unit: string)
    {
        this.ingredient = ingredient;
        this.quantity = quantity;
        this.unit = unit;
    }
}