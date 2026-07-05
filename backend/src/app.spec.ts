import app from './index';

describe('Hono API', () => {
  it('responde el estado de salud', async () => {
    const respuesta = await app.request('/health');

    expect(respuesta.status).toBe(200);
    await expect(respuesta.json()).resolves.toEqual({
      success: true,
      data: {
        service: 'semillas-api',
        status: 'ok',
      },
    });
  });

  it('responde la ruta inicial', async () => {
    const respuesta = await app.request('/');

    expect(respuesta.status).toBe(200);
    await expect(respuesta.json()).resolves.toEqual({
      success: true,
      data: {
        message: 'Semillas API',
      },
    });
  });
});
