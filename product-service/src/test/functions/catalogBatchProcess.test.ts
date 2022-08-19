import ProductsClient from "src/client/productsClient";
import { catalogBatchProcess } from "src/functions/catalogBatchProcess/handler";
import { CreateProductPayload } from "@functions/createProduct/createProductPayload";

const publishMoq = jest
  .fn()
  .mockReturnValue({ promise: () => Promise.resolve(true) });

jest.mock("aws-sdk/clients/sns", () => {
  return function () {
    return {
      publish: (...args) => publishMoq(...args),
    };
  };
});

describe("catalogBatchProcess lambda tests", () => {
  it("should call ProductClient for each record", async () => {
    const testProductOne: CreateProductPayload = {
      price: 5,
      count: 100,
      title: "test title one",
      description: "test description",
    };
    const testProductTwo: CreateProductPayload = {
      ...testProductOne,
      title: "test title two",
    };
    const event = {
      Records: [
        { body: JSON.stringify(testProductOne) },
        { body: JSON.stringify(testProductTwo) },
      ],
    };

    jest
      .spyOn(ProductsClient, "createProduct")
      .mockImplementation(() => Promise.resolve(true));

    await catalogBatchProcess(event, null, null);

    expect(ProductsClient.createProduct).toBeCalledTimes(2);
    expect(ProductsClient.createProduct).toHaveBeenNthCalledWith(
      1,
      testProductOne
    );
    expect(ProductsClient.createProduct).toHaveBeenNthCalledWith(
      2,
      testProductTwo
    );
    expect(publishMoq).toBeCalledTimes(1);
    expect(publishMoq).toBeCalledWith({
      Message:
        '["{\\"price\\":5,\\"count\\":100,\\"title\\":\\"test title one\\",\\"description\\":\\"test description\\"}","{\\"price\\":5,\\"count\\":100,\\"title\\":\\"test title two\\",\\"description\\":\\"test description\\"}"]',
      Subject: "products were created from batched sns",
      TopicArn: undefined,
    });
  });
});
