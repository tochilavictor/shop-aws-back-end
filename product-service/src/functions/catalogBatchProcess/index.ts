import { handlerPath } from "@libs/handler-resolver";

const config = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 5,
        arn: {
          "Fn::GetAtt": ["SQSQueue", "Arn"],
        },
      },
    },
  ],
};

export default config;
