export default class WeightHistoricalEntryDTO {
  id: bigint;
  entryDate: string;
  weight: number;
  height: number;
  kilocaloriesObjective: number;

  constructor(
    id: bigint,
    entryDate: string,
    weight: number,
    height: number,
    kilocaloriesObjective: number,
  ) {
    this.id = id;
    this.entryDate = entryDate;
    this.weight = weight;
    this.height = height;
    this.kilocaloriesObjective = kilocaloriesObjective;
  }
}
