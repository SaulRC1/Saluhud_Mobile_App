export default class RegisterWeightHistoricalEntryDTO {
    entryDate: string;
    weight: number;

  constructor(
    entryDate: string,
    weight: number
  ) {
    this.entryDate = entryDate;
    this.weight = weight;
  }
}