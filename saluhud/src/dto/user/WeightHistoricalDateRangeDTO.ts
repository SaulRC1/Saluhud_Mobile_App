import WeightHistoricalEntryDTO from "./WeightHistoricalEntryDTO";

export default class WeightHistoricalDateRangeDTO {
    startDate: string;
    endDate: string;
    entries: WeightHistoricalEntryDTO[];

  constructor(
    startDate: string,
    endDate: string,
    entries: WeightHistoricalEntryDTO[]
  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.entries = entries;
  }
}