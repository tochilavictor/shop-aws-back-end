import { ValidationError } from "joi";
import type { Handler } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import ProductsClient from "src/client/productsClient";
import { ProductSchema, CreateProductPayload } from "./createProductPayload";

export const createProduct: Handler = async (event) => {
  try {
    const payload: CreateProductPayload = await ProductSchema.validateAsync(
      event.body
    );

    const status = await ProductsClient.createProduct(payload);
    return status
      ? formatJSONResponse({ success: true })
      : formatJSONResponse(
          {
            error: "unsuccessful create, transaction rolled back",
          },
          500
        );
  } catch (e) {
    console.log("createProduct error", e);
    if (e instanceof ValidationError) {
      return formatJSONResponse({ error: `invalid product model` }, 400);
    }
    return formatJSONResponse({ error: `internal server error` }, 500);
  }
};

export const main = middyfy(createProduct);
