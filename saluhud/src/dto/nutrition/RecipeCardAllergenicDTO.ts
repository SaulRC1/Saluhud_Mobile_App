export default class RecipeCardAllergenicDTO
{
    allergenicId: number;
    allergenicName: string;

    constructor(allergenicId: number, allergenicName: string)
    {
        this.allergenicId = allergenicId;
        this.allergenicName = allergenicName;
    }
}