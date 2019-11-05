sns-ses-demo
============================
​
This repo is an example of a Lambda function trigerred by SNS to send an email through SES.

​This repo accompanies our three posts about how the Precogs team moved infrastructure and code from Ruby on Rails to a serverless environment. Follow these links to read part [one](https://medium.com/precogs-tech/dirty-old-code-part-1-e1135ac94acd), [two](https://medium.com/precogs-tech/dirty-old-code-part-2-e223590bff52) and [three]().

### Technical architecture
![Architecture diagram](https://raw.githubusercontent.com/baipi/sns-ses-demo/master/readmeFiles/architecture.png)
​
This project creates a Lambda function (`emailSender`) and an SNS topic (`orderConfirmed`). To publish a message to SNS topic you can use:
- [API Gateway](https://www.alexdebrie.com/posts/aws-api-gateway-service-proxy/)
- [an other Lambda](https://docs.aws.amazon.com/en_pv/sdk-for-javascript/v2/developer-guide/sns-examples-publishing-messages.html)
- [the AWS cli](https://docs.aws.amazon.com/cli/latest/reference/sns/publish.html)
- ... or which ever programming language with the AWS SDK.
​
### Setting up SES
In order to use this project, you need to setup a valid SES domain to send mail. All instructions are provided on the [AWS SES documentation page](https://docs.aws.amazon.com/en_pv/ses/latest/DeveloperGuide/setting-up-email.html).
​
### How to deploy?
- Install [Serverless Framework](https://serverless.com):
```
npm i -g serverless
```
​
- Clone this repo:
```
git clone https://github.com/baipi/sns-ses-demo.git
```
​
- Edit `serverless.yml` file:
Update `custom.domainName` line with your domain name.
​
- Deploy project
```
serverless deploy
```
​
### How to use?
The easiest way to test it is to use the AWS cli. For this you will need your AWS account id.
​
- Get the account ID:
```
aws sts get-caller-identity
​
{
    "UserId": "ABCDEFGHIJKLMNOP",
    "Account": "000123456789",
    "Arn": "arn:aws:iam::000123456789:user/Name"
}
```
The account ID is the number on the `Account` key.
​
- Publish a message
```
aws sns publish --topic-arn "arn:aws:sns:us-east-1:<AWS_ACCOUNT_ID>:orderConfirmed" --message '{"to":["bob@supplierdomain.com"],"from":"alice@yourdomain.com","body":"You have a new pending order.","subject":"Order #1"}' --region us-east-1
```