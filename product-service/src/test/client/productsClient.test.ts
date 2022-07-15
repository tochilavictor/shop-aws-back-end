import ProductsClient from "src/client/productsClient";

describe("ProductsClient tests", () => {
  it("should return items for getProducts call", async () => {
    const actual = await ProductsClient.getProducts();
    expect(actual).toMatchInlineSnapshot(`
      Array [
        Object {
          "count": 100,
          "description": "Billy Herrington t-shirt",
          "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
          "price": 300,
          "title": "Billy",
        },
        Object {
          "count": 6,
          "description": "Ricardo Millos t-shirt",
          "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
          "price": 3,
          "title": "Ricardo",
        },
        Object {
          "count": 7,
          "description": "Van Darkholme t-shirt",
          "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
          "price": 4.99,
          "title": "Van",
        },
        Object {
          "count": 7,
          "description": "Gigashad t-shirt",
          "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
          "price": 202,
          "title": "Giga",
        },
        Object {
          "count": 25,
          "description": "Ryan Gosling barbie t-shirt",
          "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a4",
          "price": 20,
          "title": "Barbie",
        },
        Object {
          "count": 22,
          "description": "Ryan Gosling blade runner t-shirt",
          "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a4",
          "price": 20,
          "title": "blade runner",
        },
      ]
    `);
  });

  it("should return null for getProduct missing id call", async () => {
    const actual = await ProductsClient.getProduct("missing id");
    expect(actual).toBe(undefined);
  });

  it("should return found product for correct id", async () => {
    const actual = await ProductsClient.getProduct("missing id");
    expect(actual).toBe(undefined);
  });
});
