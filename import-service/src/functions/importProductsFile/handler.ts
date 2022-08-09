import { ValidationError } from 'joi';
import S3 from 'aws-sdk/clients/s3';
import type { Handler } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ImportFilePayload, ImportFileSchema } from './importFilePayload';

export const importProductsFile: Handler = async (event) => {
  try {
    const payload: ImportFilePayload = await ImportFileSchema.validateAsync(
      event.queryStringParameters
    );
    const s3 = new S3({ region: 'eu-west-1' });

    const params = {
      Bucket: 'cloudx-s3-import',
      Key: `uploaded/${payload.name}`,
      Expires: 60,
      ContentType: 'text/csv',
    };

    const signedUrl = await new Promise((resolve, reject) =>
      s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
          reject(err);
        }
        resolve(url);
      })
    );

    return formatJSONResponse({
      signedUrl,
    });
  } catch (e) {
    console.log('importProductsFile error', e);
    if (e instanceof ValidationError) {
      return formatJSONResponse({ error: `missing filename parameter` }, 400);
    }
    return formatJSONResponse({ error: `internal server error` }, 500);
  }
};

export const main = middyfy(importProductsFile);
