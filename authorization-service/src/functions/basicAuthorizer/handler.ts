import type { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

const basicAuthorizer = (event: APIGatewayTokenAuthorizerEvent) => {
  const { authorizationToken } = event;

  const encodedCreds = authorizationToken.split(' ')[1];
  const buff = Buffer.from(encodedCreds, 'base64');
  const plainCreds = buff.toString('utf-8').split(':');
  const username = plainCreds[0];
  const password = plainCreds[1];

  console.log(`username: ${username} and password: ${password}`);
  const success = username && password && process.env[username] === password;
  const policy = generatePolicy(encodedCreds, event.methodArn, success);
  return policy;
};

const generatePolicy = (principalId, resource, success: boolean) => {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: {
        Action: 'execute-api:Invoke',
        Effect: success ? 'Allow' : 'Deny',
        Resource: resource,
      },
    },
  };
};
export const main = middyfy(basicAuthorizer);
