import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, Zap, BarChart3, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import Button from '@/presentation/components/ui/Button';
import Input from '@/presentation/components/ui/Input';
import Alert from '@/presentation/components/ui/Alert';

const features = [
  { icon: Zap, text: 'Punto de venta rápido e intuitivo' },
  { icon: BarChart3, text: 'Reportes y análisis en tiempo real' },
  { icon: Shield, text: 'Control de inventario inteligente' },
];

const validators: Record<string, (v: string) => string> = {
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Ingresa un correo válido',
  password: (v) => v.length >= 1 ? '' : 'Ingresa tu contraseña',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
  const getError = (field: string, value: string) => touched[field] ? validators[field]?.(value) ?? '' : '';
  const isValid = (field: string, value: string) => !!touched[field] && !validators[field]?.(value);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const hasErrors = Object.entries({ email, password }).some(
      ([k, v]) => validators[k]?.(v)
    );
    if (hasErrors) return;
    await login(email, password);
    if (useAuthStore.getState().isAuthenticated) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden flex-col items-center justify-center">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Decorative blurs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-28 -right-28 w-80 h-80 bg-blue-400/8 rounded-full blur-3xl" />
        {/* Bottom glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative z-10 text-center text-white px-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 mb-6 shadow-lg">
            <Store size={32} strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Metisia</h2>
          <p className="text-white/40 mt-2 text-sm leading-relaxed max-w-[260px] mx-auto">
            Gestiona tu negocio de forma simple, rápida e inteligente.
          </p>

          <div className="mt-10 space-y-3.5 text-left">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center">
                  <Icon size={15} className="text-white/70" />
                </div>
                <span className="text-sm text-white/60 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8 lg:items-start">
            <div className="lg:hidden p-3 bg-blue-50 rounded-xl ring-1 ring-blue-100 mb-4">
              <Store size={24} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Bienvenido de vuelta</h1>
            <p className="text-sm text-slate-500 mt-2">Ingresa a tu cuenta para continuar</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8">
            {error && <div className="mb-5"><Alert type="error" message={error} onClose={clearError} /></div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Correo electrónico"
                type="email"
                icon={<Mail size={18} />}
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                error={getError('email', email)}
                success={isValid('email', email)}
                required
                placeholder="tu@correo.com"
              />
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                icon={<Lock size={18} />}
                suffix={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(p => !p)}
                    className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                error={getError('password', password)}
                success={isValid('password', password)}
                required
                placeholder="••••••••"
              />
              <Button type="submit" className="w-full h-11 text-sm" isLoading={isLoading}>
                Iniciar Sesión
              </Button>
            </form>
          </div>

          <p className="text-sm text-center text-slate-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
