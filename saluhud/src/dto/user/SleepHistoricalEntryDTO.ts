export default class SleepHistoricalEntryDTO {
  id: bigint;
  entryDate: string;
  hoursSlept: number;
  minutesSlept: number;
  evaluation: string;

  constructor(
    id: bigint,
    entryDate: string,
    hoursSlept: number,
    minutesSlept: number,
    evaluation: string,
  ) {
    this.id = id;
    this.entryDate = entryDate;
    this.hoursSlept = hoursSlept;
    this.minutesSlept = minutesSlept;
    this.evaluation = evaluation;
  }
}