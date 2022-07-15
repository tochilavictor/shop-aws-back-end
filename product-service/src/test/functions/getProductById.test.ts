import ProductsClient from "src/client/productsClient";
import { getProductsById } from "src/functions/getProductsById/handler";

describe("getProductById lambda tests", () => {
  const mockProduct = {
    count: 1,
    description: "test description",
    id: "test id",
    price: 5,
    title: "test title",
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return null for getProduct missing id call", async () => {
    jest
      .spyOn(ProductsClient, "getProduct")
      .mockImplementation(() => Promise.resolve(mockProduct));

    const event = {
      pathParameters: {
        productId: mockProduct.id,
      },
    };

    const actual = await getProductsById(event, null, null);

    expect(ProductsClient.getProduct).toBeCalledTimes(1);
    expect(ProductsClient.getProduct).toBeCalledWith(mockProduct.id);
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "body": "{\\"count\\":1,\\"description\\":\\"test description\\",\\"id\\":\\"test id\\",\\"price\\":5,\\"title\\":\\"test title\\"}",
        "headers": Object {
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": "*",
        },
        "statusCode": 200,
      }
    `);
  });

  it("should return 404 when productClient returned nothing", async () => {
    jest
      .spyOn(ProductsClient, "getProduct")
      .mockImplementation(() => Promise.resolve(null));

    const event = {
      pathParameters: {
        productId: "not existing id",
      },
    };

    const actual = await getProductsById(event, null, null);

    expect(ProductsClient.getProduct).toBeCalledTimes(1);
    expect(ProductsClient.getProduct).toBeCalledWith("not existing id");
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "body": "{\\"error\\":\\"user with id not existing id not found\\"}",
        "headers": Object {
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": "*",
        },
        "statusCode": 404,
      }
    `);
  });
});
