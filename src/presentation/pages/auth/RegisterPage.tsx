import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Mail, Lock, Building2, ListFilter, Zap, BarChart3, Shield } from 'lucide-react';
import { useAuthStore } from '@/infrastructure/auth/useAuthStore';
import { BusinessType } from '@/core/domain/entities/User';
import Button from '@/presentation/components/ui/Button';
import Input from '@/presentation/components/ui/Input';
import Select from '@/presentation/components/ui/Select';
import Alert from '@/presentation/components/ui/Alert';

const businessOptions = [
  { value: BusinessType.PANADERIA, label: 'Panadería' },
  { value: BusinessType.CAFETERIA, label: 'Cafetería' },
  { value: BusinessType.DARK_KITCHEN, label: 'Dark Kitchen' },
  { value: BusinessType.FOOD_TRUCK, label: 'Food Truck' },
  { value: BusinessType.OTRO, label: 'Otro' },
];

const features = [
  { icon: Zap, text: 'Punto de venta rápido e intuitivo' },
  { icon: BarChart3, text: 'Reportes y análisis en tiempo real' },
  { icon: Shield, text: 'Control de inventario inteligente' },
];

const validators: Record<string, (v: string) => string> = {
  name: (v) => v.length >= 2 ? '' : 'Mínimo 2 caracteres',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Ingresa un correo válido',
  password: (v) => v.length >= 6 ? '' : 'Mínimo 6 caracteres',
  businessName: (v) => v.length >= 2 ? '' : 'Mínimo 2 caracteres',
};

function getPasswordStrength(pwd: string): number {
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)) score++;
  return score;
}

const strengthConfig = [
  { label: '', color: '' },
  { label: 'Débil', color: 'bg-error' },
  { label: 'Regular', color: 'bg-warning' },
  { label: 'Buena', color: 'bg-success' },
  { label: 'Fuerte', color: 'bg-success' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>(BusinessType.PANADERIA);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
  const getError = (field: string, value: string) => touched[field] ? validators[field]?.(value) ?? '' : '';
  const isValid = (field: string, value: string) => !!touched[field] && !validators[field]?.(value);
  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, businessName: true });
    const hasErrors = Object.entries({ name, email, password, businessName }).some(
      ([k, v]) => validators[k]?.(v)
    );
    if (hasErrors) return;
    await register({ name, email, password, businessName, businessType });
    if (useAuthStore.getState().isAuthenticated) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-[480px] bg-gradient-to-br from-primary to-primary-dark relative overflow-hidden flex-col items-center justify-center">
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-0 w-48 h-48 bg-white/5 rounded-full blur-lg" />
        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative z-10 text-center text-white px-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 mb-6">
            <Store size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold">Metisia</h2>
          <p className="text-white/60 mt-3 text-sm leading-relaxed max-w-[280px] mx-auto">
            Crea tu cuenta y comienza a gestionar tu negocio hoy.
          </p>

          <div className="mt-10 space-y-4 text-left">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon size={16} />
                </div>
                <span className="text-sm text-white/80">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 bg-neutral-50">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8 lg:items-start">
            <div className="lg:hidden p-3 bg-primary/10 rounded-xl mb-3">
              <Store size={28} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Crear Cuenta</h1>
            <p className="text-sm text-neutral-400 mt-1">Registra tu negocio en Metisia</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-card p-8">
            {error && <div className="mb-5"><Alert type="error" message={error} onClose={clearError} /></div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Nombre completo"
                icon={<User size={18} />}
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                error={getError('name', name)}
                success={isValid('name', name)}
                required
                placeholder="Juan Pérez"
              />
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

              {/* Password + strength indicator */}
              <div>
                <Input
                  label="Contraseña"
                  type="password"
                  icon={<Lock size={18} />}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={getError('password', password)}
                  success={isValid('password', password)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(level => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            passwordStrength >= level ? strengthConfig[passwordStrength].color : 'bg-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength > 0 && (
                      <p className={`text-xs mt-1 ${
                        passwordStrength <= 1 ? 'text-error' : passwordStrength === 2 ? 'text-warning' : 'text-success'
                      }`}>
                        {strengthConfig[passwordStrength].label}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Input
                label="Nombre del negocio"
                icon={<Building2 size={18} />}
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                onBlur={() => handleBlur('businessName')}
                error={getError('businessName', businessName)}
                success={isValid('businessName', businessName)}
                required
                placeholder="Mi Panadería"
              />

              <Select
                label="Tipo de negocio"
                icon={<ListFilter size={18} />}
                options={businessOptions}
                value={businessType}
                onChange={e => setBusinessType(e.target.value as BusinessType)}
              />

              <Button type="submit" className="w-full h-11 text-[15px]" isLoading={isLoading}>
                Crear Cuenta
              </Button>
            </form>
          </div>

          <p className="text-sm text-center text-neutral-400 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
