import type { Handler } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import ProductsClient from "src/client/productsClient";

export const getProductsList: Handler = async () => {
  try {
    const products = await ProductsClient.getProducts();
    return formatJSONResponse({ products });
  } catch (e) {
    console.log("getProductsList error", e);
    return formatJSONResponse({ error: `internal server error` }, 500);
  }
};

export const main = middyfy(getProductsList);
