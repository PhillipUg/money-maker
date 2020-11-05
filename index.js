const axios = require('axios');
const puppeteer = require('puppeteer');
const siteUrl = 'https://dashboard.microverse.org/code_review_requests'
const slackUrl = 'https://hooks.slack.com/services/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';

// run().catch(err => console.log(err));

async function notifyMe() {
  const res = await axios.post(slackUrl, {
    text: 'Hello Phillip, You\'ve got money to make!',
  });

  console.log('Done', res.data);
}


const run = async () => {
  console.log("opening browser...")
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log("accessing url...")
  await page.goto(siteUrl, { waitUntil: 'networkidle0' });
  console.log("logging in...")
  await page.type('input[type="email"]', "phillipmusiime@gmail.com")
  await page.type('input[type="password"]', "XuN6crut")
  // await page.screenshot({ path: 'example.png' });
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ])

  // const cookies = await page.cookies();
  // console.log(cookies)
  console.log("going to code review page...")
  await Promise.all([
    page.click('.ca-sidebar-code-review-requests'),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ])

  let data = await page.evaluate(() => {
    let element = document.querySelector('.review-request-announcement-header');
    let result;
    if (document.body.contains(element) && element.textContent === "No Available Reviews") {
      result = true
    } else {
      result = false
    }
    return {
      result
    }
  })
  // console.log(data)
  if (data.result) {
    console.log('No reviews yet')
  } else {
    notifyMe()
    // console.log('present', data)
  }
  console.log("closing browser...")
  await browser.close();
};



setInterval(() => {
  run();
}, 60000);