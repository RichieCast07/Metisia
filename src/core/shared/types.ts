export interface ProfitReport {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  marginPercentage: number;
  salesCount: number;
  expensesCount: number;
}

export interface SalesGrowth {
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  growthPercentage: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface WorkerEarningsReport {
  workerId: string;
  workerName: string;
  salesAttended: number;
  totalCommission: number;
  totalPaid: number;
  pendingBalance: number;
}

export interface ProductAvailability {
  productId: string;
  productName: string;
  available: boolean;
  maxQuantity: number;
  missingIngredients: string[];
}
