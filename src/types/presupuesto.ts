
export interface ComparisonDifference {
  itemId: string;
  descripcion: string;
  version1: {
    precioUnitario: number;
    cantidad: number;
  } | string;
  version2: {
    precioUnitario: number;
    cantidad: number;
  } | string;
}

export interface CostVariation {
  variance: number;
  percentageChange: number;
}