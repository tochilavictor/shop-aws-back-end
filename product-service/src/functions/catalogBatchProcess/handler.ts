import { ValidationError } from "joi";
import type { Handler, SQSEvent } from "aws-lambda";
import SNS, { PublishInput } from "aws-sdk/clients/sns";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import ProductsClient from "src/client/productsClient";
import {
  ProductSchema,
  CreateProductPayload,
} from "../createProduct/createProductPayload";

const sns = new SNS({ region: "eu-west-1" });

export const catalogBatchProcess: Handler = async (event: SQSEvent) => {
  try {
    let lowestPrice: Number = null;
    for (const item of event.Records) {
      const payload: CreateProductPayload = JSON.parse(item.body);
      await ProductSchema.validateAsync(payload);
      if (lowestPrice === null || lowestPrice > payload.price) {
        lowestPrice = payload.price;
      }
      const status = await ProductsClient.createProduct(payload);
      console.log("productCreationStatus", status);
      if (!status) {
        formatJSONResponse(
          {
            error: "unsuccessful create, transaction rolled back",
          },
          500
        );
      }
    }

    const publishInput: PublishInput = {
      Subject: "products were created from batched sns",
      Message: JSON.stringify(event.Records.map((r) => r.body)),
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        price: {
          DataType: "Number",
          StringValue: lowestPrice.toString(),
        },
      },
    };

    await sns.publish(publishInput).promise();
  } catch (e) {
    console.log("catalogBatchProcess error", e);
    if (e instanceof ValidationError) {
      return formatJSONResponse({ error: `invalid product model` }, 400);
    }
    return formatJSONResponse({ error: `internal server error` }, 500);
  }
};

export const main = middyfy(catalogBatchProcess);
