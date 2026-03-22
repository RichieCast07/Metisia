import { useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import { Product } from '@/core/domain/entities/Product';
import { PaymentMethod } from '@/core/domain/entities/Sale';
import { registerSale } from '@/core/domain/usecases/saleUseCases';
import { LocalStorageSaleRepository } from '@/infrastructure/repositories/LocalStorageSaleRepository';
import { LocalStorageProductRepository } from '@/infrastructure/repositories/LocalStorageProductRepository';
import { LocalStorageIngredientRepository } from '@/infrastructure/repositories/LocalStorageIngredientRepository';
import { LocalStorageProductIngredientRepository } from '@/infrastructure/repositories/LocalStorageProductIngredientRepository';
import { LocalStorageIngredientMovementRepository } from '@/infrastructure/repositories/LocalStorageIngredientMovementRepository';
import { LocalStorageCashRegisterRepository } from '@/infrastructure/repositories/LocalStorageCashRegisterRepository';
import { LocalStoragePromotionRepository } from '@/infrastructure/repositories/LocalStoragePromotionRepository';

const saleRepo = new LocalStorageSaleRepository();
const productRepo = new LocalStorageProductRepository();
const ingredientRepo = new LocalStorageIngredientRepository();
const recipeRepo = new LocalStorageProductIngredientRepository();
const movementRepo = new LocalStorageIngredientMovementRepository();
const cashRepo = new LocalStorageCashRegisterRepository();
const promotionRepo = new LocalStoragePromotionRepository();

interface CartItem {
  product: Product;
  quantity: number;
}

export function usePosViewModel() {
  const user = useAuthStore(s => s.user);
  const businessId = user?.id ?? '';
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const products = useMemo(() => productRepo.getAll(businessId).filter(p => p.isActive), [businessId]);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [products, search]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const checkout = useCallback((paymentMethod: PaymentMethod) => {
    setError(null);
    setSuccess(null);
    try {
      registerSale(saleRepo, productRepo, ingredientRepo, recipeRepo, movementRepo, cashRepo, promotionRepo, {
        businessId,
        items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity })),
        paymentMethod,
      });
      setCart([]);
      setSuccess('¡Venta registrada exitosamente!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la venta');
    }
  }, [cart, businessId]);

  return {
    cart, search, setSearch, error, setError, success,
    filteredProducts, subtotal, addToCart, updateQuantity, removeFromCart, clearCart, checkout,
  };
}
