import { CreateProductPayload } from "@functions/createProduct/createProductPayload";
import { Client } from "pg";

const ProductsClient = {
  async getProducts() {
    const client = new Client();
    await client.connect();

    const res = await client.query(
      "SELECT * FROM products INNER JOIN stocks on products.id = stocks.product_id"
    );

    return res.rows;
  },
  async getProduct(id: string) {
    const client = new Client();
    await client.connect();
    const res = await client.query(
      `SELECT * FROM products INNER JOIN stocks on products.id = stocks.product_id where products.id='${id}'`
    );
    return Promise.resolve(res.rows[0]);
  },
  async createProduct(payload: CreateProductPayload) {
    const client = new Client();
    await client.connect();
    try {
      client.query("BEGIN TRANSACTION");

      const { title, description, price, count } = payload;
      const res = await client.query(
        `insert into products (title, description, price) values ('${title}', '${description}', ${price}) returning id`
      );
      const product_id = res.rows[0].id;

      await client.query(
        `insert into stocks (product_id, count) values ('${product_id}', ${count})`
      );

      client.query("COMMIT TRANSACTION");

      return true;
    } catch (e) {
      client.query("ROLLBACK TRANSACTION");
      return false;
    }
  },
};

export default ProductsClient;
