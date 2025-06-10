export default class RegisterDailyStepsHistoricalEntryDTO {
    entryDate: string;
    doneSteps: number;

  constructor(
    entryDate: string,
    doneSteps: number
  ) {
    this.entryDate = entryDate;
    this.doneSteps = doneSteps;
  }
}