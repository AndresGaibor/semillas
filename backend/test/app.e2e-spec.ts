import app from '../src/index';

describe('Semillas API (e2e)', () => {
  it('/health (GET)', async () => {
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
});
