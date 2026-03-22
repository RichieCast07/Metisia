import { Sale, SaleItem, PaymentMethod } from '../entities/Sale';
import { MovementType } from '../entities/IngredientMovement';
import { CashRegisterStatus } from '../entities/CashRegister';
import { ISaleRepository } from '../repositories/ISaleRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { IIngredientRepository } from '../repositories/IIngredientRepository';
import { IProductIngredientRepository } from '../repositories/IProductIngredientRepository';
import { IIngredientMovementRepository } from '../repositories/IIngredientMovementRepository';
import { ICashRegisterRepository } from '../repositories/ICashRegisterRepository';
import { IPromotionRepository } from '../repositories/IPromotionRepository';
import {
  CashRegisterClosedError,
  InsufficientStockError,
  ProductNotFoundError,
  ValidationError,
} from '../../shared/errors';
import { PromotionType, PromotionScope } from '../entities/Promotion';

interface RegisterSaleInput {
  businessId: string;
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: PaymentMethod;
  workerId?: string;
  promotionId?: string;
  notes?: string;
}

export function registerSale(
  saleRepo: ISaleRepository,
  productRepo: IProductRepository,
  ingredientRepo: IIngredientRepository,
  recipeRepo: IProductIngredientRepository,
  movementRepo: IIngredientMovementRepository,
  cashRepo: ICashRegisterRepository,
  promotionRepo: IPromotionRepository,
  input: RegisterSaleInput
): Sale {
  if (input.items.length === 0) {
    throw new ValidationError('La venta debe tener al menos un producto');
  }

  const cashRegister = cashRepo.getCurrent(input.businessId);
  if (!cashRegister || cashRegister.status === CashRegisterStatus.CERRADA) {
    throw new CashRegisterClosedError();
  }

  const saleItems: SaleItem[] = [];
  let subtotal = 0;

  for (const item of input.items) {
    const product = productRepo.getById(item.productId);
    if (!product) throw new ProductNotFoundError(item.productId);

    const recipe = recipeRepo.getByProductId(item.productId);
    for (const r of recipe) {
      const ingredient = ingredientRepo.getById(r.ingredientId);
      if (!ingredient) throw new InsufficientStockError(`Insumo no encontrado para ${product.name}`);
      const needed = r.quantity * item.quantity;
      if (ingredient.stock < needed) throw new InsufficientStockError(ingredient.name);
    }

    const itemSubtotal = product.price * item.quantity;
    saleItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal: itemSubtotal,
    });
    subtotal += itemSubtotal;
  }

  // Apply promotion discount
  let discount = 0;
  if (input.promotionId) {
    const promotion = promotionRepo.getById(input.promotionId);
    if (promotion && promotion.isActive) {
      const now = new Date();
      const validStart = !promotion.startsAt || new Date(promotion.startsAt) <= now;
      const validEnd = !promotion.endsAt || new Date(promotion.endsAt) >= now;

      if (validStart && validEnd) {
        if (promotion.type === PromotionType.PORCENTAJE) {
          if (promotion.applicableTo === PromotionScope.TODO) {
            discount = subtotal * (promotion.value / 100);
          } else if (promotion.applicableTo === PromotionScope.PRODUCTO && promotion.targetId) {
            const targetItem = saleItems.find(i => i.productId === promotion.targetId);
            if (targetItem) discount = targetItem.subtotal * (promotion.value / 100);
          } else if (promotion.applicableTo === PromotionScope.CATEGORIA && promotion.targetId) {
            const products = input.items.map(i => productRepo.getById(i.productId)).filter(Boolean);
            const catItems = saleItems.filter(si => {
              const p = products.find(pr => pr!.id === si.productId);
              return p && p.category === promotion.targetId;
            });
            discount = catItems.reduce((sum, i) => sum + i.subtotal, 0) * (promotion.value / 100);
          }
        } else if (promotion.type === PromotionType.MONTO_FIJO) {
          discount = Math.min(promotion.value, subtotal);
        } else if (promotion.type === PromotionType.DOS_POR_UNO && promotion.targetId) {
          const targetItem = saleItems.find(i => i.productId === promotion.targetId);
          if (targetItem && targetItem.quantity >= 2) {
            const freeItems = Math.floor(targetItem.quantity / 2);
            discount = freeItems * targetItem.unitPrice;
          }
        }
      }
    }
  }

  const total = subtotal - discount;

  // Consume ingredients
  for (const item of input.items) {
    const recipe = recipeRepo.getByProductId(item.productId);
    for (const r of recipe) {
      const ingredient = ingredientRepo.getById(r.ingredientId);
      if (!ingredient) continue;
      const needed = r.quantity * item.quantity;
      ingredientRepo.updateStock(r.ingredientId, ingredient.stock - needed);
      movementRepo.create({
        businessId: input.businessId,
        ingredientId: r.ingredientId,
        type: MovementType.SALIDA,
        quantity: needed,
        reason: `Venta automática`,
        date: new Date(),
      });
    }
  }

  const sale = saleRepo.create({
    businessId: input.businessId,
    items: saleItems,
    subtotal,
    discount,
    total,
    paymentMethod: input.paymentMethod,
    workerId: input.workerId,
    promotionId: input.promotionId,
    cashRegisterId: cashRegister.id,
    notes: input.notes,
  });

  // Update cash register
  cashRepo.update(cashRegister.id, {
    openingAmount: cashRegister.openingAmount,
  });

  return sale;
}

export function getSalesByPeriod(
  repo: ISaleRepository,
  businessId: string,
  from: Date,
  to: Date
): Sale[] {
  return repo.getByDateRange(businessId, from, to);
}

export function cancelSale(
  saleRepo: ISaleRepository,
  ingredientRepo: IIngredientRepository,
  recipeRepo: IProductIngredientRepository,
  movementRepo: IIngredientMovementRepository,
  saleId: string,
  businessId: string
): void {
  const sale = saleRepo.getById(saleId);
  if (!sale) throw new ValidationError('Venta no encontrada');

  // Restore ingredients
  for (const item of sale.items) {
    const recipe = recipeRepo.getByProductId(item.productId);
    for (const r of recipe) {
      const ingredient = ingredientRepo.getById(r.ingredientId);
      if (!ingredient) continue;
      const restored = r.quantity * item.quantity;
      ingredientRepo.updateStock(r.ingredientId, ingredient.stock + restored);
      movementRepo.create({
        businessId,
        ingredientId: r.ingredientId,
        type: MovementType.ENTRADA,
        quantity: restored,
        reason: `Cancelación de venta`,
        date: new Date(),
      });
    }
  }

  saleRepo.delete(saleId);
}
