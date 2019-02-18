// var express = require('express');
// var fs = require('fs');
// var request = require('request');
// var cheerio = require('cheerio');
// var app     = express();
// var puppeteer = require('puppeteer');

const fs = require('fs');
const puppeteer = require('puppeteer');

//Defind the url to get data
url = 'https://vi-vn.facebook.com/public/Thang+Vu'

function extractItems() {
  //Defind the variable to capture user and their info	
  const extractedUsers = document.querySelectorAll('div._4p2o');
  const users = [];
  
  for (let user of extractedUsers) {
  	//Query information and profile photo of each found user
  	user_info = user.querySelector('div').getAttribute('data-bt');
  	user_profile_photo_source = user.querySelector('div img').getAttribute('src')

    users.push(
    	JSON.stringify({'user_id': JSON.parse(user_info).id, 
    		'user_profile_photo_source':user_profile_photo_source
    	})
    )
    	
  }
  return users;
}

//Keep scroll as possible as can
async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000,
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(e) { }
  return items;
}

(async () => {
  // Set up browser and page.
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 10000 });

  // Navigate to the demo page.
  await page.goto(url);

  // Scroll and extract items from the page.
  const items = await scrapeInfiniteScrollItems(page, extractItems, 100);

  // Save extracted items to a file.
  fs.writeFileSync('./users.txt', items.join('\n') + '\n');

  // Close the browser.
  await browser.close();
})();
