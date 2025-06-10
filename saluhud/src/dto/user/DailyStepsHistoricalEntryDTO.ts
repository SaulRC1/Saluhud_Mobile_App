export default class DailyStepsHistoricalEntryDTO {
  id: bigint;
  entryDate: string;
  doneSteps: number;
  kilocaloriesBurned: number;
  evaluation: string;

  constructor(
    id: bigint,
    entryDate: string,
    doneSteps: number,
    kilocaloriesBurned: number,
    evaluation: string,
  ) {
    this.id = id;
    this.entryDate = entryDate;
    this.doneSteps = doneSteps;
    this.kilocaloriesBurned = kilocaloriesBurned;
    this.evaluation = evaluation;
  }
}