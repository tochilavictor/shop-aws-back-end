import type { Handler } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import ProductsClient from "src/client/productsClient";

export const getProductsById: Handler = async (event) => {
  console.log("getProductsByIdEvent", JSON.stringify(event));
  const { productId } = event.pathParameters;
  console.log("productIdArgument", productId);

  if (!productId) {
    return formatJSONResponse({ error: `Provide product id` }, 400);
  }

  try {
    const product = await ProductsClient.getProduct(productId);

    if (!product) {
      return formatJSONResponse(
        { error: `user with id ${productId} not found` },
        404
      );
    }

    return formatJSONResponse(product);
  } catch (e) {
    console.log("getProductsById error", e);
    return formatJSONResponse({ error: `internal server error` }, 500);
  }
};

export const main = middyfy(getProductsById);
