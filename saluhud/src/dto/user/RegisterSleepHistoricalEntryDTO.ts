export default class RegisterSleepHistoricalEntryDTO {
    entryDate: string;
    hoursSlept: number;
    minutesSlept: number;

  constructor(
    entryDate: string,
    hoursSlept: number,
    minutesSlept: number
  ) {
    this.entryDate = entryDate;
    this.hoursSlept = hoursSlept;
    this.minutesSlept = minutesSlept;
  }
}