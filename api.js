'use strict';

const botBuilder = require('claudia-bot-builder');
const excuse = require('huh');
const sdb = require('simpledb');

const telegramReply = require('claudia-bot-builder/lib/telegram/reply.js');
const color = require('claudia-bot-builder/lib/console-colors.js');
const prompt = require('souffleur');


const messages = [];

const api = botBuilder(request => {
  console.log('Received message:', JSON.stringify(request, null, 2));
  messages.push(request);

  return `Your message is very important to us. The problem was caused by ${excuse.get()}`;
});

api.addPostDeployStep('simpleDB', (options, lambdaDetails, utils) => {
  return utils.Promise.resolve()
    .then(() => {
      if (options['configure-simpleDB']) {
        console.log(`\n\n${color.green}SimpleDB setup${color.reset}\n`);
        console.log(`\nPlease enter the IAM keys to access ${color.cyan}SimpleDB{color.reset}\n`);

        return prompt(['SimpleDB Key ID', 'SimpleDB Secret Key'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                simpleDBKEY: results['SimpleDB Key ID'],
                simpleDBSecret: results['SimpleDB Secret Key']
              }
            };

            return utils.apiGatewayPromise.createDeploymentPromise(deployment)
          });
      }
    })
    .then(() => `Configuration saved`);
});

api.any('/echo', function (request) {
	'use strict';
	return request;
});


api.get('/greet', function (request) {
    return telegramReply(messages[0], "Coucou !", request.env.telegramAccessToken);
});

module.exports = api;
