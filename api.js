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
        console.log(`\nFollowing info is required for the setup, for more info check the documentation.\n`);
        console.log(`\nYour Telegram bot Request URL (POST only) is ${color.cyan}${lambdaDetails.apiUrl}/telegram${color.reset}\n`);
        console.log(`\nIf you want your bot to receive inline queries\n just send /setinline to the @BotFather on your Telegram client and choose your bot\n`);

        return prompt(['SimpleDB secrets'])
          .then(results => {
            const deployment = {
              restApiId: lambdaDetails.apiId,
              stageName: lambdaDetails.alias,
              variables: {
                simpleDBSecrets: results['SimpleDB secrets']
              }
            };

            return utils.apiGatewayPromise.createDeploymentPromise(deployment)
          });
      }
    })
    .then(() => `${lambdaDetails.apiUrl}/telegram`);
});

api.any('/echo', function (request) {
	'use strict';
	return request;
});


api.get('/greet', function (request) {
    return telegramReply(messages[0], "Coucou !", request.env.telegramAccessToken);
});

module.exports = api;
