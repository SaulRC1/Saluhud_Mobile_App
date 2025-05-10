export default class BodyCompositionDTO
{
    leanBodyMassPercentage: number;
    bodyFatPercentage: number;
    bodyFatWeight: number;
    leanBodyMassWeight: number;

    constructor(leanBodyMassPercentage: number, bodyFatPercentage: number, bodyFatWeight: number, leanBodyMassWeight: number)
    {
        this.leanBodyMassPercentage = leanBodyMassPercentage;
        this.bodyFatPercentage = bodyFatPercentage;
        this.bodyFatWeight = bodyFatWeight;
        this.leanBodyMassWeight = leanBodyMassWeight;
    }
}