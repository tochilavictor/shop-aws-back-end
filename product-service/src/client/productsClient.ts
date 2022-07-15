import productList from "./productList.json";

const ProductsClient = {
  async getProducts() {
    return Promise.resolve(productList);
  },
  async getProduct(id: string) {
    const product = productList.find((i) => i.id === id);
    return Promise.resolve(product);
  },
};

export default ProductsClient;
