export default class RecipeElaborationStepDTO
{
    stepDescription: string;
    stepNumber: string;

    constructor(stepDescription: string, stepNumber: string)
    {
        this.stepDescription = stepDescription;
        this.stepNumber = stepNumber;
    }
}