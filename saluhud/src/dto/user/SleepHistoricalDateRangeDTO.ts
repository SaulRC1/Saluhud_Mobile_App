import SleepHistoricalEntryDTO from "./SleepHistoricalEntryDTO";

export default class SleepHistoricalDateRangeDTO {
    startDate: string;
    endDate: string;
    entries: SleepHistoricalEntryDTO[];

  constructor(
    startDate: string,
    endDate: string,
    entries: SleepHistoricalEntryDTO[]
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.entries = entries;
  }
}