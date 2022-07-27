import ProductsClient from "src/client/productsClient";

const queryMock = jest.fn();

jest.mock("pg", () => ({
  Client: function () {
    return {
      connect: jest.fn().mockReturnValue(Promise.resolve()),
      query: queryMock,
    };
  },
}));

describe("ProductsClient tests", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return items for getProducts call", async () => {
    const mockedProducts = { rows: ["mockedDBProduct1", "mockedDBProduct2"] };
    queryMock.mockReturnValue(mockedProducts);

    const actual = await ProductsClient.getProducts();
    expect(queryMock).toBeCalledTimes(1);
    expect(queryMock).toBeCalledWith(
      "SELECT * FROM products INNER JOIN stocks on products.id = stocks.product_id"
    );
    expect(actual).toMatchInlineSnapshot(`
      Array [
        "mockedDBProduct1",
        "mockedDBProduct2",
      ]
    `);
  });

  it("should return null for getProduct missing id call", async () => {
    const mockedProducts = { rows: [] };
    queryMock.mockReturnValue(mockedProducts);

    const actual = await ProductsClient.getProduct("missing id");
    expect(queryMock).toBeCalledTimes(1);
    expect(queryMock).toBeCalledWith(
      "SELECT * FROM products INNER JOIN stocks on products.id = stocks.product_id where products.id='missing id'"
    );
    expect(actual).toBe(undefined);
  });

  it("should return found product for correct id", async () => {
    const mockedProducts = {
      rows: [{ id: "targetId", data: "mockedDBProduct1" }],
    };
    queryMock.mockReturnValue(mockedProducts);

    const actual = await ProductsClient.getProduct("targetId");
    expect(queryMock).toBeCalledTimes(1);
    expect(queryMock).toBeCalledWith(
      "SELECT * FROM products INNER JOIN stocks on products.id = stocks.product_id where products.id='targetId'"
    );
    expect(actual).toMatchInlineSnapshot(
      {},
      `
      Object {
        "data": "mockedDBProduct1",
        "id": "targetId",
      }
    `
    );
  });
});
