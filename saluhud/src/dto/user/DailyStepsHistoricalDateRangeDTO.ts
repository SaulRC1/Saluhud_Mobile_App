import DailyStepsHistoricalEntryDTO from "./DailyStepsHistoricalEntryDTO";

export default class DailyStepsHistoricalDateRangeDTO {
    startDate: string;
    endDate: string;
    entries: DailyStepsHistoricalEntryDTO[];

  constructor(
    startDate: string,
    endDate: string,
    entries: DailyStepsHistoricalEntryDTO[]
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.entries = entries;
  }
}