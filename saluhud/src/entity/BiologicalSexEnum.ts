export const enum BiologicalSexEnum {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export const fromBiologicalSexName = (sexName: string) => {
    if(sexName === "MALE") {
        return BiologicalSexEnum.MALE;
    }

    if(sexName === "FEMALE") {
        return BiologicalSexEnum.FEMALE;
    }

    return null;
}