import { useState, useCallback, useEffect } from 'react';
import { productApi, ApiProduct } from '@/infrastructure/api/productApi';
import { cashRegisterApi, ApiCashRegister } from '@/infrastructure/api/cashRegisterApi';
import { saleApi, CreateSaleBody } from '@/infrastructure/api/saleApi';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';

interface CartItem {
  product: ApiProduct;
  quantity: number;
}

export function usePosViewModel() {
  const user = useAuthStore(s => s.user);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [cashRegister, setCashRegister] = useState<ApiCashRegister | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [allProducts, currentRegister] = await Promise.all([
          productApi.list(),
          cashRegisterApi.getCurrent(),
        ]);
        setProducts(allProducts.filter(p => p.is_active));
        setCashRegister(currentRegister);
      } catch {
        setError('Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredProducts = search.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const addToCart = useCallback((product: ApiProduct) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
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

  const checkout = useCallback(async (paymentMethod: string) => {
    setError(null);
    setSuccess(null);
    if (!cashRegister) {
      setError('No hay una caja abierta. Debe abrir la caja antes de registrar ventas.');
      return;
    }
    if (cart.length === 0) {
      setError('El carrito esta vacio.');
      return;
    }
    try {
      const body: CreateSaleBody = {
        cash_register_id: cashRegister.id,
        payment_method: paymentMethod,
        subtotal,
        discount: 0,
        total: subtotal,
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price,
          subtotal: item.product.price * item.quantity,
        })),
      };
      await saleApi.create(body);
      setCart([]);
      setSuccess('Venta registrada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la venta');
    }
  }, [cart, cashRegister, subtotal]);

  return {
    cart,
    search,
    setSearch,
    error,
    setError,
    success,
    isLoading,
    filteredProducts,
    subtotal,
    cashRegister,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkout,
  };
}
