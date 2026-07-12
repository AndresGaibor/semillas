const TAMANO = 1080;

export async function crearTarjetaInsignia(nombreInsignia: string, imagenUrl: string): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = TAMANO;
  canvas.height = TAMANO;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No se pudo crear la tarjeta de la insignia");
  }

  const gradiente = ctx.createLinearGradient(0, 0, TAMANO, TAMANO);
  gradiente.addColorStop(0, "#F4F0FF");
  gradiente.addColorStop(.52, "#FFFFFF");
  gradiente.addColorStop(1, "#ECFDF3");
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, TAMANO, TAMANO);

  ctx.fillStyle = "rgba(108, 53, 232, 0.08)";
  ctx.beginPath();
  ctx.arc(930, 125, 190, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(67, 160, 71, 0.08)";
  ctx.beginPath();
  ctx.arc(100, 960, 240, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = "#43A047";
  ctx.font = "800 42px Nunito, Arial, sans-serif";
  ctx.fillText("SEMILLAS", TAMANO / 2, 105);

  ctx.fillStyle = "#172033";
  ctx.font = "900 68px Nunito, Arial, sans-serif";
  ctx.fillText("¡Nueva insignia!", TAMANO / 2, 205);

  await dibujarInsignia(ctx, imagenUrl);

  ctx.fillStyle = "#6D35E8";
  ctx.font = "900 62px Nunito, Arial, sans-serif";
  escribirTextoCentrado(ctx, nombreInsignia, TAMANO / 2, 745, 820, 72);

  ctx.fillStyle = "#475569";
  ctx.font = "700 34px Nunito, Arial, sans-serif";
  ctx.fillText("Sigue aprendiendo, creciendo y compartiendo.", TAMANO / 2, 910);

  ctx.fillStyle = "#2E7D32";
  ctx.font = "800 28px Nunito, Arial, sans-serif";
  ctx.fillText("Crecer en la Palabra, vivir Su verdad", TAMANO / 2, 980);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((resultado) => {
      if (resultado) resolve(resultado);
      else reject(new Error("No se pudo exportar la tarjeta de la insignia"));
    }, "image/png", .95);
  });

  return new File([blob], `insignia-${normalizarNombre(nombreInsignia)}.png`, { type: "image/png" });
}

export function descargarTarjetaInsignia(archivo: File): void {
  const url = URL.createObjectURL(archivo);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = archivo.name;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

async function dibujarInsignia(ctx: CanvasRenderingContext2D, imagenUrl: string): Promise<void> {
  const centroX = TAMANO / 2;
  const centroY = 470;
  const radio = 220;

  ctx.save();
  ctx.shadowColor = "rgba(30, 41, 59, 0.18)";
  ctx.shadowBlur = 45;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(centroX, centroY, radio + 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  try {
    const imagen = await cargarImagen(imagenUrl);
    const lado = radio * 2;
    ctx.drawImage(imagen, centroX - radio, centroY - radio, lado, lado);
  } catch {
    ctx.fillStyle = "#F4F0FF";
    ctx.beginPath();
    ctx.arc(centroX, centroY, radio, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6D35E8";
    ctx.font = "900 180px Arial, sans-serif";
    ctx.fillText("★", centroX, centroY + 60);
  }
}

function cargarImagen(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imagen = new Image();
    imagen.crossOrigin = "anonymous";
    imagen.onload = () => resolve(imagen);
    imagen.onerror = () => reject(new Error("No se pudo cargar la imagen de la insignia"));
    imagen.src = src;
  });
}

function escribirTextoCentrado(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  anchoMaximo: number,
  interlineado: number,
): void {
  const palabras = texto.split(/\s+/);
  const lineas: string[] = [];
  let linea = "";

  for (const palabra of palabras) {
    const candidata = linea ? `${linea} ${palabra}` : palabra;
    if (ctx.measureText(candidata).width > anchoMaximo && linea) {
      lineas.push(linea);
      linea = palabra;
    } else {
      linea = candidata;
    }
  }
  if (linea) lineas.push(linea);

  lineas.slice(0, 2).forEach((lineaActual, indice) => {
    ctx.fillText(lineaActual, x, y + indice * interlineado);
  });
}

function normalizarNombre(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
