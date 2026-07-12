import * as React from "react";
import { FormField } from "./form-field";

export interface PropiedadesCampoFormulario extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  etiqueta?: string;
  mensajeAyuda?: string;
  mensajeError?: string;
  requerido?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** @deprecated Usar FormField. Este adaptador mantiene la API histórica. */
export const CampoFormulario: React.FC<PropiedadesCampoFormulario> = ({
  id,
  etiqueta = "Campo",
  mensajeAyuda,
  mensajeError,
  requerido = false,
  className,
  children,
  ...propiedades
}) => (
  <FormField id={id} label={etiqueta} requerido={requerido} error={mensajeError} textoAyuda={mensajeAyuda} className={className} {...propiedades}>
    {children}
  </FormField>
);

CampoFormulario.displayName = "CampoFormulario";
