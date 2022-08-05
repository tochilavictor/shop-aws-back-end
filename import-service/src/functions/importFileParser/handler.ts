import csv from 'csv-parser';
import S3, { CopyObjectRequest, DeleteObjectRequest } from 'aws-sdk/clients/s3';
import SQS, { SendMessageRequest } from 'aws-sdk/clients/sqs';
import type { Handler, S3Event } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Readable } from 'stream';

const s3 = new S3({ region: 'eu-west-1' });
const sqs = new SQS({ region: 'eu-west-1' });

const importFileParser: Handler = async (event: S3Event) => {
  try {
    for (const record of event.Records) {
      const { object, bucket } = record.s3;
      const params = {
        Bucket: bucket.name,
        Key: object.key,
      };

      const s3stream = s3.getObject(params).createReadStream();

      const parsedResults = await parseStreamByCSVParser(s3stream);
      for (const productParsedItem of parsedResults) {
        try {
          const sqsRequest: SendMessageRequest = {
            QueueUrl: process.env.SQS_URL,
            MessageBody: JSON.stringify(productParsedItem),
          };
          await sqs.sendMessage(sqsRequest).promise();
        } catch (e) {
          console.log('sqs write error', e);
        }
      }
      console.log('parsedResults', parsedResults);

      const success = await copyObjectToParsedFolder(bucket, object);
      if (success) {
        await deleteParsedFile(bucket, object);
        return formatJSONResponse({ success: true });
      }
    }
  } catch (e) {
    console.log('importFileParser error', e);
    return formatJSONResponse({ error: `internal server error` }, 500);
  }
};

async function deleteParsedFile(
  bucket: { name: string },
  object: { key: string }
) {
  try {
    const deleteRequest: DeleteObjectRequest = {
      Bucket: bucket.name,
      Key: object.key,
    };
    await s3.deleteObject(deleteRequest).promise();
  } catch (e) {
    console.log('delete parsed error', e);
  }
}

async function copyObjectToParsedFolder(
  bucket: { name: string },
  object: { key: string }
) {
  try {
    const copyObjectRequest: CopyObjectRequest = {
      Bucket: bucket.name,
      CopySource: `${bucket.name}/${object.key}`,
      Key: object.key.replace('uploaded/', 'parsed/'),
    };

    const result = await s3.copyObject(copyObjectRequest).promise();

    return !!result;
  } catch (e) {
    console.log('copy to parsed error', e);
  }
}

async function parseStreamByCSVParser(s3stream: Readable): Promise<Array<any>> {
  const parsedData: Array<any> = await new Promise((resolve, reject) => {
    const results = [];
    s3stream
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('error', (error) => {
        reject(error);
        console.log('parse error', error);
      })
      .on('end', () => {
        resolve(results);
      });
  });

  return parsedData;
}

export const main = middyfy(importFileParser);
