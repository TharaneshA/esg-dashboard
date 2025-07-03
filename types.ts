export interface Company {
  id: string;
  name: string;
  esgScore: number;
  riskRating: number;
  industryGroup: string;
  marketCap: number;
  shares?: number;
  avgPrice?: number;
  currentPrice?: number;
  allocation?: number;
}