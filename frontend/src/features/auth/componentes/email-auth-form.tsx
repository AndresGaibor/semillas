import { Mail, Lock, LoaderCircle } from "lucide-react";
import { useEmailAuth } from "../hooks/use-email-auth";

export interface EmailAuthFormProps {
  onSuccess: () => void;
}

export const EmailAuthForm: React.FC<EmailAuthFormProps> = ({ onSuccess }) => {
  const {
    error,
    pending,
    cuentaCreada,
    isLogin,
    errors,
    register,
    handleSubmit,
    onSubmit,
    toggleModo,
    resetCuentaCreada,
  } = useEmailAuth({ onSuccess });

  if (cuentaCreada) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <div className="text-green-600 text-lg font-bold mb-2">¡Cuenta creada!</div>
        <p className="text-sm text-gray-600 mb-4">
          Hemos enviado un correo de confirmación a tu dirección.
          Revisa tu bandeja de entrada y sigue las instrucciones.
        </p>
        <button
          onClick={resetCuentaCreada}
          className="text-green-600 text-sm font-medium hover:underline"
        >
          Volver a inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-6">
      <div>
        <label htmlFor="email" className="sr-only">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="email"
            type="email"
            placeholder="Correo electrónico"
            {...register("email")}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="sr-only">
          Contraseña
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            {...register("password")}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600"
          />
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {!isLogin && (
        <div>
          <label htmlFor="confirmarPassword" className="sr-only">
            Confirmar contraseña
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="confirmarPassword"
              type="password"
              placeholder="Confirmar contraseña"
              {...register("confirmarPassword")}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/30 focus:border-green-600"
            />
          </div>
          {(errors as Record<string, { message?: string } | undefined>)["confirmarPassword"] && (
            <p className="text-red-500 text-xs mt-1">{(errors as Record<string, { message?: string } | undefined>)["confirmarPassword"]?.message}</p>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-primario btn-full"
      >
        {pending && <LoaderCircle size={16} className="animate-spin" />}
        {isLogin ? "Iniciar sesión" : "Crear cuenta"}
      </button>

      <button
        type="button"
        onClick={toggleModo}
        className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
      >
        {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
    </form>
  );
};
