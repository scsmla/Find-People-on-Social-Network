const puppeteer = require('puppeteer');
const CRED = require('./credential');
const fs = require('fs');

const sleep = async (ms) => {
return new Promise((res, rej) => {
setTimeout(() => {
  res();
}, ms)
});
}

const ID = {
login: '#email',
pass: '#pass'
};

(async () => {
	const browser = await puppeteer.launch({
	headless: false,
	args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();

	const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
	  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
	await page.setUserAgent(userAgent);

	let login = async () => {
	// login
	await page.goto('https://facebook.com', {
	  waitUntil: 'networkidle2'
	});
	await page.waitForSelector(ID.login);
	// console.log(CRED.user);
	// console.log(ID.login);
	await page.type(ID.login, CRED.user);

	await page.type(ID.pass, CRED.pass);
	await sleep(500);

	await page.click("#loginbutton")

	console.log("Login done");
	await page.waitForNavigation();
	}

	await login();
	// await page.screenshot({
	//   path: 'facebook_logined.png'
	// });
	const context = browser.defaultBrowserContext();
	await context.overridePermissions('https://www.facebook.com/', ['notifications']);
	users = []

	//Experiment
	await page.goto('https://www.facebook.com/profile.php?id='+'100006101647408', {
    	waitUntil: 'networkidle2'
    });

    await page.waitForSelector('#fbTimelineHeadline');
    await page.click('#fbTimelineHeadline a[data-tab-key="photos"')

 //    await page.evaluate(() => {
 //    	const timeLineHeadLine = document.querySelector('#fbTimelineHeadline');
 //    	console.log(timeLineHeadLine.innerText)
	// 	// return document
	// 	// 	.querySelector('#fbTimelineHeadline')
	// 		// .querySelectorAll('a[data-tab-key="photos"]')
	// });

    // console.log(photoTag)
    
	// await page.click(photoTag);



	// fs.readFile('./data/users.txt', 'utf8', async function(err, contents) {
	//     // console.log(contents)
	//     users = contents.split(/\r?\n/)
	//     users.splice(-1,1)
	//     for (const user of users) {
	// 		user_id = JSON.stringify(JSON.parse(user).user_id)
	//   	// console.log(user_id)
	  	
	// 	  	await page.goto('https://www.facebook.com/profile.php?id='+user_id, {
	// 	      waitUntil: 'networkidle2'
	// 	    });
	// 	}
	// })
	   //  users.forEach(async (user) => {
	   //  	// console.log(user)
	  	// // Get id of user to retreive information

		  // 	user_id = JSON.stringify(JSON.parse(user).user_id)
		  // 	// console.log(user_id)
		  	
		  // 	await page.goto('https://www.facebook.com/profile.php?id='+user_id, {
		  //     waitUntil: 'networkidle2'
	   //  });




// for (let user in users) {

// 	//Get id of user to retreive information

// 	// user_id = JSON.stringify(user.user_id)
// 	// console.log(user_id)
// 	// await page.goto('https://www.facebook.com/profile.php?id='+user_id, {
//  //    waitUntil: 'networkidle2'
//  //  });

// }
})();