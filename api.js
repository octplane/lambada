'use strict';

const botBuilder = require('claudia-bot-builder');
const excuse = require('huh');
const rp = require('request-promise');
const cheerio = require('cheerio');

const telegramReply = require('claudia-bot-builder/lib/telegram/reply.js');
const color = require('claudia-bot-builder/lib/console-colors.js');
const prompt = require('souffleur');

const messages = [];

const api = botBuilder(request => {
  console.log('Received message:', JSON.stringify(request, null, 2));
  messages.push(request);

  return `Your message is very important to us (we have ${messages.length} messages). The problem was caused by ${excuse.get()}`;
});

api.any('/echo', function (request) {
	'use strict';
	return request;
});

api.post('/greet', function (request) {
    console.log('Received message:', JSON.stringify(request, null, 2));
    return telegramReply(messages[0], "hop!", request.env.telegramAccessToken);
});

api.get('/jquery', (request) => {
  'use strict';
  const url = request.queryString.url;
  const selectors = request.queryString.selectors.split(",");
  console.log(`Url is ${url} and selectors are ${JSON.stringify(selectors, null, 2)}.`)
  return rp(
    {
      uri: url,
      transform: (body) => { return cheerio.load(body); }
    }
  ).then(($) => {
     return selectors.reduce(
       (h, sel) => {
         h[sel]=$(sel).html();
        return h;
      }, {});
  }).catch((err) => {
    return JSON.stringify(err, null, 2);
  });
});


module.exports = api;
