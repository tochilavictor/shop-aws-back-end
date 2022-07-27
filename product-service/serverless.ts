import type { AWS } from "@serverless/typescript";

import env from "./env.json";
import getProductsList from "@functions/getProductsList";
import getProductsById from "@functions/getProductsById";
import createProduct from "@functions/createProduct";

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: ["serverless-webpack", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PGHOST: env.PGHOST,
      PGPORT: env.PGPORT,
      PGDATABASE: env.PGDATABASE,
      PGUSER: env.PGUSER,
      PGPASSWORD: env.PGPASSWORD,
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct },
  package: { individually: true },
  custom: {
    webpack: {
      webpackConfig: "webpack.config.js",
      includeModules: true,
      packager: "yarn",
      excludeFiles: "src/**/*.test.js",
    },
  },
};

module.exports = serverlessConfiguration;
