import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { plainToInstance } from "class-transformer";
import { PutEventDto } from "../dtos";
import { errorResponse, successResponse, validateBody } from "../helpers";

const snsClient = new SNSClient({
  region: "us-east-1",
});

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

const putEvent = middy(async (event: APIGatewayProxyEventV2) => {
  const bodyInstance = plainToInstance(PutEventDto, event.body);
  const error = await validateBody(bodyInstance);
  if (error) return errorResponse(400, error);

  try {
    const command = new PublishCommand({
      Message: event.body,
      TopicArn: SNS_TOPIC_ARN,
    });
    await snsClient.send(command);
    return successResponse("Message published successfully");
  } catch (err) {
    return errorResponse(500, err);
  }
}).use(bodyParser());

export { putEvent };
