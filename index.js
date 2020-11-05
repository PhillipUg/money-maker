const axios = require('axios');

run().catch(err => console.log(err));

async function run() {
  const url = 'https://hooks.slack.com/services/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';
  const res = await axios.post(url, {
    text: 'Hello Phillip, You\'ve got money to make!',
    icon_emoji: ':+1:'
  });

  console.log('Done', res.data);
}