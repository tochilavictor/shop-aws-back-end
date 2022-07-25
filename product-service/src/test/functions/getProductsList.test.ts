import ProductsClient from "src/client/productsClient";
import { getProductsList } from "src/functions/getProductsList/handler";

describe("getProductsList lambda tests", () => {
  const mockProducts = [
    {
      count: 1,
      description: "test description",
      id: "test id",
      price: 5,
      title: "test title",
    },
  ];

  it("should return null for getProduct missing id call", async () => {
    jest
      .spyOn(ProductsClient, "getProducts")
      .mockImplementation(() => Promise.resolve(mockProducts));

    const actual = await getProductsList({}, null, null);

    expect(ProductsClient.getProducts).toBeCalledTimes(1);
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "body": "{\\"products\\":[{\\"count\\":1,\\"description\\":\\"test description\\",\\"id\\":\\"test id\\",\\"price\\":5,\\"title\\":\\"test title\\"}]}",
        "headers": Object {
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Origin": "*",
        },
        "statusCode": 200,
      }
    `);
  });
});
