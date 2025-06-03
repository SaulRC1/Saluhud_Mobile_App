export default class SaveSaluhudUserFitnessDataDTO {
  weight: number;
  height: number;
  biologicalSex: string;
  fitnessTarget: string;
  age: number;
  leanBodyMassPercentage: number;
  bodyFatPercentage: number;
  bodyFatWeight: number;
  leanBodyMassWeight: number;
  activityFactor: number;

  constructor(
    weight: number,
    height: number,
    biologicalSex: string,
    fitnessTarget: string,
    age: number,
    leanBodyMassPercentage: number,
    bodyFatPercentage: number,
    bodyFatWeight: number,
    leanBodyMassWeight: number,
    activityFactor: number,
  ) {
    this.weight = weight;
    this.height = height;
    this.biologicalSex = biologicalSex;
    this.fitnessTarget = fitnessTarget;
    this.age = age;
    this.leanBodyMassPercentage = leanBodyMassPercentage;
    this.bodyFatPercentage = bodyFatPercentage;
    this.bodyFatWeight = bodyFatWeight;
    this.leanBodyMassWeight = leanBodyMassWeight;
    this.activityFactor = activityFactor;
  }
}
