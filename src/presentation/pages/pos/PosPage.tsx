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
        <div className="flex-1 p-8 overflow-y-auto">
          <SearchInput value={vm.search} onChange={vm.setSearch} placeholder="Buscar producto..." />
          {vm.filteredProducts.length === 0 ? (
            <EmptyState title="Sin productos" description="Agrega productos desde el módulo de Productos" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
              {vm.filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => vm.addToCart(p)}
                  className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-primary/40 hover:shadow-elevated transition-all duration-200 cursor-pointer group shadow-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight">{p.name}</p>
                    <div className="p-1.5 rounded-xl bg-primary-light ring-1 ring-primary/20 group-hover:bg-primary/15 transition-colors">
                      <Plus size={14} className="text-primary" />
                    </div>
                  </div>
                  <Badge variant="default">{p.category}</Badge>
                  <p className="text-lg font-bold text-slate-900 mt-3">{fmt(p.price)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cart sidebar */}
        <div className="w-full lg:w-[400px] border-l border-slate-200 bg-white flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-light rounded-xl ring-1 ring-primary/20">
                <ShoppingCart size={18} className="text-primary" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Carrito ({vm.cart.length})</h2>
            </div>
          </div>

          {vm.error && <div className="px-6 pt-4"><Alert type="error" message={vm.error} onClose={() => vm.setError(null)} /></div>}
          {vm.success && <div className="px-6 pt-4"><Alert type="success" message={vm.success} /></div>}

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2.5">
            {vm.cart.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-16">Carrito vacío</p>
            ) : (
              vm.cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 bg-slate-100 rounded-xl p-3.5 hover:bg-slate-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{item.product.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{fmt(item.product.price)} c/u</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white rounded-lg border border-slate-200 shadow-xs px-1.5 py-1">
                    <button onClick={() => vm.updateQuantity(item.product.id, item.quantity - 1)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 cursor-pointer"><Minus size={13} /></button>
                    <span className="text-xs font-bold w-6 text-center text-slate-700">{item.quantity}</span>
                    <button onClick={() => vm.updateQuantity(item.product.id, item.quantity + 1)} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 cursor-pointer"><Plus size={13} /></button>
                  </div>
                  <p className="text-sm font-bold text-slate-900 w-20 text-right">{fmt(item.product.price * item.quantity)}</p>
                  <button onClick={() => vm.removeFromCart(item.product.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"><Trash2 size={14} /></button>
                </div>
              ))
            )}
          </div>

          {vm.cart.length > 0 && (
            <div className="border-t border-slate-200 p-6 space-y-5">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-slate-500">Total</span>
                <span className="text-[28px] font-bold leading-none text-slate-900">{fmt(vm.subtotal)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Button variant="primary" onClick={() => vm.checkout(PaymentMethod.EFECTIVO)}>Efectivo</Button>
                <Button variant="outline" onClick={() => vm.checkout(PaymentMethod.TARJETA)}>Tarjeta</Button>
                <Button variant="outline" onClick={() => vm.checkout(PaymentMethod.TRANSFERENCIA)}>Transferencia</Button>
                <Button variant="ghost" onClick={vm.clearCart}>Limpiar</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
