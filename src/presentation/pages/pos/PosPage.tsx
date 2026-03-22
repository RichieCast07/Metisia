import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import Header from '@/presentation/components/layout/Header';
import SearchInput from '@/presentation/components/ui/SearchInput';
import Button from '@/presentation/components/ui/Button';
import Alert from '@/presentation/components/ui/Alert';
import Badge from '@/presentation/components/ui/Badge';
import EmptyState from '@/presentation/components/ui/EmptyState';
import { PaymentMethod } from '@/core/domain/entities/Sale';
import { usePosViewModel } from '@/presentation/viewmodels/usePosViewModel';

function fmt(n: number) {
  return `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PosPage() {
  const vm = usePosViewModel();

  return (
    <>
      <Header title="Punto de Venta" subtitle="Registra ventas rápidamente" />
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Product grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          <SearchInput value={vm.search} onChange={vm.setSearch} placeholder="Buscar producto..." />
          {vm.filteredProducts.length === 0 ? (
            <EmptyState title="Sin productos" description="Agrega productos desde el módulo de Productos" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
              {vm.filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => vm.addToCart(p)}
                  className="bg-white border border-neutral-200/60 rounded-2xl p-4 text-left hover:border-primary/30 hover:shadow-card-hover transition-all duration-200 cursor-pointer group shadow-card"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-neutral-800 group-hover:text-primary transition-colors leading-tight">{p.name}</p>
                    <div className="p-1 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors">
                      <Plus size={14} className="text-primary" />
                    </div>
                  </div>
                  <Badge variant="default">{p.category}</Badge>
                  <p className="text-lg font-bold text-neutral-900 mt-3">{fmt(p.price)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cart sidebar */}
        <div className="w-full lg:w-[380px] border-l border-neutral-100 bg-white flex flex-col">
          <div className="px-5 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <ShoppingCart size={16} className="text-primary" />
              </div>
              <h2 className="text-sm font-bold text-neutral-900">Carrito ({vm.cart.length})</h2>
            </div>
          </div>

          {vm.error && <div className="px-5 pt-3"><Alert type="error" message={vm.error} onClose={() => vm.setError(null)} /></div>}
          {vm.success && <div className="px-5 pt-3"><Alert type="success" message={vm.success} /></div>}

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
            {vm.cart.length === 0 ? (
              <p className="text-sm text-neutral-300 text-center py-12">Carrito vacío</p>
            ) : (
              vm.cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 bg-neutral-50 rounded-xl p-3 hover:bg-neutral-100/70 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-neutral-400">{fmt(item.product.price)} c/u</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white rounded-lg border border-neutral-200 px-1 py-0.5">
                    <button onClick={() => vm.updateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded hover:bg-neutral-100 text-neutral-400 cursor-pointer"><Minus size={13} /></button>
                    <span className="text-xs font-bold w-5 text-center text-neutral-700">{item.quantity}</span>
                    <button onClick={() => vm.updateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded hover:bg-neutral-100 text-neutral-400 cursor-pointer"><Plus size={13} /></button>
                  </div>
                  <p className="text-sm font-bold text-neutral-900 w-20 text-right">{fmt(item.product.price * item.quantity)}</p>
                  <button onClick={() => vm.removeFromCart(item.product.id)} className="p-1.5 text-neutral-300 hover:text-error hover:bg-error/5 rounded-lg cursor-pointer transition-colors"><Trash2 size={14} /></button>
                </div>
              ))
            )}
          </div>

          {vm.cart.length > 0 && (
            <div className="border-t border-neutral-100 p-5 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-neutral-500">Total</span>
                <span className="text-2xl font-bold text-neutral-900">{fmt(vm.subtotal)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="primary" onClick={() => vm.checkout(PaymentMethod.EFECTIVO)} className="text-xs">Efectivo</Button>
                <Button variant="outline" onClick={() => vm.checkout(PaymentMethod.TARJETA)} className="text-xs">Tarjeta</Button>
                <Button variant="outline" onClick={() => vm.checkout(PaymentMethod.TRANSFERENCIA)} className="text-xs">Transferencia</Button>
                <Button variant="ghost" onClick={vm.clearCart} className="text-xs">Limpiar</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
