const { SES } = require('aws-sdk');

const ses = new SES();

/**
 * Lambda handler, received a SNS event.
 * https://docs.aws.amazon.com/en_pv/lambda/latest/dg/with-sns.html
 * @param {*} event {
 *                    "Records": [
 *                      {
 *                        "EventVersion": "1.0",
 *                        "EventSubscriptionArn": "arn:aws:sns:us-east-2:123456789012:sns-lambda:21be56ed-a058-49f5-8c98-aedd2564c486",
 *                        "EventSource": "aws:sns",
 *                        "Sns": {
 *                          "SignatureVersion": "1",
 *                          "Timestamp": "2019-01-02T12:45:07.000Z",
 *                          "Signature": "tcc6faL2yUC6dgZdmrwh1Y4cGa/ebXEkAi6RibDsvpi+tE/1+82j...65r==",
 *                          "SigningCertUrl": "https://sns.us-east-2.amazonaws.com/SimpleNotificationService-ac565b8b1a6c5d002d285f9598aa1d9b.pem",
 *                          "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
 *                          "Message": "Hello from SNS!",
 *                          "MessageAttributes": {
 *                            "Test": {
 *                              "Type": "String",
 *                              "Value": "TestString"
 *                            },
 *                            "TestBinary": {
 *                              "Type": "Binary",
 *                              "Value": "TestBinary"
 *                            }
 *                          },
 *                          "Type": "Notification",
 *                          "UnsubscribeUrl": "https://sns.us-east-2.amazonaws.com/?Action=Unsubscribe&amp;SubscriptionArn=arn:aws:sns:us-east-2:123456789012:test-lambda:21be56ed-a058-49f5-8c98-aedd2564c486",
 *                          "TopicArn":"arn:aws:sns:us-east-2:123456789012:sns-lambda",
 *                          "Subject": "TestInvoke"
 *                        }
 *                      }
 *                    ]
 *                  }
 */
module.exports.handler = async (event) => {
  console.log(event);
  const { Message: message, MessageId: messageId } = event.Records[0].Sns; // Get SNS message from event

  /*
    If SNS message is a stringify JSON, you need to parse it.
    In this example, message would look like:
    {
      to: ['bob@supplierdomain.com'],
      from: 'alice@yourdomain.com',
      body: 'You have a new pending order.',
      subject: 'Order #1',
    }
  */
  const {
    to,
    bcc,
    cc,
    reply,
    body,
    subject,
    from,
  } = JSON.parse(message);

  // Parameters for sending mail using ses.sendEmail()
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
  const params = {
    Destination: {
      BccAddresses: bcc,
      CcAddresses: cc,
      ToAddresses: to,
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    ReplyToAddresses: reply,
    Source: from,
  };
  console.log(params);
  await ses.sendEmail(params).promise();

  return messageId;
};
