import BodyCompositionDTO from "@src/dto/user/BodyCompositionDTO";

export default class SaluhudUserFitnessDataDTO {
  weight: number;
  height: number;
  biologicalSex: string;
  fitnessTarget: string;
  age: number;
  bodyComposition: BodyCompositionDTO;
  recommendedDailyWaterLiters: number;
  recommendedSleepHours: number;
  recommendedDailySteps: number;
  dailyKilocaloriesObjective: number;
  fitnessTargetRecommendedKilocalories: number;
  bodyMassIndex: number;
  activityFactor: number;

  constructor(weight: number, height: number, biologicalSex: string, fitnessTarget: string, age: number, 
    bodyComposition: BodyCompositionDTO, fitnessTargetRecommendedKilocalories: number,
    recommendedDailyWaterLiters: number, recommendedSleepHours: number, recommendedDailySteps: number, 
    dailyKilocaloriesObjective: number, bodyMassIndex: number, activityFactor: number) {
        
    this.weight = weight;
    this.height = height;
    this.biologicalSex = biologicalSex;
    this.fitnessTarget = fitnessTarget;
    this.age = age;
    this.bodyComposition = bodyComposition;
    this.recommendedDailyWaterLiters = recommendedDailyWaterLiters;
    this.recommendedSleepHours = recommendedSleepHours;
    this.recommendedDailySteps = recommendedDailySteps;
    this.dailyKilocaloriesObjective = dailyKilocaloriesObjective;
    this.fitnessTargetRecommendedKilocalories = fitnessTargetRecommendedKilocalories;
    this.bodyMassIndex = bodyMassIndex;
    this.activityFactor = activityFactor;
  }
}