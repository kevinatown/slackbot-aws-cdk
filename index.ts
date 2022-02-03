import apigateway = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import events = require('@aws-cdk/aws-events');
import targets = require('@aws-cdk/aws-events-targets');

export class SlackBotStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const botTable = new dynamodb.Table(this, 'botTable', {
      partitionKey: {
        name: 'teamId',
        type: dynamodb.AttributeType.STRING
      },
      tableName: 'bots',

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to 
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });


    // creating a lambda 
    const funRetroLambda = new lambda.Function(this, 'funRetroLambda', {
      code: new lambda.AssetCode('src'),
      handler: 'funretroHandler.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: cdk.Duration.seconds(350),
      memorySize: 240
    });

    // 
    // Run every friday at 8PM UTC (3pm EDT, 4pm EST)
    // See https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html
    const rule = new events.Rule(this, 'Rule', {
      schedule: events.Schedule.expression('cron(0 20 ? * FRI *)')
    });

    rule.addTarget(new targets.LambdaFunction(funRetroLambda));
 
    const standupLambda = new lambda.Function(this, 'standupLambda', {
      code: new lambda.AssetCode('src'),
      handler: 'standupHandler.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: cdk.Duration.seconds(350),
      memorySize: 240
    });

    // Run every MON-FRI at 3PM UTC (10 am EDT, 11 EST)
    const standupRule = new events.Rule(this, 'standupRule', {
      schedule: events.Schedule.expression('cron(0 15 ? * MON-FRI *)')
    });

    standupRule.addTarget(new targets.LambdaFunction(standupLambda));

    const slackReceiveLambda = new lambda.Function(this, 'SlackBotLambda', {
      code: new lambda.AssetCode('src'),
      handler: 'handler.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      timeout: cdk.Duration.seconds(350),
      environment: {
        TABLE_NAME: botTable.tableName,
        PRIMARY_KEY: 'teamId'
      }
    });
    botTable.grantReadWriteData(slackReceiveLambda);

    const api = new apigateway.RestApi(this, 'SlackBotApi', {
      restApiName: 'SlackBot'
    });

    const slack = api.root.addResource('api');
    const slackReceive = slack.addResource('messages');
    const installResource = api.root.addResource('install');
    const oauth = installResource.addResource('auth');

    const slackReceiveIntegration = new apigateway.LambdaIntegration(slackReceiveLambda);
    slackReceive.addMethod('GET', slackReceiveIntegration);
    slackReceive.addMethod('POST', slackReceiveIntegration);
    installResource.addMethod('GET', slackReceiveIntegration);
    oauth.addMethod('POST', slackReceiveIntegration);
    oauth.addMethod('GET', slackReceiveIntegration);
  }
}

const app = new cdk.App();
new SlackBotStack(app, 'SlackBot');
app.synth();
