export const enum HarrisBenedictActivityFactorEnum {
    /**
     * Sedentary, little to no exercise.
     */
    SEDENTARY = 1.2,
    
    /**
     * Light exercise. Sports 1-3 days a week.
     */
    LIGHTLY_ACTIVE = 1.375,
    
    /**
     * Moderate exercise. Sports 3-5 days a week.
     */
    MODERATELY_ACTIVE = 1.55,
    
    /**
     * Hard exercise. Sports 6-7 days a week.
     */
    VERY_ACTIVE = 1.725,
    
    /**
     * Very hard exercise. Sports and a physical job.
     */
    EXTRA_ACTIVE = 1.9,
    
    /**
     * Professional athlete training.
     */
    PROFESSIONAL_ATHLETE = 2.3
}

export const fromActivityFactorValue = (activityFactorValue: number) => {
    switch(activityFactorValue) {
        case 1.2:
            return HarrisBenedictActivityFactorEnum.SEDENTARY;
        case 1.375:
            return HarrisBenedictActivityFactorEnum.LIGHTLY_ACTIVE;
        case 1.55:
            return HarrisBenedictActivityFactorEnum.MODERATELY_ACTIVE;
        case 1.725:
            return HarrisBenedictActivityFactorEnum.VERY_ACTIVE;
        case 1.9:
            return HarrisBenedictActivityFactorEnum.EXTRA_ACTIVE;
        case 2.3:
            return HarrisBenedictActivityFactorEnum.PROFESSIONAL_ATHLETE;
        default:
            return null;
    }
}