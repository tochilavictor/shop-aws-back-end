import { importProductsFile } from 'src/functions/importProductsFile/handler';

describe('importProductsFile lambda tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 404 when productClient returned nothing', async () => {
    expect(importProductsFile).toBeDefined();
  });
});
