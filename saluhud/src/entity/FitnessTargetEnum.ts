export const enum FitnessTargetEnum {
    WEIGHT_LOSS = "WEIGHT_LOSS",
    WEIGHT_GAIN = "WEIGHT_GAIN",
    MAINTENANCE = "MAINTENANCE"
}

export const fromFitnessTargetName = (fitnessTargetName: string) => {
    if(fitnessTargetName === "WEIGHT_LOSS") {
        return FitnessTargetEnum.WEIGHT_LOSS;
    }

    if(fitnessTargetName === "WEIGHT_GAIN") {
        return FitnessTargetEnum.WEIGHT_GAIN;
    }

    if(fitnessTargetName === "MAINTENANCE") {
        return FitnessTargetEnum.MAINTENANCE;
    }

    return null;
}