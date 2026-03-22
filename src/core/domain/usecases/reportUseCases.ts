import { ISaleRepository } from '../repositories/ISaleRepository';
import { IExpenseRepository } from '../repositories/IExpenseRepository';
import { ProfitReport, SalesGrowth } from '../../shared/types';
import { startOfDay, endOfDay, subDays, subWeeks, subMonths } from 'date-fns';

export function getProfitReport(
  saleRepo: ISaleRepository,
  expenseRepo: IExpenseRepository,
  businessId: string,
  from: Date,
  to: Date
): ProfitReport {
  const sales = saleRepo.getByDateRange(businessId, from, to);
  const expenses = expenseRepo.getByDateRange(businessId, from, to);

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses;
  const marginPercentage = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  return {
    totalSales,
    totalExpenses,
    netProfit,
    marginPercentage,
    salesCount: sales.length,
    expensesCount: expenses.length,
  };
}

export function getSalesGrowth(
  saleRepo: ISaleRepository,
  businessId: string
): SalesGrowth {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const yesterdayStart = startOfDay(subDays(now, 1));
  const yesterdayEnd = endOfDay(subDays(now, 1));

  const lastWeekStart = startOfDay(subWeeks(now, 1));
  const twoWeeksAgoStart = startOfDay(subWeeks(now, 2));

  const lastMonthStart = startOfDay(subMonths(now, 1));
  const twoMonthsAgoStart = startOfDay(subMonths(now, 2));

  const todaySales = saleRepo.getByDateRange(businessId, todayStart, todayEnd);
  const yesterdaySales = saleRepo.getByDateRange(businessId, yesterdayStart, yesterdayEnd);
  const lastWeekSales = saleRepo.getByDateRange(businessId, lastWeekStart, todayEnd);
  const prevWeekSales = saleRepo.getByDateRange(businessId, twoWeeksAgoStart, lastWeekStart);
  const lastMonthSales = saleRepo.getByDateRange(businessId, lastMonthStart, todayEnd);
  const prevMonthSales = saleRepo.getByDateRange(businessId, twoMonthsAgoStart, lastMonthStart);

  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
  const yesterdayTotal = yesterdaySales.reduce((sum, s) => sum + s.total, 0);
  const lastWeekTotal = lastWeekSales.reduce((sum, s) => sum + s.total, 0);
  const prevWeekTotal = prevWeekSales.reduce((sum, s) => sum + s.total, 0);
  const lastMonthTotal = lastMonthSales.reduce((sum, s) => sum + s.total, 0);
  const prevMonthTotal = prevMonthSales.reduce((sum, s) => sum + s.total, 0);

  const calcGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    today: todayTotal,
    yesterday: yesterdayTotal,
    lastWeek: lastWeekTotal,
    lastMonth: lastMonthTotal,
    growthPercentage: {
      daily: calcGrowth(todayTotal, yesterdayTotal),
      weekly: calcGrowth(lastWeekTotal, prevWeekTotal),
      monthly: calcGrowth(lastMonthTotal, prevMonthTotal),
    },
  };
}
