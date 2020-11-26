const axios = require('axios');
const puppeteer = require('puppeteer');
const siteUrl = 'https://dashboard.microverse.org/code_review_requests'
const slackUrl = 'https://hooks.slack.com/services/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';



async function notifyMe() {
  const res = await axios.post(slackUrl, {
    text: 'Hello Phillip, You\'ve got money to make!',
  });

  console.log('Done', res.data);
}

const run = async () => {
  console.log("opening browser...")
  const browser = await puppeteer.launch(); //{headless: false}
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
  let count = 0;
  setInterval(async () => {
    try {
      let data = await page.evaluate(() => {
        let noReview = document.querySelector('.review-request-announcement-header');
        let hoursLogged = parseInt(document.querySelector('.review-request-logged-hours').textContent);
        function getElementsByText(str, tag = 'a') {
          return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent === str);
        }
        let claimed;
        if (document.body.contains(getElementsByText("Submit Review")[0])) {
          claimed = getElementsByText("Submit Review")[0]
        } else {
          claimed = getElementsByText("Submit Review", 'button')[0]
        }

        let result;
        if (document.body.contains(noReview) || document.body.contains(claimed) || (hoursLogged >= 10)) {
          result = true
        } else {
          result = false
        }
        return {
          result
        }
      });

      if (data.result) {
        console.log('No reviews yet')
        count++;
      } else {
        await page.evaluate(() => {
          function getElementsByText(str, tag = 'a') {
            return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.textContent === str);
          }
          if (document.body.contains(getElementsByText("Claim")[0])) {
            getElementsByText("Claim")[0].click()
          } else {
            getElementsByText("Claim", 'button')[0].click()
          }
        });

        notifyMe().catch(err => console.log(err))

      }
    } catch (error) {
      console.log('an expection on ***First*** page.evaluate ', error);
    } finally {

      console.log("reloading browser...", count)
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    }

  }, 3000);
  // await browser.close();
};



run().catch(err => {
  console.log("Caught Error: ", err)
  run();
});

