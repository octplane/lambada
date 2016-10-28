'use strict';

const botBuilder = require('claudia-bot-builder');
const excuse = require('huh');

const telegramReply = require('claudia-bot-builder/lib/telegram/reply.js');

const messages = [];

const api = botBuilder(request => {
  console.log('Received message:', JSON.stringify(request, null, 2));
  messages.push(request);

  return `Your message is very important to us. The problem was caused by ${excuse.get()}`;
});

api.any('/echo', function (request) {
	'use strict';
	return request;
});


api.get('/greet', function (request) {
    return telegramReply(messages[0], "Coucou !", request.env.telegramAccessToken);
});

module.exports = api;
