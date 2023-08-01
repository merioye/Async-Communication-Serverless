import { SQSEvent, SQSBatchItemFailure } from "aws-lambda";

const processEvent = async (event: SQSEvent) => {
  const batchItemFailures: SQSBatchItemFailure[] = [];
  const records = event.Records;
  if (records.length) {
    for (const record of records) {
      try {
        console.log("Received Record: ", record.body);
        console.log(`Successfully processed: ${record.messageId}`);
      } catch (err) {
        batchItemFailures.push({ itemIdentifier: record.messageId });
      }
    }
  }

  return { batchItemFailures };
};

export { processEvent };
