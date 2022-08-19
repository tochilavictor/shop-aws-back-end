import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        authorizer: {
          arn: 'arn:aws:lambda:${self:provider.region}:${aws:accountId}:function:authorization-service-dev-authorizer',
          type: 'token',
          resultTtlInSeconds: 0,
        },
      },
    },
  ],
};
