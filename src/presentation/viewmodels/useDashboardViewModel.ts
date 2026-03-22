import { useMemo } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import { LocalStorageSaleRepository } from '@/infrastructure/repositories/LocalStorageSaleRepository';
import { LocalStorageProductRepository } from '@/infrastructure/repositories/LocalStorageProductRepository';
import { LocalStorageExpenseRepository } from '@/infrastructure/repositories/LocalStorageExpenseRepository';
import { LocalStorageCashRegisterRepository } from '@/infrastructure/repositories/LocalStorageCashRegisterRepository';
import { LocalStorageIngredientRepository } from '@/infrastructure/repositories/LocalStorageIngredientRepository';
import { Sale } from '@/core/domain/entities/Sale';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth } from 'date-fns';

const saleRepo = new LocalStorageSaleRepository();
const productRepo = new LocalStorageProductRepository();
const expenseRepo = new LocalStorageExpenseRepository();
const cashRepo = new LocalStorageCashRegisterRepository();
const ingredientRepo = new LocalStorageIngredientRepository();

export function useDashboardViewModel() {
  const user = useAuthStore(s => s.user);
  const businessId = user?.id ?? '';

  return useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const yesterday = subDays(todayStart, 1);

    const todaySales = saleRepo.getByDateRange(businessId, todayStart, todayEnd);
    const yesterdaySales = saleRepo.getByDateRange(businessId, yesterday, endOfDay(yesterday));
    const monthSales = saleRepo.getByDateRange(businessId, monthStart, monthEnd);
    const monthExpenses = expenseRepo.getByDateRange(businessId, monthStart, monthEnd);

    const totalToday = todaySales.reduce((sum: number, s: Sale) => sum + s.total, 0);
    const totalYesterday = yesterdaySales.reduce((sum: number, s: Sale) => sum + s.total, 0);
    const salesTrend = totalYesterday > 0 ? ((totalToday - totalYesterday) / totalYesterday) * 100 : 0;

    const totalMonth = monthSales.reduce((sum: number, s: Sale) => sum + s.total, 0);
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = totalMonth - totalExpenses;

    const products = productRepo.getAll(businessId);
    const ingredients = ingredientRepo.getAll(businessId);
    const cashRegister = cashRepo.getCurrent(businessId);
    const lowStockIngredients = ingredients.filter(i => i.stock <= i.minStock);

    return {
      businessName: user?.businessName ?? '',
      todaySalesCount: todaySales.length,
      todaySalesTotal: totalToday,
      salesTrend: Math.round(salesTrend),
      monthSalesTotal: totalMonth,
      monthExpensesTotal: totalExpenses,
      monthProfit: profit,
      productCount: products.length,
      ingredientCount: ingredients.length,
      lowStockCount: lowStockIngredients.length,
      lowStockIngredients,
      isCashOpen: !!cashRegister,
      recentSales: todaySales.slice(-5).reverse(),
    };
  }, [businessId, user?.businessName]);
}
