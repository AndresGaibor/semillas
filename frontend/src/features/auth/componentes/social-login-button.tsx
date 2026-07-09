import * as React from "react";

export interface SocialLoginButtonProps {
  onClick?: () => void;
  logo: string;
  label: string;
  tipo: "google" | "facebook" | "guest";
  guestNote?: string;
  disabled?: boolean;
  isPending?: boolean;
}

export const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  onClick,
  logo,
  label,
  tipo,
  guestNote,
  disabled,
  isPending,
}) => {
  const getButtonClass = () => {
    switch (tipo) {
      case "google":
        return "login-social__btn--google";
      case "facebook":
        return "login-social__btn--facebook";
      case "guest":
        return "login-social__btn--guest relative overflow-hidden";
      default:
        return "";
    }
  };

  if (tipo === "guest") {
    return (
      <button 
        type="button" 
        className={`login-social__btn ${getButtonClass()}`} 
        onClick={onClick}
        disabled={disabled || isPending}
      >
        <img src={logo} alt="" className="login-social__icon" width="36" height="36" />
        <div className="login-social__guest-text text-left flex flex-col items-start ml-2">
          <span className="login-social__guest-title">{isPending ? "Entrando..." : label}</span>
          {guestNote && <span className="login-social__guest-note">{guestNote}</span>}
        </div>
      </button>
    );
  }

  return (
    <button 
      type="button" 
      className={`login-social__btn ${getButtonClass()} ${disabled || isPending ? "cursor-not-allowed opacity-55" : ""}`} 
      onClick={onClick}
      disabled={disabled || isPending}
    >
      <img src={logo} alt="" className="login-social__icon" width="22" height="22" />
      <span>{isPending ? "Conectando..." : label}</span>
    </button>
  );
};
