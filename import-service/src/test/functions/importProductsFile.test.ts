import { importProductsFile } from 'src/functions/importProductsFile/handler';

const getSignedUrlMock = jest.fn();

jest.mock('aws-sdk/clients/s3', () => {
  return function () {
    return {
      getSignedUrl: getSignedUrlMock,
    };
  };
});

describe('importProductsFile lambda tests', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 400 error for invalid event without name in qs', async () => {
    const result = await importProductsFile(
      { queryStringParameters: {} },
      null,
      null
    );

    expect(getSignedUrlMock).not.toHaveBeenCalled();
    expect(result).toMatchInlineSnapshot(`
      Object {
        "body": "{\\"error\\":\\"missing filename parameter\\"}",
        "statusCode": 400,
      }
    `);
  });

  it('should call s3 get signed url with correct params', async () => {
    let operationValue, paramsValue;
    getSignedUrlMock.mockImplementation((operation, params, callback) => {
      operationValue = operation;
      paramsValue = params;
      callback(null, 'signed_url_value');
    });

    const result = await importProductsFile(
      { queryStringParameters: { name: 'test_file.csv' } },
      null,
      null
    );

    expect(getSignedUrlMock).toBeCalledTimes(1);
    expect(operationValue).toBe('putObject');
    expect(paramsValue).toMatchInlineSnapshot(`
      Object {
        "Bucket": "cloudx-s3-import",
        "ContentType": "text/csv",
        "Expires": 60,
        "Key": "uploaded/test_file.csv",
      }
    `);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "body": "{\\"signedUrl\\":\\"signed_url_value\\"}",
        "statusCode": 200,
      }
    `);
  });
});
