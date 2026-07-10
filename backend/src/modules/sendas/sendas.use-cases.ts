type SendasRepository = ReturnType<typeof import("./sendas.repository").crearSendasRepository>;

export function crearCasosUsoSendas(repositorio: SendasRepository) {
  return {
    async listarActivas() {
      const sendas = await repositorio.listarActivas();

      return sendas.map((senda) => ({
        id: senda.id,
        codigo: senda.codigo,
        nombre: senda.nombre,
        descripcion: senda.descripcion,
        colorHex: senda.colorHex,
        nombreIcono: senda.nombreIcono,
        orden: senda.orden
      }));
    }
  };
}
