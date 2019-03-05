const puppeteer = require('puppeteer');
const CRED = require('./credential');
const fs = require('fs');
const canvas = require('canvas');
const faceapi = require('face-api.js');
const tf-node = require('@tensorflow/tfjs-node');

const MODEL_URL = '/models'

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

// await faceapi.loadSsdMobilenetv1Model('/models')
// console.log(faceapi.nets)

const sleep = async (ms) => {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res();
			}, ms)
		});
	}

//Maybe change when FB change their layout
const ID = {
	login: '#email',
	pass: '#pass'
};

async function setUserAgent(agent, page) {
	await page.setUserAgent(agent);
}

async function clickElement(page, elementWaitedTag, elementClickedTag) {
	await page.waitForSelector(elementWaitedTag);
	await page.click(elementClickedTag)
}

async function navigatePage(page, url) {
	await page.goto(url, {
		waitUntil: 'networkidle2'
	});
}

//Maybe change when FB change their layout
async function loginFB(page, browser) {
	await page.goto('https://facebook.com', {
	  waitUntil: 'networkidle2'
	});
	await page.waitForSelector(ID.login);

	await page.type(ID.login, CRED.user);
	await page.type(ID.pass, CRED.pass);

	await sleep(500);

	await page.click("#loginbutton")

	console.log("Login done");

	await page.waitForNavigation();

	const context = browser.defaultBrowserContext();
	await context.overridePermissions('https://www.facebook.com/', ['notifications']);
}

function extractImages() {
	const extractedImages = document.querySelectorAll('div.tagWrapper');
	const images = [];

	// console.log('aaa')
	for (let image of extractedImages) {
		//Query information and profile photo of each found user
		image_info = image.querySelector('i').getAttribute('style');
		images.push(
			JSON.stringify({'image_src': image_info}
		))	
	}
	debugger;
	return images;
}

(async () => {
	const browser = await puppeteer.launch({
		headless: false,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();

	const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
	  'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';

	var url = 'https://www.facebook.com/profile.php?id=100006101647408'

	var elementWaitedTag = '#fbTimelineHeadline'
	var elementClickedTag = '#fbTimelineHeadline a[data-tab-key="photos"]'

	await setUserAgent(userAgent, page);

	await loginFB(page, browser);
	
	await navigatePage(page, url)

	await clickElement(page, elementWaitedTag, elementClickedTag)

	// await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
	// await faceapi.loadFaceLandmarkModel(MODEL_URL)
	// await faceapi.loadFaceRecognitionModel(MODEL_URL)

	items = await page.evaluate(extractImages)

	await console.log(JSON.stringify(items))
	fs.writeFileSync('./app-data/images.txt', items.join('\n') + '\n');




	// await page.evaluate(() => {
	//   		const images = document.querySelectorAll('i:not([background-image=""])');
	//   		async (() => {
	//    		for(const image of images ){
	//    			await page.click(image)
	//    			// const resultImage = document.querySelector('img')
	//    			// let fullFaceDescriptions = await faceapi
	//    			// 	.detectAllFaces(input)
	//    			// 	.withFaceLandmarks()
	//    			// 	.withFaceDescriptors()


	//    		}
	//   		})
	// });



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