export default class IngredientDTO
{
    name: string;
    kilocalories: number;
    proteinAmount: number;
    carbohydratesAmount: number;
    fatAmount: number;

    constructor(name: string, kilocalories: number, proteinAmount: number, carbohydratesAmount: number, fatAmount: number)
    {
        this.name = name;
        this.kilocalories = kilocalories;
        this.proteinAmount = proteinAmount;
        this.carbohydratesAmount = carbohydratesAmount;
        this.fatAmount = fatAmount;
    }
}